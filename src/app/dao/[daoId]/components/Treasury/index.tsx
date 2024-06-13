import React, { useEffect, useRef, useState } from 'react';
import { Form, InputNumber, Spin } from 'antd';
import { useWebLogin } from 'aelf-web-login';
import { Button, FontWeightEnum, Typography, Input, HashAddress } from 'aelf-design';
import { RightArrowOutlined } from '@aelf-design/icons';
import { callContract, callViewContract } from 'contract/callContract';
import CommonModal from 'components/CommonModal';
import { GetBalanceByContract, GetTokenInfo } from 'contract/callContract';
import { emitLoading, eventBus, ResultModal } from 'utils/myEvent';
import { curChain, daoAddress, explorer, sideChainAddress, treasuryContractAddress } from 'config';
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
import { useRequest } from 'ahooks';
import useTokenListData from 'hooks/useTokenListData';
import { checkIsOut } from 'utils/transaction';
import { numberFormatter } from 'utils/numberFormatter';
import { SkeletonLine, SkeletonList } from 'components/Skeleton';

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
  const [depoistOpen, setDepoistOpen] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
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
  const handleDeposit = async () => {
    setDepositLoading(true);
    const formRes = await form?.validateFields().catch((err) => {
      console.log(err);
      return null;
    });
    setDepositLoading(false);
    if (!formRes) return;
    setDepoistOpen(false);
    try {
      const { symbol, amount } = formRes;
      const params = {
        symbol,
        amount: timesDecimals(amount, decimalsRef.current).toNumber(),
        to: treasuryAddress,
      };
      console.log(formRes);
      emitLoading(true, 'The deposit is being processed...');
      const res = await callContract('Transfer', params, sideChainAddress);
      emitLoading(false);
      console.log('eventBus.emit');
      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Success,
        primaryContent: 'The deposit have been submitted successfully.',
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
        primaryContent: 'Deposit Error',
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
  useEffect(() => {
    if (treasuryAddress) {
      run();
    }
  }, [treasuryAddress]);
  const cls = `${clssName} treasury-wrap border-0 lg:border lg:mb-[10px] border-Neutral-Divider border-solid rounded-lg bg-white px-4 pt-2 pb-6 lg:px-8  lg:py-6`;
  const existTransaction = transferListData?.data?.total && transferListData?.data?.total > 0;
  const showLoadMore = (transferListData?.data?.total ?? 0) > LoadCount;
  return (
    <div className={cls}>
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={6} className="pb-[10px]">
        Treasury Assets
      </Typography.Title>
      {treasuryAddressLoading ? (
        <SkeletonLine />
      ) : (
        <>
          {!treasuryAddress && wallet.address === creator && (
            <>
              <p className="text-Neutral-neutralTitle text-sm mb-[10px]">
                The treasury function is not currently enabled for this DAO.
              </p>
              <Button className="w-full" type="primary" size="medium" onClick={initTreasury}>
                Enable Treasury
              </Button>
            </>
          )}
          {treasuryAddress &&
            (transferListLoading ? (
              <SkeletonLine />
            ) : (
              <>
                {existTransaction ? (
                  <div>
                    <div className="flex items-center">
                      <p className="flex-1 text-[18px] font-bold">$ {totalValueUSD}</p>
                      <ButtonCheckLogin
                        type="primary"
                        onClick={() => {
                          setChoiceOpen(true);
                        }}
                        size="medium"
                      >
                        Transfer
                      </ButtonCheckLogin>
                    </div>
                    <div>
                      <p className="flex justify-between mt-5">
                        <span className="text-[14px] font-[500]">Transactions</span>
                        {showLoadMore && (
                          <Link href={`/dao/${daoData?.id}/treasury`}>
                            <span>Load More</span>
                          </Link>
                        )}
                      </p>
                      <ul>
                        {transferListData?.data?.list?.slice(0, LoadCount).map((item) => {
                          return (
                            <li className="treasury-info-item" key={item.txId}>
                              <div className="flex  justify-between text-Neutral-Secondary-Text">
                                <span className="">
                                  {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                                </span>
                                <span className="pl-[4px]">
                                  {checkIsOut(treasuryAddress, item) ? 'Withdraw' : 'Deposit'}
                                </span>
                                <span className="pl-[4px]">
                                  {numberFormatter(item.amount)} {item.symbol}
                                </span>
                              </div>
                              <div>
                                <span className="block lg:flex items-center">
                                  <Typography.Text fontWeight={FontWeightEnum.Medium}>
                                    transactionId:
                                  </Typography.Text>
                                  <Link href={`${explorer}/tx/${item.txId}`} target="_blank">
                                    <HashAddress
                                      className="pl-[4px]"
                                      ignorePrefixSuffix={true}
                                      preLen={8}
                                      endLen={11}
                                      address={item.txId}
                                    ></HashAddress>
                                  </Link>
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-Neutral-neutralTitle text-sm mb-[10px]">
                      Community development and operations require funding. Deposit the first assets
                      to the treasury.
                    </p>
                    <ButtonCheckLogin
                      type="primary"
                      size="medium"
                      onClick={() => {
                        setDepoistOpen(true);
                      }}
                    >
                      Deposit
                    </ButtonCheckLogin>
                  </div>
                )}
              </>
            ))}
        </>
      )}
      {/* choice: Deposit /  WithDraw*/}
      <CommonModal
        open={choiceOpen}
        title={<div className="text-center">Transfer</div>}
        wrapClassName="choice-modal-wrap"
        destroyOnClose
        onCancel={() => {
          setChoiceOpen(false);
        }}
        className="treasury-choice-modal"
      >
        <ul>
          <li
            className="choice-item"
            onClick={() => {
              setDepoistOpen(true);
            }}
          >
            <div className="choice-item-text">
              <p className="choice-item-text-title">Deposit assets</p>
              <p className="choice-item-text-subtitle">Send assets to the DAO treasury</p>
            </div>
            <RightArrowOutlined />
          </li>
          <li className="choice-item" onClick={handleCreateProposal}>
            <div className="choice-item-text">
              <p className="choice-item-text-title">Withdraw assets</p>
              <p className="choice-item-text-subtitle">
                Create a proposal to withdraw assets to a wallet.
              </p>
            </div>
            {createProposalLoading ? <Spin size="small" /> : <RightArrowOutlined />}
          </li>
        </ul>
      </CommonModal>
      {/* Deposit form */}
      <CommonModal
        open={depoistOpen}
        destroyOnClose
        title={<div className="text-center">Deposit</div>}
        onCancel={() => {
          setDepoistOpen(false);
          form.resetFields();
          setDepositLoading(false);
        }}
      >
        <div>
          <Form
            layout="vertical"
            name="deposit"
            scrollToFirstError={true}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              validateFirst
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  message: 'symbol is required',
                },
                {
                  validator: (_, value) => {
                    const reqParams = {
                      symbol: value ?? '',
                      chainId: curChain,
                    };
                    return new Promise<void>((resolve, reject) => {
                      fetchTokenInfo(reqParams)
                        .then((res) => {
                          if (!res.data.name) {
                            reject(new Error('The token has not yet been issued'));
                          }
                          if (res.data.isNFT) {
                            reject(
                              new Error(
                                `${value} is an NFT and cannot be used as governance token.`,
                              ),
                            );
                          }
                          resolve();
                        })
                        .catch(() => {
                          reject(new Error('The token has not yet been issued.'));
                        });
                    });
                  },
                },
              ]}
              name="symbol"
              label="Symbol"
            >
              <Input
                placeholder="Enter a token symbol"
                onBlur={() => {
                  const token = form.getFieldValue('symbol');
                  form.setFieldValue('symbol', token?.toUpperCase());
                }}
              />
            </Form.Item>
            <Form.Item
              dependencies={['symbol']}
              name="amount"
              validateFirst
              rules={[
                {
                  required: true,
                },
                {
                  validator: (_, value) => {
                    if (value <= 0) {
                      return Promise.reject(new Error('The amount must be greater than 0'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
                {
                  validator: (_, value) => {
                    console.log(1, value, _);
                    const symbol = form.getFieldValue('symbol');
                    console.log('async validator', symbol);
                    if (!symbol) {
                      return Promise.reject(new Error('Please enter the token symbol'));
                    }
                    return new Promise<void>((resolve, reject) => {
                      Promise.all([
                        GetBalanceByContract(
                          {
                            symbol: symbol,
                            owner: wallet.address,
                          },
                          { chain: curChain },
                        ),
                        GetTokenInfo(
                          {
                            symbol: symbol,
                          },
                          { chain: curChain },
                        ),
                      ])
                        .then((res) => {
                          const [balanceInfo, tokenInfo] = res;
                          const decimals = tokenInfo?.decimals;
                          decimalsRef.current = decimals;
                          if (BigNumber(balanceInfo.balance).lt(timesDecimals(value, decimals))) {
                            return Promise.reject(new Error('Insufficient balance'));
                          } else {
                            resolve();
                          }
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    });
                  },
                },
              ]}
              label="Amount"
            >
              <InputNumber
                placeholder="Please enter the amount you want to deposit"
                className="w-full"
                controls={false}
              />
            </Form.Item>
          </Form>
          <div className="flex justify-center">
            <Button type="primary" size="medium" onClick={handleDeposit} loading={depositLoading}>
              Submit
            </Button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default Treasury;
