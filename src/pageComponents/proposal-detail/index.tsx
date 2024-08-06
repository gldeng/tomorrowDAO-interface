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
import Discussion from './components/Discussion';

const ProposalDetails = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const info = store.getState().elfInfo.elfInfo;
  const { wallet } = useWebLogin();

  const {
    data: proposalDetailRes,
    error,
    loading,
  } = useRequest(async () => {
    const params: IProposalDetailReq = {
      proposalId,
      chainId: info.curChain,
    };
    if (wallet.address) {
      params.address = wallet.address;
    }
    return fetchProposalDetail(params);
  });
  const daoId = proposalDetailRes?.data?.daoId ?? '';
  const aliasName = proposalDetailRes?.data?.alias;

  useEffect(() => {
    if (aliasName) {
      breadCrumb.updateProposalInformationPage(aliasName);
    }
  }, [aliasName]);

  console.log('loading', loading);
  return (
    <div className="proposal-details-wrapper">
      {error ? (
        <ErrorResult />
      ) : (
        <>
          {loading ? (
            <SkeletonList line={1} />
          ) : (
            proposalDetailRes?.data && (
              <HeaderInfo proposalDetailData={proposalDetailRes?.data} proposalId={proposalId} />
            )
          )}
          <VoteInfo
            proposalDetailData={proposalDetailRes?.data}
            daoId={daoId}
            isDetailLoading={loading}
          />

          {loading ? (
            <SkeletonList line={3} />
          ) : (
            <>
              <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
                <ProposalTab proposalDetailData={proposalDetailRes?.data} />
              </div>

              <StatusInfo proposalDetailData={proposalDetailRes?.data} />
              <VoteResultTable voteTopList={proposalDetailRes?.data?.voteTopList ?? []} />
              {proposalDetailRes?.data && (
                <Discussion proposalId={proposalId} daoId={proposalDetailRes?.data?.daoId ?? ''} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default memo(ProposalDetails);
