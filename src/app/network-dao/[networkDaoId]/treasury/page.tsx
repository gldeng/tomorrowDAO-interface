'use client';
import React from 'react';
import { treasuryAccountAddress } from 'config';
import dynamicReq from 'next/dynamic';
import { SkeletonList } from 'components/Skeleton';
const PageIndex = dynamicReq(() => import('pageComponents/treasury'), {
  ssr: false,
  loading: () => <SkeletonList />,
});

export default function Page() {
  return <PageIndex address={treasuryAccountAddress} title="Network DAO Treasury" isNetworkDao={true}/>;
}
