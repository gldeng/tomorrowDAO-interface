import BoxWrapper from './BoxWrapper';
import { Typography, FontWeightEnum } from 'aelf-design';
import { Steps } from 'antd';
import { memo } from 'react';
import useResponsive from 'hooks/useResponsive';

interface IStatusInfoProps {
  proposalDetailData?: IProposalDetailData;
}
const StatusInfo = (props: IStatusInfoProps) => {
  const { isLG } = useResponsive();
  const { proposalDetailData } = props;

  const stepItmes = proposalDetailData?.proposalLifeList?.map((item) => {
    return {
      title: (
        <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
          {item.proposalStage}
        </Typography.Title>
      ),
      description: (
        <div>
          <div>{item.proposalStatus}</div>
        </div>
      ),
    };
  });

  return (
    <BoxWrapper>
      <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
        Status
      </Typography.Title>
      <div className="pt-12 pb-10">
        <Steps
          current={stepItmes?.length ? stepItmes?.length - 1 : 0}
          items={stepItmes}
          labelPlacement={isLG ? 'vertical' : 'horizontal'}
        />
      </div>
    </BoxWrapper>
  );
};
export default memo(StatusInfo);
