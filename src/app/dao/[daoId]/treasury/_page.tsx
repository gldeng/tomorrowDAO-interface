'use client';
import React, { useEffect } from 'react';
import Treasury from 'pageComponents/treasury';
import { SkeletonList } from 'components/Skeleton';
import { curChain } from 'config';
import { useRequest } from 'ahooks';
import { fetchTreasuryAssets } from 'api/request';
import useUpdateHeaderDaoInfo from 'hooks/useUpdateHeaderDaoInfo';
import breadCrumb from 'utils/breadCrumb';
interface ITreasuryDetailsProps {
  daoId: string;
}
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { daoId } = props;
  const { data, loading } = useRequest(() =>
    fetchTreasuryAssets({
      daoId: daoId,
      chainId: curChain,
    }),
  );
  const address = data?.data.treasuryAddress;
  useUpdateHeaderDaoInfo(daoId);
  useEffect(() => {
    breadCrumb.updateTreasuryPage(daoId);
  }, [daoId]);
  return (
    <div>
      {loading || !address ? (
        <SkeletonList />
      ) : (
        <Treasury address={address} currentChain={curChain} />
      )}
    </div>
  );
}
