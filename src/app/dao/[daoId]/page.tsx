'use client';

import DaoDetail from './_page';

export default function DaoDetailPage(props: { params: { daoId: string } }) {
  return <DaoDetail daoId={props.params.daoId} />;
}
