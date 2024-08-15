'use client';
import React, { useEffect } from 'react';
import { message } from 'antd';
import Treasury from 'pageComponents/treasury';
import { curChain } from 'config';
import { useRequest } from 'ahooks';
import breadCrumb from 'utils/breadCrumb';
import { fetchDaoInfo } from 'api/request';
interface ITreasuryDetailsProps {
  aliasName: string;
  ssrData: {
    treasuryAddress: string;
  };
}
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { aliasName, ssrData } = props;
  const { data: daoData } = useRequest(async () => {
    if (!aliasName) {
      message.error('aliasName is required');
      return null;
    }
    return fetchDaoInfo({ alias: aliasName, chainId: curChain });
  });
  useEffect(() => {
    breadCrumb.updateTreasuryPage(aliasName);
  }, [aliasName]);
  return (
    <div>
      <Treasury
        aliasName={aliasName}
        address={ssrData?.treasuryAddress}
        currentChain={curChain}
        title={`${daoData?.data?.metadata?.name ?? 'DAO'} Treasury`}
        isNetworkDao={false}
      />
    </div>
  );
}
