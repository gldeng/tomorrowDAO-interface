'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import dynamicReq from 'next/dynamic';
import { useParams } from 'next/navigation';
const PageIndex = dynamicReq(() => import('./_page'), { ssr: false });

export default function Page() {
  const { address } = useParams();
  return (
    <ConfigProvider prefixCls="antExplorer">
      <PageIndex address={address} />
    </ConfigProvider>
  );
}
