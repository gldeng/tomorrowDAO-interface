import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Table, IPaginationProps, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { fetchVoteHistory } from 'api/request';

import NoData from './NoData';
import { curChain } from 'config';
import { useRequest } from 'ahooks';

const defaultPageSize = 20;
export default function RecordTable() {
  const { walletInfo } = useSelector((store: any) => store.userInfo);

  const [tableParams, setTableParams] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: defaultPageSize,
  });
  const {
    data: voteHistoryData,
    error: voteHistoryError,
    loading: voteHistoryLoading,
    run,
  } = useRequest(
    () => {
      return fetchVoteHistory({
        address: walletInfo.address,
        chainId: curChain,
        skipCount: (tableParams.page - 1) * tableParams.pageSize,
        maxResultCount: tableParams.pageSize,
        proposalId: 'xx',
      });
    },
    {
      manual: true,
    },
  );

  const columns: ColumnsType<IVoteHistoryItem> = [
    {
      title: 'Time',
      dataIndex: 'timeStamp',
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Proposal Name / ID',
      dataIndex: 'ProposalTitle',
      render: (text) => (
        <div>
          {text}
          {/* <HashAddress preLen={8} endLen={9} address={text}></HashAddress> */}
          {/* <Typography.Text>Executed by me</Typography.Text> */}
        </div>
      ),
    },
    {
      title: 'proposalId',
      dataIndex: 'proposalId',
    },
    {
      title: 'My Operation',
      dataIndex: 'myOption',
      filters: [
        { text: 'All', value: '' },
        { text: 'Member', value: 'Member' },
        { text: 'Candidate', value: 'Candidate' },
      ],
    },
    {
      title: 'Votes',
      dataIndex: 'votesNum',
    },
    {
      title: 'transactionId',
      dataIndex: 'transactionId',
    },
    {
      title: 'executer',
      dataIndex: 'executer',
    },
  ];

  const pageChange = (page: number, pageSize?: number) => {
    setTableParams({
      page,
      pageSize: pageSize ?? defaultPageSize,
    });
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setTableParams({
      page,
      pageSize,
    });
  };

  const handleRowClassName = (): string => {
    return 'customRow';
  };
  useEffect(() => {
    run();
  }, [tableParams]);

  return (
    <ConfigProvider renderEmpty={() => <NoData></NoData>}>
      <Table
        scroll={{ x: 800 }}
        className="custom-table-style"
        columns={columns as any}
        loading={voteHistoryLoading}
        pagination={{
          ...tableParams,
          total: voteHistoryData?.data?.total ?? 0,
          pageChange,
          pageSizeChange,
        }}
        dataSource={voteHistoryData?.data?.items ?? []}
        rowClassName={handleRowClassName}
      ></Table>
    </ConfigProvider>
  );
}
