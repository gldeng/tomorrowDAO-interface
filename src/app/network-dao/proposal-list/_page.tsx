'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import DaoDetail from '../../dao/[daoId]/DaoDetails'
import qs from 'query-string';

interface IProps {
}
export default function DeoDetails(props: IProps) {
  const search = useSearchParams();
  return (
    <div>
      <DaoDetail daoId={search.get('daoId') ?? ''} isNetworkDAO={true} />
    </div>
  )
}
