import React from 'react';
import PageIndex from 'pageComponents/home';
import { fetchDaoList } from 'api/request';
import { curChain } from 'config';
import { Metadata } from 'next';
import { serverGetSSRData } from 'utils/ssr';
import { ServerError } from 'components/ServerError/index';

async function getInitDaoList() {
  const res = await fetchDaoList({
    skipCount: 0,
    maxResultCount: 6,
    chainId: curChain,
  });
  return {
    daoList: res.data.items,
    daoHasData: res.data.items.length < res.data.totalCount,
  };
}

export default async function Page() {
  const initData = await serverGetSSRData(() => getInitDaoList());
  if (initData.data) {
    return <PageIndex ssrData={initData.data} />;
  }
  return <ServerError error={initData.error} />;
}
export const metadata: Metadata = {
  title: 'Explore TMRWDAO: Discover Decentralised Projects',
  description:
    'Dive into TMRWDAO’s ecosystem. Explore AI-powered, decentralised projects and connect with a global community driving DeFi and decentralised governance.',
};
