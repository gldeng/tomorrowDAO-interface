'use client';
import React from 'react';
import dynamicReq from 'next/dynamic';
import { SkeletonList } from 'components/Skeleton';
const PageIndex = dynamicReq(() => import('pageComponents/proposal-detail'), {
  ssr: false,
  loading: () => <SkeletonList />,
});

export default function Page() {
  return <PageIndex />;
}
