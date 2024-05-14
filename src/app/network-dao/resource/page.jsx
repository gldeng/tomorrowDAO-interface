'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import dynamicReq from 'next/dynamic';
const PageIndex = dynamicReq(() => import('./_page'), { ssr: false });

export default function Page(props) {
    return <ConfigProvider prefixCls="antExplorer"><PageIndex /></ConfigProvider>;
}