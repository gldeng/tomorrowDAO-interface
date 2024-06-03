'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import EditDao from 'pageComponents/EditDao';

export default function DeoDetails() {
  const { networkDaoId } = useParams();
  return (
    <div>
      <EditDao daoId={typeof networkDaoId === 'string' ? networkDaoId : ''} isNetworkDAO={true} />
    </div>
  );
}
