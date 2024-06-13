'use client';
import React, { useEffect } from 'react';
import { message } from 'antd';
import Treasury from 'pageComponents/treasury';
import { SkeletonList } from 'components/Skeleton';
import { curChain, treasuryContractAddress } from 'config';
import { useRequest } from 'ahooks';
// import { fetchTreasuryAssets } from 'api/request';
import useUpdateHeaderDaoInfo from 'hooks/useUpdateHeaderDaoInfo';
import breadCrumb from 'utils/breadCrumb';
import { callViewContract } from 'contract/callContract';
import { fetchDaoInfo } from 'api/request';
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
  const { data: daoData } = useRequest(async () => {
    if (!daoId) {
      message.error('daoId is required');
      return null;
    }
    return fetchDaoInfo({ daoId, chainId: curChain });
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
        <Treasury
          address={treasuryAddress}
          currentChain={curChain}
          title={`${daoData?.data?.metadata?.name ?? 'DAO'} Treasury`}
        />
      )}
    </div>
  );
}
