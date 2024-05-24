'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import { SkeletonList } from 'components/Skeleton';
import dynamicReq from 'next/dynamic';
const PageIndex = dynamicReq(() => import('./_page'), {
  ssr: false,
  loading: () => <SkeletonList />,
});

export default function Page(props) {
  return (
    <ConfigProvider prefixCls="antExplorer">
      <PageIndex />
    </ConfigProvider>
  );
}
