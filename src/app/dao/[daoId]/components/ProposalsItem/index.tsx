import { Divider, Space } from 'antd';
import { Typography, FontWeightEnum, HashAddress, Progress } from 'aelf-design';
import Image from 'next/image';
import WarningGrayIcon from 'assets/imgs/warning-gray.svg';
import CheckedIcon from 'assets/imgs/checked.svg';
import useResponsive from 'hooks/useResponsive';
import { tagColorMap } from '../../constants';
import DetailTag from 'components/DetailTag';

import './index.css';
import { useMemo } from 'react';

export interface IProposalsItemProps {
  proposalStatus: string;
  title: string;
  tagList: Array<string>;
  votesAmount: string;
}
type TagColorKey = keyof typeof tagColorMap;

export default function ProposalsItem(props: { data: IProposalsItem }) {
  const { data } = props;
  const { isLG } = useResponsive();

  const proposalStatus = data.proposalStatus as TagColorKey;

  const tagList = useMemo(() => {
    return [data.governanceMechanism];
  }, [data]);

  return (
    <div className="proposal-item">
      <div>
        <div>
          <DetailTag
            customStyle={{
              text: proposalStatus,
              height: 20,
              color: tagColorMap[proposalStatus]?.textColor,
              bgColor: tagColorMap[proposalStatus]?.bgColor,
            }}
          />
          <Typography.Text
            className="proposal-item-time"
            size="small"
            fontWeight={FontWeightEnum.Regular}
          >
            {/* {getTimeDesc(proposalStatus, data)} */}
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
                Proposal ID：{data.proposalId}
              </Typography.Title>
              <HashAddress preLen={8} endLen={11} address={data.proposalId}></HashAddress>
            </>
          )}
        </div>
        <div>
          <Space>
            {tagList.map((item: any) => (
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

      <div className="vote vote-data-analysis flex flex-col justify-between">
        <div className="vote-top">
          <div className="h-[22px] vote-top-title">
            <Typography.Title fontWeight={FontWeightEnum.Regular} level={7}>
              Total {data.votesAmount} votes
            </Typography.Title>
          </div>
          <div className="vote-dis">
            {/* todo: deal 1t1v 1a1v */}
            {data.votesAmount < data.minimalVoteThreshold ? (
              <>
                <Image width={12} height={12} src={WarningGrayIcon} alt=""></Image>
                <div>
                  Insufficient votes: {data.votesAmount}/{data.minimalVoteThreshold} (min required)
                </div>
              </>
            ) : (
              <>
                <Image width={12} height={12} src={CheckedIcon} alt=""></Image>
                Minimum voting requirement met: {data.votesAmount}/{data.minimalVoteThreshold}
              </>
            )}
          </div>
          {/* )} */}
        </div>
        <div>
          <CustomProgress data={data} />
        </div>
      </div>
    </div>
  );
}

function CustomProgress(props: { data: IProposalsItem }) {
  const { data } = props;
  const approvePercent =
    data.votesAmount === 0 ? 0 : Math.floor((data.approvedCount / data.votesAmount) * 100);
  const abstainPercent =
    data.votesAmount === 0 ? 0 : Math.floor((data.abstentionCount / data.votesAmount) * 100);
  const rejectPercent =
    data.votesAmount === 0 ? 0 : Math.floor((data.rejectionCount / data.votesAmount) * 100);
  return (
    <>
      <div className="flex">
        <div className="flex-1 text-approve">
          <div className="font-medium leading-10">Approved</div>
          <div className="leading-4">{approvePercent}%</div>
        </div>
        <div className="flex-1 text-abstention">
          <div className="font-medium leading-10">Asbtained</div>
          <div className="leading-4">{abstainPercent}%</div>
        </div>
        <div className="justify-self-end text-rejection">
          <div className="font-medium leading-10">Rejected</div>
          <div className="leading-4">{rejectPercent}%</div>
        </div>
      </div>
      <Progress
        trailColor="#F55D6E"
        strokeColor="#687083"
        percent={approvePercent + abstainPercent}
        success={{ percent: approvePercent, strokeColor: '#3888FF' }}
      />
    </>
  );
}
