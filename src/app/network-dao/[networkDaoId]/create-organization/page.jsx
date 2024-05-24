'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import dynamicReq from 'next/dynamic';
import { SkeletonList } from 'components/Skeleton';
const PageIndex = dynamicReq(() => import('./_page'), {
  ssr: false,
  loading: () => <SkeletonList />,
});

export default function Page(props) {
  return (
    <ConfigProvider prefixCls="antExplorer">
        <PageIndex />
    </ConfigProvider>
  )
}