'use client';
import React, { useEffect } from 'react';
import { memo } from 'react';
import './index.css';
import HeaderInfo from './components/HeaderInfo';
import VoteInfo from './components/VoteInfo';
import StatusInfo from './components/StatusInfo';
import VoteResultTable from './components/VoteResultTable';
import { ProposalTab } from './components/ProposalTab';
import { useParams } from 'next/navigation';
import ErrorResult from 'components/ErrorResult';
import breadCrumb from 'utils/breadCrumb';
import Discussion from './components/Discussion';
import { ApplyAnonymousProposalRulesOnProposalDetail } from 'utils/anonymousVoting';
interface IProposalDetailsProps {
  ssrData: {
    proposalDetailData: IProposalDetailData;
  };
}
const ProposalDetails = (props: IProposalDetailsProps) => {
  const { proposalDetailData } = props.ssrData;
  const { proposalId } = useParams<{ proposalId: string }>();
  const daoId = proposalDetailData?.daoId ?? '';
  const aliasName = proposalDetailData?.alias;

  useEffect(() => {
    if (aliasName) {
      breadCrumb.updateProposalInformationPage(aliasName);
    }
  }, [aliasName]);

  useEffect(() => {
    console.log('ssrData', props.ssrData);
  }, []);

  return (
    <div className="proposal-details-wrapper">
      {!proposalDetailData.daoId ? (
        <ErrorResult />
      ) : proposalDetailData.isAnonymous ? (
        <AnonymousProposalDetails ssrData={props.ssrData} proposalId={proposalId} />
      ) : (
          <>
            {proposalDetailData && (
              <HeaderInfo proposalDetailData={proposalDetailData} proposalId={proposalId} />
            )}
            <VoteInfo proposalDetailData={proposalDetailData} daoId={daoId} />

            <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
              <ProposalTab proposalDetailData={proposalDetailData} />
            </div>

            <StatusInfo proposalDetailData={proposalDetailData} />
            <VoteResultTable daoId={proposalDetailData.daoId} proposalId={proposalId} />
            {proposalDetailData && (
              <Discussion proposalId={proposalId} daoId={proposalDetailData?.daoId ?? ''} />
            )}
          </>
        )}
    </div>
  );
};

const AnonymousProposalDetails = (props: IProposalDetailsProps & { proposalId: string; }) => {
  const { proposalDetailData: proposalDetailDataRaw } = props.ssrData;
  const { proposalId } = props;
  const proposalDetailData = ApplyAnonymousProposalRulesOnProposalDetail(proposalDetailDataRaw);

  return <>
    {proposalDetailData && (
      <HeaderInfo proposalDetailData={proposalDetailData} proposalId={proposalId} />
    )}

    <div className="border border-Neutral-Divider border-solid rounded-lg bg-white">
      <ProposalTab proposalDetailData={proposalDetailData} />
    </div>

    <StatusInfo proposalDetailData={proposalDetailData} />
    {proposalDetailData && (
      <Discussion proposalId={proposalId} daoId={proposalDetailData?.daoId ?? ''} />
    )}
  </>
}


export default memo(ProposalDetails);
