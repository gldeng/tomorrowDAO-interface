import { Typography, FontWeightEnum, Progress } from 'aelf-design';
import MyInfo from 'app/dao/[daoId]/components/MyInfo';
import BoxWrapper from './BoxWrapper';
import { memo } from 'react';
import { EVoteMechanismNameType } from 'app/proposal/deploy/[daoId]/type';

interface IHeaderInfoProps {
  proposalDetailData: IProposalDetailData;
}
const VoteInfo = (props: IHeaderInfoProps) => {
  const { proposalDetailData } = props;
  const approvePercent =
    proposalDetailData.votesAmount === 0
      ? 0
      : Math.floor((proposalDetailData.approvedCount / proposalDetailData.votesAmount) * 100);
  const abstainPercent =
    proposalDetailData.votesAmount === 0
      ? 0
      : Math.floor((proposalDetailData.abstentionCount / proposalDetailData.votesAmount) * 100);
  const rejectPercent =
    proposalDetailData.votesAmount === 0
      ? 0
      : Math.floor((proposalDetailData.rejectionCount / proposalDetailData.votesAmount) * 100);

  const is1t1v = proposalDetailData.voteMechanismName === EVoteMechanismNameType.TokenBallot;
  return (
    <div className="flex justify-between flex-col lg:flex-row">
      <BoxWrapper className="flex-1 lg:mr-[24px] order-last lg:order-first">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          Current Votes
        </Typography.Title>

        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text
                className="text-Light-Mode-Brand-Brand"
                fontWeight={FontWeightEnum.Medium}
              >
                Approved
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData.approvedCount}
                <span className="px-[4px]">Votes</span>
                {approvePercent}%
              </Typography.Text>
            </div>
            <Progress percent={approvePercent} strokeColor="#3888FF" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-rejection" fontWeight={FontWeightEnum.Medium}>
                Rejected
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData.rejectionCount}
                <span className="px-[4px]">Votes</span>
                {rejectPercent}%
              </Typography.Text>
            </div>
            <Progress percent={rejectPercent} strokeColor="#F55D6E" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-abstention" fontWeight={FontWeightEnum.Medium}>
                Abstained
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData.abstentionCount}
                <span className="px-[4px]">Votes</span> {abstainPercent}%
              </Typography.Text>
            </div>
            <Progress percent={abstainPercent} strokeColor="#687083" />
          </div>
        </div>

        <div className="border-0 border-t border-solid border-Neutral-Divider flex flex-col py-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium} className="text-Primary-Text">
              Total
              <span className="px-[4px]">{proposalDetailData.votesAmount}</span>
              votes
            </Typography.Text>
          </div>
          <div>
            <Typography.Text size="small" className="text-Neutral-Secondary-Text">
              Minimum {is1t1v ? 'votes' : 'voter'} requirement met
              <span className="px-[4px]">
                {is1t1v ? (
                  <span>
                    {proposalDetailData.votesAmount} / {proposalDetailData.minimalVoteThreshold}
                  </span>
                ) : (
                  <span>
                    {proposalDetailData.voterCount} / {proposalDetailData.minimalRequiredThreshold}
                  </span>
                )}
              </span>
            </Typography.Text>
          </div>
        </div>
      </BoxWrapper>
      <MyInfo
        clssName="flex-1 grow-0 lg:basis-[32%]"
        daoId={proposalDetailData.daoId || ''}
        proposalId={proposalDetailData.proposalId}
        voteMechanismName={proposalDetailData.voteMechanismName}
        notLoginTip={'Connect wallet to view your votes.'}
      />
    </div>
  );
};

export default memo(VoteInfo);
