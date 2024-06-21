import React, { useEffect, useRef, useState } from 'react';
import { Form, InputNumber, Spin } from 'antd';
import { useWebLogin } from 'aelf-web-login';
import treasuryIconSrc from 'assets/imgs/treasury-icon.svg';
import { Button, FontWeightEnum, Typography, Input, HashAddress } from 'aelf-design';
import { RightArrowOutlined } from '@aelf-design/icons';
import { callContract, callViewContract } from 'contract/callContract';
import CommonModal from 'components/CommonModal';
import { GetBalanceByContract, GetTokenInfo } from 'contract/callContract';
import { emitLoading, eventBus, ResultModal } from 'utils/myEvent';
import { curChain, explorer, sideChainAddress, treasuryContractAddress } from 'config';
import { CommonOperationResultModalType } from 'components/CommonOperationResultModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INIT_RESULT_MODAL_CONFIG } from 'components/ResultModal';
import { IContractError } from 'types';
import { fetchAddressTransferList, fetchTokenInfo, fetchTreasuryAssets } from 'api/request';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { divDecimals, timesDecimals } from 'utils/calculate';
import './index.css';
import { ButtonCheckLogin } from 'components/ButtonCheckLogin';
import { EProposalActionTabs } from 'app/proposal/deploy/[daoId]/type';
import { useAsyncEffect, useRequest } from 'ahooks';
import useTokenListData from 'hooks/useTokenListData';
import { checkIsOut } from 'utils/transaction';
import { numberFormatter } from 'utils/numberFormatter';
import { SkeletonLine } from 'components/Skeleton';
import { getExploreLink } from 'utils/common';
import TreasuryNoTxGuide, { ITreasuryNoTxGuideRef } from 'components/TreasuryNoTxGuide';
import ViewMoreButton from 'components/ViewMoreButton';
const formSymbol = 'symbol';
const formAmount = 'amount';
interface IProps {
  clssName?: string;
  daoData: IDaoInfoData;
  createProposalCheck?: (customRouter?: boolean) => Promise<boolean>;
  // Define your component's props here
}
const LoadCount = 5;
const Treasury: React.FC<IProps> = (props) => {
  const { clssName, daoData, createProposalCheck } = props;
  const [form] = Form.useForm();
  const [choiceOpen, setChoiceOpen] = useState(false);
  // const [isValidatedSymbol, setIsValidatedSymbol] = useState(false);
  // const [depoistOpen, setDepoistOpen] = useState(false);
  // const [depositLoading, setDepositLoading] = useState(false);
  const treasuryNoTxGuideref = useRef<ITreasuryNoTxGuideRef>(null);
  const decimalsRef = useRef<number>(8);
  const router = useRouter();

  const { creator, id } = daoData ?? {};

  // treasuryAddress
  const { data: treasuryAddress, loading: treasuryAddressLoading } = useRequest(async () => {
    // fetchTreasuryAssets({
    //   daoId: id,
    //   chainId: curChain,
    // }),
    const res = await callViewContract<string, string>(
      'GetTreasuryAccountAddress',
      id,
      treasuryContractAddress,
    );
    return res;
  });
  const { tokenList, totalValueUSD, tokenListLoading } = useTokenListData({
    address: treasuryAddress,
    currentChain: curChain,
  });
  const {
    data: transferListData,
    // error: transferListError,
    loading: transferListLoading,
    run,
  } = useRequest(
    () => {
      return fetchAddressTransferList(
        {
          address: treasuryAddress ?? '',
          pageSize: 6,
          pageNum: 1,
        },
        curChain,
      );
    },
    {
      manual: true,
    },
  );
  const { wallet } = useWebLogin();
  const [createProposalLoading, setCreateProposalLoading] = useState(false);
  const handleCreateProposal = async () => {
    setCreateProposalLoading(true);
    try {
      const checkRes = await createProposalCheck?.(true);
      if (checkRes) {
        router.push(`/proposal/deploy/${daoData?.id}?tab=${EProposalActionTabs.TREASURY}`);
      }
    } catch (error) {
      console.log('handleCreateProposal', error);
    } finally {
      setCreateProposalLoading(false);
    }
  };
  const initTreasury = async () => {
    try {
      const params = {
        daoId: daoData?.id,
      };
      emitLoading(true, 'The changes is being processed...');
      const res = await callContract('CreateTreasury', params, treasuryContractAddress);
      emitLoading(false);
      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Success,
        primaryContent: 'Enable Treasury successfully.',
        footerConfig: {
          buttonList: [
            {
              onClick: () => {
                eventBus.emit(ResultModal, INIT_RESULT_MODAL_CONFIG);
              },
              children: 'OK',
            },
          ],
        },
      });
    } catch (error) {
      const err = error as IContractError;
      emitLoading(false);
      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Error,
        primaryContent: 'Enable Treasury Error',
        secondaryContent: err?.errorMessage?.message || err?.message,
        footerConfig: {
          buttonList: [
            {
              children: <span>OK</span>,
              onClick: () => {
                eventBus.emit(ResultModal, INIT_RESULT_MODAL_CONFIG);
              },
            },
          ],
        },
      });
    }
  };
  // const currentSymbol =
  // useAsyncEffect(async () => {
  //   if (isValidatedSymbol) {
  //     const { balance } = await GetBalanceByContract(
  //       {
  //         symbol: info?.symbol || 'ELF',
  //         owner: walletInfo.address,
  //       },
  //       { chain: curChain },
  //     );
  //     // aelf decimal 8
  //     setElfBalance(divDecimals(balance, info?.decimal || '8').toNumber());
  //   }
  // }, [isValidatedSymbol, currentSymbol]);
  useEffect(() => {
    if (treasuryAddress) {
      run();
    }
  }, [treasuryAddress]);
  const cls = `${clssName} treasury-wrap border-0 lg:border lg:mb-[10px] border-Neutral-Divider border-solid rounded-lg bg-white px-4 lg:px-8  lg:py-6`;
  const existTransaction = transferListData?.data?.total && transferListData?.data?.total > 0;
  const showLoadMore = (transferListData?.data?.total ?? 0) > LoadCount;
  return (
    <div className={cls}>
      {treasuryAddressLoading ? (
        <SkeletonLine />
      ) : (
        <>
          {!treasuryAddress && (
            <div className="flex flex-col items-center">
              <img src={treasuryIconSrc} alt="" className="treasury-icon" />
              <h3 className="assets-title">Treasury Assets</h3>
              <p className="assets-help-message assets-help-message-text-wrap">
                The treasury function is not currently enabled for this DAO.
              </p>
              {wallet.address === creator && (
                <Button className="w-[172px] mt-6" type="primary" onClick={initTreasury}>
                  Enable Treasury
                </Button>
              )}
            </div>
          )}
          {treasuryAddress &&
            (transferListLoading ? (
              <SkeletonLine />
            ) : (
              <>
                <div className={existTransaction ? 'block' : 'hidden'}>
                  <h2 className="card-title">Treasury Assets</h2>
                  <div className="flex items-center mt-6 mb-12">
                    <p className="usd-value">$ {totalValueUSD}</p>
                    <ButtonCheckLogin
                      type="primary"
                      onClick={() => {
                        setChoiceOpen(true);
                      }}
                      className="!h-[30px]"
                      size="medium"
                    >
                      New transfer
                    </ButtonCheckLogin>
                  </div>
                  <div>
                    <p className="flex justify-between">
                      <span className="card-title mb-6">Transactions</span>
                      {showLoadMore && (
                        <Link href={`/dao/${daoData?.id}/treasury`}>
                          <ViewMoreButton />
                        </Link>
                      )}
                    </p>
                    <ul>
                      {transferListData?.data?.list?.slice(0, LoadCount).map((item) => {
                        const isOut = checkIsOut(treasuryAddress, item);
                        return (
                          <li className="treasury-info-item" key={item.txId}>
                            <div className="flex justify-between treasury-info-item-line-1 ">
                              <span className="">
                                {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}{' '}
                                {isOut ? 'Withdraw' : 'Deposit'}
                              </span>
                              <span>
                                {numberFormatter(item.amount)} {item.symbol}
                              </span>
                            </div>
                            <div className="treasury-info-item-line-2 text-14-22-500">
                              <span>Transaction ID:</span>
                              <Link href={`${explorer}/tx/${item.txId}`} target="_blank">
                                <HashAddress
                                  className="pl-[4px]"
                                  ignorePrefixSuffix={true}
                                  preLen={8}
                                  endLen={11}
                                  address={item.txId}
                                ></HashAddress>
                              </Link>
                            </div>
                            <div className="treasury-info-item-line-3 text-14-22-500">
                              <span>Address:</span>
                              <Link
                                href={`${explorer}/address/${isOut ? item.to : item.from}`}
                                target="_blank"
                              >
                                <HashAddress
                                  className="pl-[4px]"
                                  preLen={8}
                                  endLen={11}
                                  address={isOut ? item.to : item.from}
                                  chain={curChain}
                                ></HashAddress>
                              </Link>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <TreasuryNoTxGuide
                  ref={treasuryNoTxGuideref}
                  address={treasuryAddress}
                  className={existTransaction ? 'hidden' : 'block'}
                />
              </>
            ))}
        </>
      )}
      {/* choice: Deposit /  WithDraw*/}
      <CommonModal
        open={choiceOpen}
        title={<div className="text-center">New transfer</div>}
        wrapClassName="choice-modal-wrap"
        destroyOnClose
        onCancel={() => {
          setChoiceOpen(false);
        }}
        className="treasury-choice-modal"
      >
        <ul className="choice-items">
          <li className="choice-item">
            <p className="choice-item-text-subtitle">Send assets to the DAO treasury</p>
            <Button
              type="primary"
              onClick={() => {
                // setDepoistOpen(true);
                treasuryNoTxGuideref.current?.setDepoistOpen(true);
                setChoiceOpen(false);
              }}
              className="choice-item-btn"
            >
              Deposit
            </Button>
          </li>
          <li className="choice-item">
            <p className="choice-item-text-subtitle">Create a proposal to withdraw assets</p>
            <Button
              loading={createProposalLoading}
              onClick={handleCreateProposal}
              className="choice-item-btn"
            >
              Withdraw
            </Button>
          </li>
        </ul>
      </CommonModal>
    </div>
  );
};

export default Treasury;
