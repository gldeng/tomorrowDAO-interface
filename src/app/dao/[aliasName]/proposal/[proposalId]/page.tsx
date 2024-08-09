import React from 'react';
import PageIndex from 'pageComponents/proposal-detail';
import { curChain } from 'config';
import { fetchProposalDetail } from 'api/request';

async function getInitData(proposalId: string) {
  const params: IProposalDetailReq = {
    proposalId,
    chainId: curChain,
  };
  const res = await fetchProposalDetail(params);
  return {
    proposalDetailData: res.data,
  };
}
interface IPageProps {
  params: {
    proposalId: string;
  };
}
export default async function Page(props: IPageProps) {
  const proposalId = props.params.proposalId;
  const ssrData = await getInitData(proposalId);
  return <PageIndex ssrData={ssrData} />;
}
