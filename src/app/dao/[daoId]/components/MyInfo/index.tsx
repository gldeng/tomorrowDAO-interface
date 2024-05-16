import { Descriptions, Divider, Form, InputNumber, message } from 'antd';
import { HashAddress, Typography, FontWeightEnum, Button } from 'aelf-design';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ElfIcon from 'assets/imgs/elf-icon.svg';
import SuccessGreenIcon from 'assets/imgs/success-green.svg';
import CommonModal from 'components/CommonModal';
import { useWalletService } from 'hooks/useWallet';
import Info from '../Info';
import { fetchProposalMyInfo } from 'api/request';
import { store } from 'redux/store';
import { useSelector } from 'react-redux';
import { callContract, GetBalanceByContract } from 'contract/callContract';
import { curChain, voteAddress } from 'config';
import { emitLoading } from 'utils/myEvent';
import { getExploreLink } from 'utils/common';
import Vote from './vote';
import { timesDecimals, divDecimals } from 'utils/calculate';
import { IContractError } from 'types';

type TInfoTypes = {
  height?: number;
  children?: ReactNode;
  clssName?: string;
  daoId: string;
  proposalId?: string;
  voteMechanismName?: string;
};

type TFieldType = {
  unstakeAmount: number;
};
interface IMyInfo extends ProposalMyInfo {
  votesAmount?: number;
}
export default function MyInfo(props: TInfoTypes) {
  const { height, clssName, daoId, proposalId = '', voteMechanismName = '' } = props;
  const { login, isLogin } = useWalletService();
  const elfInfo = store.getState().elfInfo.elfInfo;
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const [elfBalance, setElfBalance] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [info, setInfo] = useState<IMyInfo>({
    symbol: 'ELF',
    decimal: '8',
    availableUnStakeAmount: 0,
    stakeAmount: 0,
    votesAmount: 0,
    canVote: false,
    withdrawList: [],
    votesAmountTokenBallot: 0,
    votesAmountUniqueVote: 0,
  });

  const [form] = Form.useForm();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalInfo, setShowFailedModal] = useState({
    isOpen: false,
    message: '',
  });
  const fetchMyInfo = useCallback(async () => {
    if (!isLogin || !elfInfo.curChain || !daoId || !walletInfo.address) {
      return;
    }
    const reqMyInfoParams: ProposalMyInfoReq = {
      chainId: elfInfo.curChain,
      daoId: daoId,
      address: walletInfo.address,
    };
    if (proposalId) {
      reqMyInfoParams.proposalId = proposalId;
    }

    const res = await fetchProposalMyInfo(reqMyInfoParams);
    if (!res.data) {
      return;
    }
    const data: IMyInfo = res?.data;
    if (!data?.symbol) {
      data.symbol = 'ELF';
    }
    const decimal = data?.decimal;
    data.availableUnStakeAmount = divDecimals(data?.availableUnStakeAmount, decimal).toNumber();
    data.stakeAmount = divDecimals(data?.stakeAmount, decimal).toNumber();
    const votesAmountTokenBallot = divDecimals(data.votesAmountTokenBallot, decimal).toNumber();
    data.votesAmount = votesAmountTokenBallot + data.votesAmountUniqueVote;
    setInfo(data);
  }, [daoId, proposalId, elfInfo.curChain, walletInfo.address, isLogin]);

  useEffect(() => {
    fetchMyInfo();
  }, [fetchMyInfo]);

  const getBalance = useCallback(async () => {
    if (!isLogin || !walletInfo.address || !curChain) {
      return;
    }
    const { balance } = await GetBalanceByContract(
      {
        symbol: info?.symbol || 'ELF',
        owner: walletInfo.address,
      },
      { chain: curChain },
    );
    // aelf decimal 8
    setElfBalance(divDecimals(balance, info?.decimal || '8').toNumber());
  }, [isLogin, walletInfo.address, info?.symbol, info?.decimal]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const myInfoItems = [
    {
      key: '0',
      label: '',
      children: info && (
        <HashAddress
          preLen={8}
          endLen={11}
          address={walletInfo.address}
          className="address"
        ></HashAddress>
      ),
    },
    {
      key: '1',
      label: `${info?.symbol || 'ELF'} Balance`,
      children: (
        <div className="w-full text-right">
          {elfBalance} {info?.symbol || 'ELF'}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Staked ' + info?.symbol,
      children: (
        <div className="w-full text-right">
          {info?.stakeAmount} {info?.symbol}
        </div>
      ),
    },
    {
      key: '3',
      label: 'Voted',
      children: <div className="w-full text-right">{info?.votesAmount} Votes</div>,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnstakeAmModalOpen, setIsUnstakeAmIsModalOpen] = useState(false);

  const handleClaim = useCallback(async () => {
    // call contract
    const contractParams = {
      daoId,
      withdrawAmount: timesDecimals(info?.availableUnStakeAmount, info?.decimal).toNumber(),
      votingItemIdList: {
        value: info.withdrawList?.[0]?.proposalIdList ?? [],
      },
    };
    try {
      emitLoading(true, 'The unstake is being processed...');
      const result = await callContract('Withdraw', contractParams, voteAddress);
      emitLoading(false);
      setTxHash(result?.TransactionId);
      setShowSuccessModal(true);
    } catch (err) {
      const error = err as IContractError;
      const message = error?.errorMessage?.message || error?.message;
      setShowFailedModal({
        isOpen: true,
        message,
      });
      emitLoading(false);
    }
  }, [daoId, info.withdrawList, info?.decimal, info?.availableUnStakeAmount]);

  return (
    <div
      className={`${clssName} border-0 lg:border border-Neutral-Divider border-solid rounded-lg bg-white px-4 pt-2 pb-6 lg:px-8  lg:py-6`}
      style={{
        height: height || 'auto',
      }}
    >
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={6} className="pb-6">
        My Info
      </Typography.Title>
      {isLogin ? (
        <div>
          <Descriptions colon={false} title="" items={myInfoItems} column={1} />
          {/* cliam */}
          <Divider className="mt-0 mb-4" />
          <div className="flex justify-between items-start">
            <div>
              <div className="text-Neutral-Secondary-Text text-sm mb-1">Available to unstake</div>
              <div className="text-Primary-Text font-medium">
                {info?.availableUnStakeAmount} {info?.symbol}
              </div>
            </div>
            <Button
              type="primary"
              size="medium"
              onClick={() => {
                if (info?.availableUnStakeAmount === 0) {
                  message.info('Available to unstake is 0!');
                } else {
                  setIsModalOpen(true);
                }
              }}
            >
              Claim
            </Button>
          </div>
          {info?.canVote && (
            <Vote
              proposalId={proposalId}
              voteMechanismName={voteMechanismName}
              elfBalance={elfBalance}
              symbol={info?.symbol}
              fetchMyInfo={fetchMyInfo}
              votesAmount={info?.votesAmount}
              decimal={info?.decimal}
            />
          )}
          {/* Claim Modal  */}
          <CommonModal
            open={isModalOpen}
            title={<div className="text-center">Claim ELF on MainChain AELF</div>}
            destroyOnClose
            onCancel={() => {
              form.setFieldValue('unStakeAmount', 0);
              setIsModalOpen(false);
            }}
          >
            <div className="text-center color-text-Primary-Text font-medium">
              <span className="text-[32px] mr-1">{info?.availableUnStakeAmount}</span>
              <span>ELF</span>
            </div>
            <div className="text-center text-Neutral-Secondary-Text">Available to unstake</div>
            <Form form={form} layout="vertical" variant="filled" onFinish={handleClaim}>
              <Form.Item<TFieldType>
                label="Unstake Amount"
                name="unstakeAmount"
                tooltip="Currently, only one-time withdrawal of all unlocked ELF is supported."
              >
                <InputNumber
                  className="w-full"
                  placeholder="pleas input Unstake Amount"
                  defaultValue={info?.availableUnStakeAmount}
                  disabled
                  prefix={
                    <div className="flex items-center">
                      <Image width={24} height={24} src={ElfIcon} alt="" />
                      <span className="text-Neutral-Secondary-Text ml-1">ELF</span>
                      <Divider type="vertical" />
                    </div>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button className="mx-auto" type="primary" htmlType="submit">
                  Claim
                </Button>
              </Form.Item>
            </Form>
          </CommonModal>
          {/* Unstake Amount  */}
          <CommonModal
            open={isUnstakeAmModalOpen}
            title={<div className="text-center">Unstake Amount</div>}
            onCancel={() => {
              setIsUnstakeAmIsModalOpen(false);
            }}
            footer={null}
          >
            <p>Currently, only one-time withdrawal of all unlocked ELF is supported.</p>
            <Button
              className="mx-auto"
              type="primary"
              onClick={() => {
                setIsUnstakeAmIsModalOpen(false);
              }}
            >
              OK
            </Button>
          </CommonModal>

          {/* success */}
          <CommonModal
            title="Transaction submitted successfully!"
            open={showSuccessModal}
            onCancel={() => {
              setShowSuccessModal(false);
            }}
          >
            <Image className="mx-auto block" width={56} height={56} src={SuccessGreenIcon} alt="" />
            <div className="text-center text-Primary-Text font-medium">
              <span className="text-[32px] mr-1">{form.getFieldValue('unstakeAmount')}</span>
              <span>ELF</span>
            </div>
            <p className="text-center text-Neutral-Secondary-Text font-medium">
              Congratulations, transaction submitted successfully!
            </p>
            <Button
              className="mx-auto mt-6 w-[206px]"
              type="primary"
              onClick={() => {
                setShowSuccessModal(false);
              }}
            >
              I Know
            </Button>
            <Button
              type="link"
              className="mx-auto text-colorPrimary"
              size="small"
              onClick={() => {
                window.open(getExploreLink(txHash, 'transaction'));
              }}
            >
              View Transaction Details
            </Button>
          </CommonModal>

          {/* failed */}
          <CommonModal
            open={modalInfo.isOpen}
            onCancel={() => {
              setShowFailedModal({
                ...modalInfo,
                isOpen: false,
              });
            }}
          >
            <Info
              title="Transaction Failed!"
              firstText={modalInfo.message}
              btnText="Back"
              type="failed"
              onOk={() => {
                setShowFailedModal({
                  ...modalInfo,
                  isOpen: false,
                });
              }}
            ></Info>
          </CommonModal>
        </div>
      ) : (
        <div>
          <Button className="w-full mb-4" type="primary" onClick={login}>
            Log In
          </Button>
          <div className="text-center text-Neutral-Secondary-Text">
            Connect wallet to view your votes.
          </div>
        </div>
      )}
      <div>{props.children}</div>
    </div>
  );
}
