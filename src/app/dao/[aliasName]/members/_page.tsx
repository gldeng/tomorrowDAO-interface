'use client';
import React, { useEffect, useState } from 'react';
import { HashAddress, Table } from 'aelf-design';
import { curChain } from 'config';
import { useRequest } from 'ahooks';
import useUpdateHeaderDaoInfo from 'hooks/useUpdateHeaderDaoInfo';
import breadCrumb from 'utils/breadCrumb';
import { fetchDaoInfo, fetchDaoMembers } from 'api/request';
import { Button } from 'aelf-design';
import Link from 'next/link';
import { EProposalActionTabs } from 'app/proposal/deploy/[aliasName]/type';
import { ColumnsType } from 'antd/es/table';
import useResponsive from 'hooks/useResponsive';
import { message } from 'antd';
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
  const {
    data: daoMembersData,
    // error: transferListError,
    loading: daoMembersDataLoading,
    run,
  } = useRequest(
    async (daoId) => {
      return fetchDaoMembers({
        SkipCount: tableParams.pageSize * (tableParams.page - 1),
        MaxResultCount: tableParams.pageSize,
        ChainId: curChain,
        DAOId: daoId,
      });
    },
    {
      manual: true,
    },
  );
  const daoId = daoData?.data?.id;
  useUpdateHeaderDaoInfo(daoId, aliasName);

  useEffect(() => {
    breadCrumb.updateMembersPage(aliasName);
  }, [aliasName]);
  const pageChange = (page: number, pageSize?: number) => {
    setTableParams({
      page,
      pageSize: pageSize ?? defaultPageSize,
    });
  };
  const { isLG } = useResponsive();

  const pageSizeChange = (page: number, pageSize: number) => {
    setTableParams({
      page,
      pageSize,
    });
  };
  useEffect(() => {
    if (!daoId) return;
    run(daoId);
  }, [tableParams, daoId, run]);
  const columns: ColumnsType<IDaoMembersItem> = [
    {
      title: <span className="table-title-text">Address</span>,
      dataIndex: 'address',
      render(address) {
        const mobileProps = isLG
          ? {
              preLen: 8,
              endLen: 9,
            }
          : {};
        return (
          <span>
            <HashAddress address={address} {...mobileProps} chain={curChain} />
          </span>
        );
      },
    },
  ];
  return (
    <>
      <div className="page-content-bg-border flex justify-between mb-[24px]">
        <h2 className="card-title-lg mb-[4px]">{daoMembersData?.data?.totalCount} Members</h2>
        <Link href={`/proposal/deploy/${aliasName}?tab=${EProposalActionTabs.AddMultisigMembers}`}>
          <Button type="primary" size="medium">
            Manage members
          </Button>
        </Link>
      </div>
      <div className="page-content-bg-border">
        <Table
          pagination={{
            ...tableParams,
            total: daoMembersData?.data.totalCount ?? 0,
            pageChange,
            pageSizeChange,
          }}
          columns={columns as any}
          dataSource={daoMembersData?.data.data ?? []}
          loading={daoMembersDataLoading || daoLoading}
        ></Table>
      </div>
    </>
  );
}
