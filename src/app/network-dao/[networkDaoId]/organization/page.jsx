'use client';

import dynamicReq from 'next/dynamic';
import { ConfigProvider } from 'antd';
import { SkeletonList } from 'components/Skeleton';
import React from 'react';
const PageIndex = dynamicReq(() => import('./_page'), {
  ssr: false,
  loading: () => <SkeletonList />,
});

export default function Page(props) {
  return (
    <ConfigProvider prefixCls="antExplorer">
      < PageIndex />
    </ConfigProvider>
  )
}