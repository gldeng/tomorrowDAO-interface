'use client';
import dynamicReq from 'next/dynamic';
import React from 'react';
import { SkeletonList } from 'components/Skeleton';

const PageIndex = dynamicReq(() => import('../../../my-votes/_page'), {
  ssr: false,
  loading: () => <SkeletonList />,
});

export default function Page() {
  return <PageIndex />;
}
