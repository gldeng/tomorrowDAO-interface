'use client';

import { useParams } from 'next/navigation';
import DaoDetail from '../../dao/[daoId]/_page'
import qs from 'query-string';
interface IProps {
}
export default function DeoDetails(props: IProps) {
  const { daoId } = qs.parse(window.location.search);
  return (
    <div>
    <DaoDetail daoId={daoId as string} />
  </div>)
}
