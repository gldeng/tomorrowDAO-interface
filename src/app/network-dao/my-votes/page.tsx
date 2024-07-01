'use client';
import dynamicReq from 'next/dynamic';
import React from 'react';
const PageIndex = dynamicReq(() => import('../../my-votes/_page'), { ssr: false });

export default function Page() {
  return <PageIndex />;
}
