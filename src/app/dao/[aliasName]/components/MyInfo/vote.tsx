import { Divider, Form, InputNumber, Input, message } from 'antd';
import { Button } from 'aelf-design';
import { useState, useCallback } from 'react';
import CommonModal from 'components/CommonModal';
import Image from 'next/image';
import { EVoteMechanismNameType } from 'pageComponents/proposal-create/type';
import { voteApproveMessage, voteRejectMessage, voteAbstainMessage } from 'utils/constant';
import { callContract, ApproveByContract, GetAllowanceByContract } from 'contract/callContract';
import { ResultModal, emitLoading, eventBus } from 'utils/myEvent';
import { curChain, voteAddress } from 'config';
import { timesDecimals } from 'utils/calculate';
import { EVoteOption, EVoteOptionLabel } from 'types/vote';
import { TokenIconMap } from 'constants/token';
import { IContractError } from 'types';
import BigNumber from 'bignumber.js';
import useAelfWebLoginSync from 'hooks/useAelfWebLoginSync';
import { useWebLogin } from 'aelf-web-login';
import { CommonOperationResultModalType } from 'components/CommonOperationResultModal';
import { okButtonConfig } from 'components/ResultModal';
import { useAnonymousVote } from 'hooks/useAnonymousVote';

type TVoteTypes = {
  proposalId: string;
  voteMechanismName?: string;
  elfBalance: number;
  symbol: string;
  fetchMyInfo: () => void;
  votesAmount: number;
  decimal: string;
  canVote?: boolean;
  className?: string;
};

type TFieldType = {
  stakeAmount: number;
};

type TPreImageFieldType = {
  preimage: string;
};

function Vote(props: TVoteTypes) {
  const {
    proposalId,
    voteMechanismName,
    elfBalance,
    symbol,
    fetchMyInfo,
    votesAmount,
    decimal,
    canVote,
    className,
  } = props;
  const [form] = Form.useForm();
  const [currentVoteType, setCurrentVoteType] = useState<EVoteOption>(EVoteOption.APPROVED);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [showTokenBallotModal, setShowTokenBallotModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showAonymousPreimageModal, setShowAonymousPreimageModal] = useState(false);
  const [preimageForm] = Form.useForm<{preimage: ""}>();
  const {isAnonymousVoteInitialized, isAnonymous, cachedCommitment, cachedPreimage, castAnonymousVote, prepareAnonymousVotingInput, setPreimage} = useAnonymousVote({ proposalId });

  const { wallet } = useWebLogin();

  const handlerModal = (voteType: number) => {
    // if have voted, can't vote again
    if (!isAnonymous && votesAmount > 0) {
      message.info('You have already voted!');
      return;
    }
    setCurrentVoteType(voteType);
    switch (voteType) {
      case EVoteOption.APPROVED:
        setCurrentTitle('Approve Proposal');
        setCurrentMessage(voteApproveMessage);
        break;
      case EVoteOption.REJECTED:
        setCurrentTitle('Reject Proposal');
        setCurrentMessage(voteRejectMessage);
        break;
      case EVoteOption.ABSTAINED:
        setCurrentTitle('Abstain Proposal');
        setCurrentMessage(voteAbstainMessage);
        break;
      default:
        break;
    }
    if(isAnonymous && cachedPreimage == null) {
      setShowAonymousPreimageModal(true);
      return;
    }
    if (voteMechanismName === EVoteMechanismNameType.TokenBallot) {
      setShowTokenBallotModal(true);
      return;
    }
    setShowVoteModal(true);
  };
  const { isSyncQuery } = useAelfWebLoginSync();

  const handlerVote = useCallback(async () => {
    if(isAnonymous && cachedPreimage == null) {
      setPreimage(preimageForm.getFieldValue("preimage"));
    }
    const preimage = cachedPreimage ?? preimageForm.getFieldValue("preimage");
    try {
      setShowVoteModal(false);
      setShowTokenBallotModal(false);
      setShowAonymousPreimageModal(false);
      let result = null;
      if(isAnonymous) {
        emitLoading(true, 'The vote is being processed...');
        result = await castAnonymousVote(currentVoteType, preimage);
        emitLoading(false);
      } else {
        const contractParams = {
          votingItemId: proposalId,
          voteOption: currentVoteType,
          // if 1t1v vote, need to approve token
          // elf decimals 8
          voteAmount:
            voteMechanismName === EVoteMechanismNameType.TokenBallot
              ? timesDecimals(form.getFieldValue('stakeAmount'), decimal ?? '8').toNumber()
              : 1,
        };
        if (!isSyncQuery()) {
          return;
        }
        emitLoading(true, 'The vote is being processed...');
        if (voteMechanismName === EVoteMechanismNameType.TokenBallot) {
          const allowance = await GetAllowanceByContract(
            {
              spender: voteAddress || '',
              symbol: symbol || 'ELF',
              owner: wallet.address,
            },
            {
              chain: curChain,
            },
          );
          if (allowance.error) {
            message.error(allowance.errorMessage?.message || 'unknown error');
          }
          const bigA = BigNumber(contractParams.voteAmount);
          const allowanceBN = BigNumber(allowance?.allowance);
          if (allowanceBN.lt(bigA)) {
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
          }
        }
  
        result = await callContract('Vote', contractParams, voteAddress);
        emitLoading(false);
      }

      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Success,
        secondaryContent: `${EVoteOptionLabel[currentVoteType]} votes has been casted for the proposal`,
        footerConfig: {
          buttonList: [okButtonConfig],
        },
        viewTransactionId: result?.TransactionId,
      });
      fetchMyInfo();
    } catch (err) {
      const error = err as IContractError;
      const message = error?.errorMessage?.message || error?.message;
      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Error,
        primaryContent: 'Transaction Failed',
        secondaryContent: message?.toString?.(),
        footerConfig: {
          buttonList: [okButtonConfig],
        },
      });
      emitLoading(false);
    }
    // handle vote done close Modal
    setShowTokenBallotModal(false);
    setShowVoteModal(false);
    form.setFieldValue('stakeAmount', 1);
  }, [
    isAnonymous,
    cachedPreimage,
    preimageForm,
    prepareAnonymousVotingInput,
    proposalId,
    currentVoteType,
    voteMechanismName,
    form,
    decimal,
    isSyncQuery,
    fetchMyInfo,
    symbol,
    wallet.address,
  ]);

  return !isAnonymousVoteInitialized ? <></> : (
    <div className={`flex justify-between gap-[16px] items-center ${className}`}>
      <Button
        type="primary"
        size="medium"
        millisecondOfDebounce={1000}
        className="approve-button flex-1"
        onClick={() => handlerModal(EVoteOption.APPROVED)}
        disabled={!canVote && !isAnonymous}
      >
        Approve
      </Button>
      <Button
        type="primary"
        size="medium"
        className="reject-button flex-1"
        millisecondOfDebounce={1000}
        onClick={() => handlerModal(EVoteOption.REJECTED)}
        disabled={!canVote && !isAnonymous}
      >
        Reject
      </Button>
      <Button
        type="primary"
        size="medium"
        millisecondOfDebounce={1000}
        className="abstention-button flex-1"
        onClick={() => handlerModal(EVoteOption.ABSTAINED)}
        disabled={!canVote && !isAnonymous}
      >
        Abstain
      </Button>

      {/* Anonymous Vote */}
      <CommonModal
        open={showAonymousPreimageModal}
        destroyOnClose
        title={<div className="text-center">{currentTitle}</div>}
        onCancel={() => {
          preimageForm.setFieldValue("preimage", "");
          setShowAonymousPreimageModal(false);
        }}
      >
        <Form
          form={preimageForm}
          layout="vertical"
          variant="filled"
          onFinish={() => handlerVote()}
          className="mt-[10px] my-info-form"
          requiredMark={false}
        >
          <Form.Item<TPreImageFieldType>
            label="Secret Note"
            name="preimage"
            validateFirst
            initialValue={1}
            tooltip={`Please supply the secret note you have committed so that you can cast your vote.`}
            rules={[
              { required: true, message: 'Please input secret note' },
              {
                type: 'string',
                message: 'Please input a valid string',
              },
              {
                validator: (_, value) => {
                  return new Promise<void>((resolve, reject) => {
                    const hexPattern = /^0x[0-9a-fA-F]{124}$/;
                    if (!hexPattern.test(value)) {
                      reject('The input must be a hex string of length 126 including the 0x prefix');
                    }
                    resolve();
                  });
                },
              },
            ]}
          >
            <Input
              className="w-full"
              placeholder="Please input your value"
              autoFocus
            />
          </Form.Item>
          <div>
            <Button className="mx-auto mt-[24px]" type="primary" htmlType="submit">
              Vote
            </Button>
          </div>
        </Form>
      </CommonModal>


      {/* vote TokenBallot 1t1v Modal  */}
      <CommonModal
        open={showTokenBallotModal}
        destroyOnClose
        title={<div className="text-center">{currentTitle}</div>}
        onCancel={() => {
          form.setFieldValue('stakeAmount', 1);
          setShowTokenBallotModal(false);
        }}
      >
        <div className="text-center color-text-Primary-Text font-medium">
          <span className="text-[32px] mr-1">{elfBalance}</span>
          <span>{symbol}</span>
        </div>
        {/* <div className="text-center text-Neutral-Secondary-Text">Available for Unstaking</div> */}
        <Form
          form={form}
          layout="vertical"
          variant="filled"
          onFinish={() => handlerVote()}
          className="mt-[10px] my-info-form"
          requiredMark={false}
        >
          <Form.Item<TFieldType>
            label="Stake and Vote"
            name="stakeAmount"
            validateFirst
            initialValue={1}
            tooltip={`Currently, the only supported method is to unstake all the available ${symbol} in one time.`}
            rules={[
              { required: true, message: 'Please input stake amount' },
              {
                type: 'integer',
                message: 'Please input an integer',
              },
              {
                validator: (_, value) => {
                  return new Promise<void>((resolve, reject) => {
                    if (value < 1) {
                      reject('The quantity must be greater than or equal to 1');
                    }
                    if (value > elfBalance) {
                      reject('Insufficient balance');
                    }
                    resolve();
                  });
                },
              },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Please input stake amount"
              autoFocus
              prefix={
                <div className="flex items-center">
                  {TokenIconMap[symbol] && (
                    <Image width={24} height={24} src={TokenIconMap[symbol]} alt="" />
                  )}
                  <span className="text-Neutral-Secondary-Text ml-1">{symbol}</span>
                  <Divider type="vertical" />
                </div>
              }
            />
          </Form.Item>
          <div>
            <Button className="mx-auto mt-[24px]" type="primary" htmlType="submit">
              Stake and Vote
            </Button>
          </div>
        </Form>
      </CommonModal>
      {/* UniqueVote vote 1a1v 1 approve  2 Reject  3 Abstain  */}
      <CommonModal
        open={showVoteModal}
        title={<div className="text-center">{currentTitle}</div>}
        onCancel={() => {
          setShowVoteModal(false);
        }}
        footer={null}
      >
        <div className="card-sm-text text-center text-Neutral-Primary-Text mb-6">
          {currentMessage}
        </div>
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
    </div>
  );
}

export default Vote;
