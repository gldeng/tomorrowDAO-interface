import { Divider, Form, InputNumber } from 'antd';
import { Button, HashAddress } from 'aelf-design';
import { useState, useEffect, useCallback } from 'react';
import CommonModal from 'components/CommonModal';
import Image from 'next/image';
import ElfIcon from 'assets/imgs/elf-icon.svg';
import { EVoteMechanismNameType, EVoteOption } from 'app/proposal/deploy/[daoId]/type';
import { useSelector } from 'react-redux';
import { voteApproveMessage, voteRejectMessage, voteAbstainMessage } from 'utils/constant';
import SuccessGreenIcon from 'assets/imgs/success-green.svg';
import { getExploreLink } from 'utils/common';
import Info from '../Info';
import { callContract, ApproveByContract } from 'contract/callContract';
import { emitLoading } from 'utils/myEvent';
import { curChain, voteAddress } from 'config';
import { timesDecimals } from 'utils/calculate';

type TVoteTypes = {
  proposalId: string;
  voteMechanismName: string;
  elfBalance: number;
  symbol: string;
  fetchMyInfo: () => void;
};

type TFieldType = {
  stakeAmount: number;
};

function Vote(props: TVoteTypes) {
  const { proposalId, voteMechanismName, elfBalance, symbol, fetchMyInfo } = props;
  const [form] = Form.useForm();
  const [currentVoteType, setCurrentVoteType] = useState<EVoteOption>(EVoteOption.APPROVED);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [showApproveTokenBallotModal, setShowApproveTokenBallotModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const [txHash, setTxHash] = useState('');

  const handlerApprove = () => {
    console.log('voteMechanismName', voteMechanismName);
    if (voteMechanismName === EVoteMechanismNameType.TokenBallot) {
      setShowApproveTokenBallotModal(true);
    } else if (voteMechanismName === EVoteMechanismNameType.UniqueVote) {
      setCurrentTitle('Approve Proposal');
      setCurrentMessage(voteApproveMessage);
      setShowVoteModal(true);
    }
    setCurrentVoteType(EVoteOption.APPROVED);
  };

  const handlerReject = () => {
    setCurrentTitle('Reject Proposal');
    setCurrentMessage(voteRejectMessage);
    setCurrentVoteType(EVoteOption.REJECTED);
    setShowVoteModal(true);
  };

  const handlerAbstain = () => {
    setCurrentTitle('Abstain Proposal');
    setCurrentMessage(voteAbstainMessage);
    setCurrentVoteType(EVoteOption.ABSTAINED);
    setShowVoteModal(true);
  };

  const handlerVote = useCallback(async () => {
    const contractParams = {
      votingItemId: proposalId,
      voteOption: currentVoteType,
      // elf decimals 8
      voteAmount: Number(
        timesDecimals(
          voteMechanismName === EVoteMechanismNameType.TokenBallot
            ? form.getFieldValue('stakeAmount')
            : 1,
          8,
        ),
      ),
    };
    try {
      emitLoading(true, 'The vote is being processed...');
      const approveRes = await ApproveByContract(
        {
          spender: voteAddress,
          symbol: symbol || 'ELF',
          amount: contractParams.voteAmount,
        },
        {
          chain: curChain,
        },
      );
      console.log('token approve finish', approveRes);

      const result = await callContract('Vote', contractParams, voteAddress);
      emitLoading(false);
      setTxHash(result?.TransactionId);
      setShowSuccessModal(true);
      fetchMyInfo();
    } catch (error) {
      setShowFailedModal(true);
      emitLoading(false);
    }
    // handle vote done close Modal
    setShowApproveTokenBallotModal(false);
    setShowVoteModal(false);
    form.setFieldValue('stakeAmount', 0);
  }, [currentVoteType, form, proposalId, voteMechanismName, symbol, fetchMyInfo]);

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        type="primary"
        size="medium"
        millisecondOfDebounce={1000}
        onClick={() => handlerApprove()}
      >
        Approve
      </Button>
      <Button
        type="primary"
        size="medium"
        danger
        millisecondOfDebounce={1000}
        onClick={() => handlerReject()}
      >
        Reject
      </Button>
      <Button
        type="primary"
        size="medium"
        millisecondOfDebounce={1000}
        className="bg-abstention"
        onClick={() => handlerAbstain()}
      >
        Abstain
      </Button>

      {/* vote approve TokenBallot 1t1v Modal  */}
      <CommonModal
        open={showApproveTokenBallotModal}
        title={<div className="text-center">Approve Proposal</div>}
        onCancel={() => {
          form.setFieldValue('stakeAmount', 0);
          setShowApproveTokenBallotModal(false);
        }}
      >
        <p className="text-center color-text-Primary-Text font-medium">
          An upgrade of smart contract
          <HashAddress
            address={walletInfo.address}
            preLen={8}
            endLen={9}
            className="justify-center"
          />
          on MainChain {curChain}
        </p>
        <div className="text-center color-text-Primary-Text font-medium">
          <span className="text-[32px] mr-1">{elfBalance}</span>
          <span>ELF</span>
        </div>
        <div className="text-center text-Neutral-Secondary-Text">Available to unstake</div>
        <Form form={form} layout="vertical" variant="filled" onFinish={() => handlerVote()}>
          <Form.Item<TFieldType>
            label="Stake Amount"
            name="stakeAmount"
            tooltip="Currently, only one-time withdrawal of all unlocked ELF is supported."
            rules={[{ required: true, message: 'Please input stake Amount!' }]}
          >
            <InputNumber
              className="w-full"
              placeholder="pleas input stake Amount"
              autoFocus
              min={0}
              max={elfBalance}
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
              Stake and Vote
            </Button>
          </Form.Item>
        </Form>
      </CommonModal>
      {/* vote 1 approve UniqueVote 1a1v Modal  2 Reject  3 Abstain  */}
      <CommonModal
        open={showVoteModal}
        title={<div className="text-center">{currentTitle}</div>}
        onCancel={() => {
          setShowVoteModal(false);
        }}
        footer={null}
      >
        <div className="text-xs text-Neutral-Primary-Text mb-4">{currentMessage}</div>
        <Button
          className="mx-auto"
          type="primary"
          size="medium"
          onClick={() => {
            handlerVote();
          }}
        >
          Vote
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
          Transaction Submitted Successfully
        </div>
        <p className="text-center text-Neutral-Secondary-Text font-medium">
          Voted {EVoteOption[currentVoteType]} vote on the proposal!
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
        open={showFailedModal}
        onCancel={() => {
          setShowFailedModal(false);
        }}
      >
        <Info
          title="Transaction Failed!"
          firstText="Insufficient transaction fee."
          secondText="Please transfer some ELF to the account."
          btnText="I Know"
          type="failed"
          onOk={() => {
            setShowFailedModal(false);
          }}
        ></Info>
      </CommonModal>
    </div>
  );
}

export default Vote;
