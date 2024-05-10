'use client';
import React from 'react';
import DaoDetail from './DeoDetails';

export default function DaoDetailPage(props: { params: { daoId: string } }) {
  return <DaoDetail daoId={props.params.daoId} />;
}
