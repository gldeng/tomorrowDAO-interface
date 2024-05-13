'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import DaoDetail from '../../dao/[daoId]/DeoDetails'
import qs from 'query-string';

interface IProps {
}
export default function DeoDetails(props: IProps) {
  const search = useSearchParams();
  return (
    <div>
       <DaoDetail daoId={search.get('daoId') ?? ''} />
    </div>
  )
}
