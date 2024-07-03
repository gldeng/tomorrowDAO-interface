'use client';
import React from 'react';
import DaoDetail from './DaoDetails';

export default function DaoDetailPage(props: { aliasName: string }) {
  return <DaoDetail aliasName={props.aliasName} />;
}
