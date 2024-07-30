'use client';
import React, { useEffect } from 'react';
import { memo } from 'react';
import { Result } from 'antd';
import './index.css';
import Script from 'next/script';
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
      const params: IProposalDetailReq = {
        proposalId,
        chainId: info.curChain,
      };
      if (wallet.address) {
        params.address = wallet.address;
      }
      return fetchProposalDetail(params);
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
    run();
  }, [run, wallet.address]);

  return (
    <div className="proposal-details-wrapper">
      {loading ? (
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
      <Script defer src="https://cdn.commento.io/js/commento.js"></Script>
      <div id="commento"></div>
    </div>
  );
};

export default memo(ProposalDetails);
