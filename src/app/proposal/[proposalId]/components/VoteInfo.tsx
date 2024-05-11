import { Typography, FontWeightEnum, Progress } from 'aelf-design';
import MyInfo from 'app/dao/[daoId]/components/MyInfo';
import BoxWrapper from './BoxWrapper';
import { divDecimals } from 'utils/calculate';
import { memo } from 'react';
import BigNumber from 'bignumber.js';

interface IHeaderInfoProps {
  proposalDetailData: ProposalDetailData;
}
const VoteInfo = (props: IHeaderInfoProps) => {
  const { proposalDetailData } = props;
  const { decimals } = proposalDetailData;
  const total =
    proposalDetailData.abstentionCount +
    proposalDetailData.rejectionCount +
    proposalDetailData.approvedCount;
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
                {divDecimals(proposalDetailData.approvedCount, decimals).valueOf()}
                <span className="px-[4px]">Votes</span>
                {proposalDetailData.minimalApproveThreshold}%
              </Typography.Text>
            </div>
            <Progress
              percent={(proposalDetailData.approvedCount / total) * 100}
              strokeColor="#3888FF"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-rejection" fontWeight={FontWeightEnum.Medium}>
                Rejected
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {divDecimals(proposalDetailData.rejectionCount, decimals).valueOf()}
                <span className="px-[4px]">Votes</span>
                {proposalDetailData.maximalRejectionThreshold}%
              </Typography.Text>
            </div>
            <Progress
              percent={(proposalDetailData.rejectionCount / total) * 100}
              strokeColor="#F55D6E"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-abstention" fontWeight={FontWeightEnum.Medium}>
                Abstained
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {divDecimals(proposalDetailData.abstentionCount, decimals).valueOf()}
                <span className="px-[4px]">Votes</span>{' '}
                {proposalDetailData.maximalAbstentionThreshold}%
              </Typography.Text>
            </div>
            <Progress
              percent={(proposalDetailData.abstentionCount / total) * 100}
              strokeColor="#687083"
            />
          </div>
        </div>

        <div className="border-0 border-t border-solid border-Neutral-Divider flex flex-col py-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium} className="text-Primary-Text">
              Total
              <span className="px-[4px]">
                {divDecimals(proposalDetailData.votesAmount, decimals).valueOf()}
              </span>
              votes
            </Typography.Text>
          </div>
          <div>
            <Typography.Text size="small" className="text-Neutral-Secondary-Text">
              Minimum voting requirement met(
              {divDecimals(proposalDetailData.votesAmount, decimals).valueOf()}/
              {proposalDetailData.minimalVoteThreshold})
            </Typography.Text>
          </div>
        </div>
      </BoxWrapper>
      <MyInfo
        clssName="flex-1 grow-0 lg:basis-[32%]"
        daoId={proposalDetailData.daoId || ''}
        proposalId={proposalDetailData.proposalId}
        voteMechanismName={proposalDetailData.voteMechanismName}
      />
    </div>
  );
};

export default memo(VoteInfo);
