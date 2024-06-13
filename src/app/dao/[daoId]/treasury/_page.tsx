'use client';
import React, { useEffect } from 'react';
import Treasury from 'pageComponents/treasury';
import { SkeletonList } from 'components/Skeleton';
import { curChain, treasuryContractAddress } from 'config';
import { useRequest } from 'ahooks';
// import { fetchTreasuryAssets } from 'api/request';
import useUpdateHeaderDaoInfo from 'hooks/useUpdateHeaderDaoInfo';
import breadCrumb from 'utils/breadCrumb';
import { callViewContract } from 'contract/callContract';
interface ITreasuryDetailsProps {
  daoId: string;
}
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { daoId } = props;
  const { data: treasuryAddress, loading: treasuryAddressLoading } = useRequest(async () => {
    // fetchTreasuryAssets({
    //   daoId: id,
    //   chainId: curChain,
    // }),
    const res = await callViewContract<string, string>(
      'GetTreasuryAccountAddress',
      daoId,
      treasuryContractAddress,
    );
    return res;
  });
  useUpdateHeaderDaoInfo(daoId);
  useEffect(() => {
    breadCrumb.updateTreasuryPage(daoId);
  }, [daoId]);
  return (
    <div>
      {treasuryAddressLoading || !treasuryAddress ? (
        <SkeletonList />
      ) : (
        <Treasury address={treasuryAddress} currentChain={curChain} />
      )}
    </div>
  );
}
