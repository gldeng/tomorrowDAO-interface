'use client';
import dynamicReq from 'next/dynamic';
import React from 'react';
const PageIndex = dynamicReq(() => import('../../../my-record/_page'), { ssr: false });

export default function Page() {
  return <PageIndex />;
}
