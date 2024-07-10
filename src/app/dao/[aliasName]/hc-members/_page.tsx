'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { curChain } from 'config';
import { useRequest } from 'ahooks';
import useUpdateHeaderDaoInfo from 'hooks/useUpdateHeaderDaoInfo';
import breadCrumb from 'utils/breadCrumb';
import { fetchDaoInfo, fetchHcMembers } from 'api/request';
import { EProposalActionTabs } from 'app/proposal/deploy/[aliasName]/type';
import { message } from 'antd';
import MembersPage from 'pageComponents/members';
import './index.css';
import { checkCreateProposal } from 'utils/proposal';
import { wallet } from '@portkey/utils';
import { useWebLogin } from 'aelf-web-login';
import { useRouter } from 'next/navigation';
interface ITreasuryDetailsProps {
  aliasName?: string;
}
const defaultPageSize = 20;
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { aliasName } = props;
  const [tableParams, setTableParams] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: defaultPageSize,
  });

  const {
    data: daoData,
    error: daoError,
    loading: daoLoading,
  } = useRequest(async () => {
    if (!aliasName) {
      message.error('aliasName is required');
      return null;
    }
    return fetchDaoInfo({ chainId: curChain, alias: aliasName });
  });
  const { wallet } = useWebLogin();
  const [manageLoading, setManageLoading] = useState(false);
  const {
    data: daoMembersData,
    // error: transferListError,
    loading: daoMembersDataLoading,
    run,
  } = useRequest(
    async (daoId) => {
      return fetchHcMembers({
        chainId: curChain,
        daoId: daoId,
      });
    },
    {
      manual: true,
    },
  );
  const daoId = daoData?.data?.id;
  useUpdateHeaderDaoInfo(daoId, aliasName);
  const router = useRouter();

  useEffect(() => {
    breadCrumb.updateHcMembersPage(aliasName);
  }, [aliasName]);

  const pageChange = (page: number, pageSize: number) => {
    setTableParams({
      page,
      pageSize,
    });
  };
  useEffect(() => {
    if (!daoId) return;
    run(daoId);
  }, [daoId, run]);
  const lists = useMemo(() => {
    const { page, pageSize } = tableParams;
    const allLists = daoMembersData?.data ?? [];
    return allLists.slice((page - 1) * pageSize, page * pageSize) ?? [];
  }, [tableParams, daoMembersData]);
  const totalCount = (daoMembersData?.data ?? []).length;
  const handleCreate = async () => {
    if (daoData) {
      setManageLoading(true);
      const check = await checkCreateProposal(daoData, wallet.address);
      setManageLoading(false);
      if (check) {
        router.push(`/proposal/deploy/${aliasName}?tab=${EProposalActionTabs.AddHcMembers}`);
      }
    }
  };
  return (
    <MembersPage
      totalCount={totalCount}
      isLoading={daoLoading || daoMembersDataLoading}
      onManageMembers={handleCreate}
      lists={lists}
      manageLoading={manageLoading}
      pagination={{
        current: tableParams.page,
        pageSize: tableParams.pageSize,
        total: totalCount,
        onChange: pageChange,
      }}
    />
  );
}
