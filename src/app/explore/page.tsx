import React from 'react';
import PageIndex from 'pageComponents/home';
import { fetchDaoList } from 'api/request';
import { curChain } from 'config';

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
  const initData = await getInitDaoList();
  return <PageIndex ssrData={initData} />;
}
