import BoxWrapper from './BoxWrapper';
import { Typography, FontWeightEnum } from 'aelf-design';
import { stepItmes } from '../tabItem';
import { Steps } from 'antd';
import { memo } from 'react';
import useResponsive from 'hooks/useResponsive';

const StatusInfo = () => {
  const { isLG } = useResponsive();

  return (
    <BoxWrapper>
      <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
        Status
      </Typography.Title>
      <div className="pt-12 pb-10">
        <Steps current={1} items={stepItmes} labelPlacement={isLG ? 'vertical' : 'horizontal'} />
      </div>
    </BoxWrapper>
  );
};
export default memo(StatusInfo);
