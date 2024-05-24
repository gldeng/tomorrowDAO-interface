'use client';
import React from 'react';
import dynamicReq from 'next/dynamic';
const PageIndex = dynamicReq(() => import('./CreateDaoPage'), { ssr: false });

export default function Page() {
  return <PageIndex />;
}
