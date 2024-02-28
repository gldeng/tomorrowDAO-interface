import { Divider, Space } from 'antd';
import { Typography, FontWeightEnum, HashAddress, Progress } from 'aelf-design';
import Image from 'next/image';

import WarningGrayIcon from 'assets/imgs/warning-gray.svg';
import CheckedIcon from 'assets/imgs/checked.svg';
import useResponsive from 'hooks/useResponsive';
import { IProposalsItem } from '../../type';
import { tagColorMap } from '../../constants';
import DetailTag from 'components/DetailTag';

import './index.css';

export interface IProposalsItemProps {
  proposalStatus: string;
  title: string;
  tagList: Array<string>;
  votesAmount: string;
}

export default function ProposalsItem(props: { data: IProposalsItem }) {
  const { data } = props;
  const { isLG } = useResponsive();

  return (
    <div className="proposal-item">
      <div>
        <div>
          <DetailTag
            customStyle={{
              text: data.proposalStatus,
              height: 20,
              color: tagColorMap[data.proposalStatus].textColor,
              bgColor: tagColorMap[data.proposalStatus].bgColor,
            }}
          />
          <Typography.Text
            className="proposal-item-time"
            size="small"
            fontWeight={FontWeightEnum.Regular}
          >
            {data.proposalDescription}
          </Typography.Text>
        </div>
        <div className="proposal-item-title">
          {data.proposalTitle ? (
            <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
              {data.proposalTitle}
            </Typography.Title>
          ) : (
            <>
              <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
                Proposal ID：
              </Typography.Title>
              <HashAddress preLen={8} endLen={11} address={data.proposalId}></HashAddress>
            </>
          )}
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
      {isLG && <Divider></Divider>}

      <div className="vote flex flex-col justify-between">
        <div className="vote-top">
          <Typography.Title fontWeight={FontWeightEnum.Regular} level={7}>
            Total {data.votesAmount} votes
          </Typography.Title>
          {/* data.isApprove  */}
          {data.votesAmount ? (
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
