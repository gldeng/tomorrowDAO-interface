import BoxWrapper from './BoxWrapper';
import { Typography, FontWeightEnum } from 'aelf-design';
import { Steps } from 'antd';
import { memo } from 'react';
import useResponsive from 'hooks/useResponsive';
import { AllProposalStatusString } from 'types';
import { getProposalStatusText } from 'utils/proposal';

interface IStatusInfoProps {
  proposalDetailData?: IProposalDetailData;
}
const StatusInfo = (props: IStatusInfoProps) => {
  const { isLG } = useResponsive();
  const { proposalDetailData } = props;

  const stepItmes = proposalDetailData?.proposalLifeList?.map((item) => {
    const proposalStatus = item.proposalStatus as AllProposalStatusString;
    return {
      title: (
        <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
          {item.proposalStage}
        </Typography.Title>
      ),
      description: (
        <div className="proposal-detail-status-description">
          <div>{getProposalStatusText(proposalStatus)}</div>
        </div>
      ),
    };
  });

  return (
    <div className="card-shape py-6">
      <Typography.Title
        className="proposal-status-title"
        level={6}
        fontWeight={FontWeightEnum.Medium}
      >
        Status
      </Typography.Title>
      <div className="proposal-status-content">
        <Steps
          current={stepItmes?.length ? stepItmes?.length - 1 : 0}
          items={stepItmes}
          labelPlacement={isLG ? 'vertical' : 'horizontal'}
        />
      </div>
    </div>
  );
};
export default memo(StatusInfo);
