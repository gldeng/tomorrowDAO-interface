import { Typography, FontWeightEnum, Progress } from 'aelf-design';
import MyInfo from 'app/dao/[daoId]/components/MyInfo';
import BoxWrapper from './BoxWrapper';
import { memo } from 'react';

interface IHeaderInfoProps {
  proposalDetailData: ProposalDetailData;
}
const VoteInfo = (props: IHeaderInfoProps) => {
  const { proposalDetailData } = props;
  return (
    <div className="flex justify-between">
      <BoxWrapper className="w-[800px] flex-shrink-0">
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
                {proposalDetailData.approvedCount} Votes
                {proposalDetailData.minimalApproveThreshold / 100}%
              </Typography.Text>
            </div>
            <Progress
              percent={proposalDetailData.approvedCount / proposalDetailData.votesAmount}
              strokeColor="#3888FF"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-rejection" fontWeight={FontWeightEnum.Medium}>
                Rejected
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData.rejectionCount} Votes
                {proposalDetailData.maximalRejectionThreshold / 100}%
              </Typography.Text>
            </div>
            <Progress
              percent={proposalDetailData.rejectionCount / proposalDetailData.votesAmount}
              strokeColor="#F55D6E"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-abstention" fontWeight={FontWeightEnum.Medium}>
                Abstained
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData.abstentionCount}
                Votes {proposalDetailData.maximalAbstentionThreshold / 100}%
              </Typography.Text>
            </div>
            <Progress
              percent={proposalDetailData.abstentionCount / proposalDetailData.votesAmount}
              strokeColor="#687083"
            />
          </div>
        </div>

        <div className="border-0 border-t border-solid border-Neutral-Divider flex flex-col py-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium} className="text-Primary-Text">
              Total {proposalDetailData.votesAmount} votes
            </Typography.Text>
          </div>
          <div>
            <Typography.Text size="small" className="text-Neutral-Secondary-Text">
              Minimum voting requirement met({proposalDetailData.votesAmount}/
              {proposalDetailData.minimalVoteThreshold})
            </Typography.Text>
          </div>
        </div>
      </BoxWrapper>
      <MyInfo isLogin={true} />
    </div>
  );
};

export default memo(VoteInfo);
