import { Typography, FontWeightEnum, Progress } from 'aelf-design';
import MyInfo from 'app/daodetails/components/MyInfo';
import BoxWrapper from './BoxWrapper';
import { memo } from 'react';

const VoteInfo = () => {
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
                80 Votes 80%
              </Typography.Text>
            </div>
            <Progress percent={80} strokeColor="#3888FF" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-rejection" fontWeight={FontWeightEnum.Medium}>
                Rejected
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">
                10 Votes 10%
              </Typography.Text>
            </div>
            <Progress percent={10} strokeColor="#F55D6E" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Typography.Text className="text-abstention" fontWeight={FontWeightEnum.Medium}>
                Abstained
              </Typography.Text>
              <Typography.Text className="text-Neutral-Secondary-Text">8 Votes 8%</Typography.Text>
            </div>
            <Progress percent={8} strokeColor="#687083" />
          </div>
        </div>

        <div className="border-0 border-t border-solid border-Neutral-Divider flex flex-col py-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium} className="text-Primary-Text">
              Total 100 votes
            </Typography.Text>
          </div>
          <div>
            <Typography.Text size="small" className="text-Neutral-Secondary-Text">
              Minimum voting requirement met(100/80)
            </Typography.Text>
          </div>
        </div>
      </BoxWrapper>
      {/* <MyInfo isLogin={true} /> */}
    </div>
  );
};

export default memo(VoteInfo);
