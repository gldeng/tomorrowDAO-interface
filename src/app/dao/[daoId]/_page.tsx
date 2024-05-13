'use client';
import React from 'react';
import DaoDetail from './DeoDetails';

export default function DaoDetailPage(props: { daoId: string }) {
  return <DaoDetail daoId={props.daoId} />;
}
