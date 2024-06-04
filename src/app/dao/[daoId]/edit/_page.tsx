'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import EditDao from 'pageComponents/edit-dao';

export default function DeoDetails() {
  const { daoId } = useParams();
  return (
    <div>
      <EditDao daoId={typeof daoId === 'string' ? daoId : ''} isNetworkDAO={false} />
    </div>
  );
}
