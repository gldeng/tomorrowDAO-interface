'use client';
import React from 'react';
import DaoDetail from '../../dao/[aliasName]/NetworkDaoDetails';
import { networkDaoId } from 'config';

export default function DeoDetails() {
  return (
    <div>
      <DaoDetail daoId={networkDaoId} isNetworkDAO={true} />
    </div>
  );
}
