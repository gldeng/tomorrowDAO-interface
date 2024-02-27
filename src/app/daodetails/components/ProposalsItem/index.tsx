import { Divider, Space } from 'antd';
import { Typography, FontWeightEnum, HashAddress, Progress } from 'aelf-design';
import Image from 'next/image';

import WarningGrayIcon from 'assets/imgs/warning-gray.svg';
import CheckedIcon from 'assets/imgs/checked.svg';
import DetailTag from '../DetailTag';
import useResponsive from 'hooks/useResponsive';

import './index.css';

export interface IProposalsItemProps {
  proposalStatus: string;
  title: string;
  tagList: Array<string>;
  votesAmount: string;
}

const tagColorMap = {
  Active: {
    bg: '#FEF7EC',
    text: '#F8B042',
  },
  Approved: {
    bg: '#EBF3FF',
    text: '#3888FF',
  },
  Expired: {
    bg: '#EDEDED',
    text: '#919191',
  },
  Executed: {
    bg: '#E4F8F5',
    text: '#05C4A2',
  },
  Rejected: {
    bg: '#FEEFF1',
    text: '#F55D6E',
  },
};

export default function ProposalsItem(props: { data: any }) {
  const { data } = props;
  const { isSM } = useResponsive();

  return (
    <div className="proposal-item">
      <div>
        <div>
          <DetailTag
            customStyle={{
              text: data.proposalStatus,
              height: 20,
              color: '#F8B042',
              bgColor: '#FEF7EC',
            }}
          />
          <Typography.Text
            className="proposal-item-time"
            size="small"
            fontWeight={FontWeightEnum.Regular}
          >
            text test titlefsdfsdfsdfADD
          </Typography.Text>
        </div>
        <div className="proposal-item-title">
          <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
            Proposal ID：
          </Typography.Title>
          <HashAddress preLen={8} endLen={11} address={data.title}></HashAddress>
        </div>
        <div>
          <Space>
            {data.tagList.map((item: any) => (
              <DetailTag
                key={item}
                customStyle={{
                  text: item,
                  height: 20,
                  color: '#919191',
                  bgColor: '#F6F6F6',
                }}
              />
            ))}
          </Space>
        </div>
      </div>
      {isSM && <Divider></Divider>}

      <div className="vote flex flex-col justify-between">
        <div className="vote-top">
          <Typography.Title
            // className="proposal-item-time"
            fontWeight={FontWeightEnum.Regular}
            level={7}
          >
            Total {data.votesAmount} votes
          </Typography.Title>
          {data.isApprove ? (
            <div className="vote-dis">
              <Image width={12} height={12} src={CheckedIcon} alt=""></Image>
              Insufficient votes： 3/100 (min required)
            </div>
          ) : (
            <div className="vote-dis">
              <Image width={12} height={12} src={WarningGrayIcon} alt=""></Image>
              Minimum voting requirement met： 3/100
            </div>
          )}
        </div>
        <div>
          <CustomProgress />
        </div>
      </div>
    </div>
  );
}

function CustomProgress() {
  return (
    <>
      <div className="flex">
        <div className="flex-1 text-approve">
          <div className="font-medium leading-10">Approved</div>
          <div className="leading-4">80%</div>
        </div>
        <div className="flex-1 text-abstention">
          <div className="font-medium leading-10">Asbtained</div>
          <div className="leading-4">8%</div>
        </div>
        <div className="justify-self-end text-rejection">
          <div className="font-medium leading-10">Rejected</div>
          <div className="leading-4">12%</div>
        </div>
      </div>
      <Progress
        trailColor="#F55D6E"
        strokeColor="#687083"
        percent={88}
        success={{ percent: 80, strokeColor: '#3888FF' }}
      />
    </>
  );
}
