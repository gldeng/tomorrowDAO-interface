'use client';
import { memo } from 'react';
import { Tabs } from 'aelf-design';
import './index.css';
import { tabItems } from './tabItem';
import HeaderInfo from './components/HeaderInfo';
import VoteInfo from './components/VoteInfo';
import StatusInfo from './components/StatusInfo';
import VoteResultTable from './components/VoteResultTable';
import { useRequest } from 'ahooks';
import { fetchProposalDetail } from 'api/request';
import { store } from 'redux/store';

const ProposalDetails = (props: { params: { proposalId: string } }) => {
  const { proposalId } = props.params;
  const info = store.getState().elfInfo.elfInfo;

  const {
    data: proposalDetailRes,
    error,
    loading,
  } = useRequest(async () => {
    return fetchProposalDetail({ proposalId, chainId: info.curChain });
  });
  return (
    <div className="proposal-details-wrapper">
      {proposalDetailRes?.data && <HeaderInfo proposalDetailData={proposalDetailRes?.data} />}
      {/* {proposalDetailRes?.data && <VoteInfo proposalDetailData={proposalDetailRes?.data} />} */}

      <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
        <Tabs items={tabItems} />
      </div>

      {/* <StatusInfo /> */}
      {/* <VoteResultTable /> */}
    </div>
  );
};

export default memo(ProposalDetails);
