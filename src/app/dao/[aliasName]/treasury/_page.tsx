'use client';
import React, { useEffect } from 'react';
import { message } from 'antd';
import Treasury from 'pageComponents/treasury';
import { SkeletonList } from 'components/Skeleton';
import { curChain, treasuryContractAddress } from 'config';
import { useRequest } from 'ahooks';
import breadCrumb from 'utils/breadCrumb';
import { callViewContract } from 'contract/callContract';
import { fetchDaoInfo } from 'api/request';
interface ITreasuryDetailsProps {
  aliasName: string;
}
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { aliasName } = props;
  const {
    data: treasuryAddress,
    loading: treasuryAddressLoading,
    run,
  } = useRequest(
    async (daoId: string) => {
      const res = await callViewContract<string, string>(
        'GetTreasuryAccountAddress',
        daoId,
        treasuryContractAddress,
      );
      return res;
    },
    {
      manual: true,
    },
  );
  const { data: daoData } = useRequest(async () => {
    if (!aliasName) {
      message.error('aliasName is required');
      return null;
    }
    return fetchDaoInfo({ alias: aliasName, chainId: curChain });
  });
  const daoId = daoData?.data?.id;
  useEffect(() => {
    if (daoId) {
      run(daoId);
    }
  }, [daoId, run]);
  useEffect(() => {
    breadCrumb.updateTreasuryPage(aliasName);
  }, [aliasName]);
  return (
    <div>
      {treasuryAddressLoading || !treasuryAddress ? (
        <SkeletonList />
      ) : (
        <Treasury
          daoId={daoId}
          address={treasuryAddress}
          currentChain={curChain}
          title={`${daoData?.data?.metadata?.name ?? 'DAO'} Treasury`}
          isNetworkDao={false}
        />
      )}
    </div>
  );
}
