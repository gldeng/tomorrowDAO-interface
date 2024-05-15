'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import DaoDetail from '../../../dao/[daoId]/DaoDetails';

export default function DeoDetails() {
  const { networkDaoId } = useParams();
  return (
    <div>
      <DaoDetail daoId={typeof networkDaoId === 'string' ? networkDaoId : ''} isNetworkDAO={true} />
    </div>
  );
}
