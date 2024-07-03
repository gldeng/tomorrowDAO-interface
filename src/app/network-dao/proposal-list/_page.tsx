'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import DaoDetail from '../../dao/[aliasName]/DaoDetails';
import { networkDaoId } from 'config';

export default function DeoDetails() {
  return (
    <div>
      <DaoDetail daoId={networkDaoId} isNetworkDAO={true} />
    </div>
  );
}
