'use client';
import React from 'react';
import dynamicReq from 'next/dynamic';
const PageIndex = dynamicReq(() => import('pageComponents/home'), { ssr: false });
export default function Page() {
  return <PageIndex />;
}

export const ssg = false;
