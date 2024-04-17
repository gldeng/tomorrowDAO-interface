'use client';
import { memo } from 'react';
import { Tabs } from 'aelf-design';
import './index.css';
import { tabItems } from './tabItem';
import HeaderInfo from './components/HeaderInfo';
import VoteInfo from './components/VoteInfo';
import StatusInfo from './components/StatusInfo';
import VoteResultTable from './components/VoteResultTable';

const ProposalDetails = () => {
  return (
    <div className="proposal-details-wrapper">
      <HeaderInfo />
      <VoteInfo />

      <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
        <Tabs items={tabItems} />
      </div>

      <StatusInfo />
      <VoteResultTable />
    </div>
  );
};

export default memo(ProposalDetails);
