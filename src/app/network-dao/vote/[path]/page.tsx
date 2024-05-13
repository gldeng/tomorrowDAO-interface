'use client';
import React from 'react';
import dynamicReq from 'next/dynamic';
import { Result } from 'antd';
import { allowPathMap } from '../constants/index'
const PageIndex = dynamicReq(() => import('./_page'), { ssr: false });

interface IProps {
  params: {
    path: string
  }
}
export default function Page(props: IProps) {
  const path = props.params.path;
  if (!Object.keys(allowPathMap).includes(path)) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    )
  }
  return <PageIndex pagePath={path} />;
}