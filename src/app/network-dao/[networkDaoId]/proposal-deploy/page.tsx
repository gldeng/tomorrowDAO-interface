'use client';
import React from 'react';
import dynamicReq from 'next/dynamic';
const PageIndex = dynamicReq(() => import('app/proposal/deploy/[daoId]/_page'), { ssr: false });
export default function Page() {
  return <PageIndex />;
}
