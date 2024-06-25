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
import { fetchDaoInfo, fetchDaoMembers } from 'api/request';
import { Button } from 'aelf-design';
interface ITreasuryDetailsProps {
  daoId: string;
}
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { daoId } = props;
  const {
    data: daoMembersData,
    // error: transferListError,
    loading: daoMembersDataLoading,
    run,
  } = useRequest(
    () => {
      return fetchDaoMembers({
        SkipCount: 0,
        MaxResultCount: 6,
        ChainId: curChain,
        DAOId: daoId,
      });
    },
    {
      manual: true,
    },
  );
  useUpdateHeaderDaoInfo(daoId);
  useEffect(() => {
    breadCrumb.updateMembersPage(daoId);
  }, [daoId]);
  useEffect(() => {
    run();
  }, []);
  return (
    <>
      <div className="page-content-bg-border flex justify-between mb-[24px]">
        <h2 className="card-title-lg mb-[4px]">{daoMembersData?.data?.totalCount} Members</h2>
        <Button type="primary" size="medium">
          Manage members
        </Button>
      </div>
      <div className="page-content-bg-border">todo....</div>
    </>
  );
}
