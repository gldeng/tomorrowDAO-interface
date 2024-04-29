'use client';
import { memo } from 'react';
import { Tabs } from 'aelf-design';
import './index.css';

import HeaderInfo from './components/HeaderInfo';
import VoteInfo from './components/VoteInfo';
import StatusInfo from './components/StatusInfo';
import VoteResultTable from './components/VoteResultTable';
import { useRequest } from 'ahooks';
import { fetchProposalDetail } from 'api/request';
import { store } from 'redux/store';
import { ProposalTab } from './components/ProposalTab';
import { Skeleton, SkeletonList } from 'components/Skeleton';

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
      {loading ? (
        <>
          <Skeleton />
          <SkeletonList />
        </>
      ) : error ? (
        <>error</>
      ) : (
        <>
          {proposalDetailRes?.data && <HeaderInfo proposalDetailData={proposalDetailRes?.data} />}
          {proposalDetailRes?.data && <VoteInfo proposalDetailData={proposalDetailRes?.data} />}

          <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
            <ProposalTab proposalDetailData={proposalDetailRes?.data} />
          </div>

          <StatusInfo proposalDetailData={proposalDetailRes?.data} />
          <VoteResultTable />
        </>
      )}
    </div>
  );
};

export default memo(ProposalDetails);
