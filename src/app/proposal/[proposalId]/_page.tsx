'use client';
import React, { useEffect } from 'react';
import { memo } from 'react';
import { Result } from 'antd';
import './index.css';

import HeaderInfo from './components/HeaderInfo';
import VoteInfo from './components/VoteInfo';
import StatusInfo from './components/StatusInfo';
import VoteResultTable from './components/VoteResultTable';
import { useRequest } from 'ahooks';
import { fetchProposalDetail } from 'api/request';
import { store } from 'redux/store';
import { ProposalTab } from './components/ProposalTab';
import { SkeletonList } from 'components/Skeleton';
import { useParams } from 'next/navigation';
import ErrorResult from 'components/ErrorResult';
import breadCrumb from 'utils/breadCrumb';
import { useWebLogin } from 'aelf-web-login';

const ProposalDetails = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const info = store.getState().elfInfo.elfInfo;
  const { wallet } = useWebLogin();

  const {
    data: proposalDetailRes,
    error,
    loading,
    run,
  } = useRequest(
    async () => {
      return fetchProposalDetail({
        proposalId,
        chainId: info.curChain,
        address: wallet.address,
      });
    },
    {
      manual: true,
    },
  );
  const daoId = proposalDetailRes?.data?.daoId ?? '';
  const aliasName = proposalDetailRes?.data?.alias;

  useEffect(() => {
    if (aliasName) {
      breadCrumb.updateProposalInformationPage(aliasName);
    }
  }, [aliasName]);
  useEffect(() => {
    if (wallet.address) {
      run();
    }
  }, [run, wallet.address]);

  return (
    <div className="proposal-details-wrapper">
      {!wallet.address ? (
        <Result
          className="px-4 lg:px-8"
          status="warning"
          title="Please log in before viewing the proposal."
        />
      ) : loading ? (
        <>
          <SkeletonList />
        </>
      ) : error ? (
        <ErrorResult />
      ) : (
        <>
          {proposalDetailRes?.data && <HeaderInfo proposalDetailData={proposalDetailRes?.data} />}
          {proposalDetailRes?.data && (
            <VoteInfo proposalDetailData={proposalDetailRes?.data} daoId={daoId} />
          )}

          <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
            <ProposalTab proposalDetailData={proposalDetailRes?.data} />
          </div>

          <StatusInfo proposalDetailData={proposalDetailRes?.data} />
          <VoteResultTable voteTopList={proposalDetailRes?.data?.voteTopList ?? []} />
        </>
      )}
      {/* {} */}
    </div>
  );
};

export default memo(ProposalDetails);
