'use client';
import React from 'react';
import DaoDetail from './DaoDetails';

export default function DaoDetailPage(props: { daoId: string }) {
  return <DaoDetail daoId={props.daoId} />;
}
