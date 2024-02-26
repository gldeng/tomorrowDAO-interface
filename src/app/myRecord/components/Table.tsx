import { useCallback, useEffect, useState } from 'react';
import { Table, IPaginationProps, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';

import NoData from './NoData';

interface IDataType {
  key: React.Key;
  address: string;
  timeStamp: string;
  proposalId: string;
  proposalName: string;
  MyOption: string;
  votesNum: number;
  TransactionId: string;
}

const data: IDataType[] = [];
for (let i = 0; i < 103; i++) {
  data.push({
    key: i,
    address: `London, Park Lane no. ${i}`,
    timeStamp: '1111',
    proposalId: '',
    proposalName: '',
    MyOption: '',
    votesNum: i,
    TransactionId: '',
  });
}

interface TableParams {
  address: string;
  chainId: string;
  pagination: IPaginationProps;
}

export default function RecordTable() {
  const [dataSource, setDataSource] = useState<IDataType[]>();
  const [loading, setLoading] = useState(false);

  const [tableParams, setTableParams] = useState<TableParams>({
    address: '',
    chainId: '',
    pagination: {
      current: 1,
      pageSize: 10,
      total: 103,
    },
  });

  const columns: ColumnsType<IDataType> = [
    {
      title: 'Time',
      dataIndex: 'timeStamp',
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Proposal Name / ID',
      dataIndex: 'proposalName',
      render: (text) => (
        <div>
          <HashAddress preLen={8} endLen={9} address={text}></HashAddress>
          <Typography.Text>Executed by me</Typography.Text>
        </div>
      ),
    },
    {
      title: 'My Option',
      dataIndex: 'MyOption',
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
      title: 'Transaction ID',
      dataIndex: 'TransactionId',
    },
  ];
  const fetchData = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { current: page = 1, pageSize = 10 } = tableParams.pagination;
    const result = data.slice((page - 1) * pageSize, page * pageSize);
    // setDataSource(result);
    setLoading(false);
  }, [tableParams.pagination]);

  const pageChange = (page: number) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: page,
      },
    });
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: page,
        pageSize: pageSize,
      },
    });
  };

  const handleRowClassName = (): string => {
    return 'customRow';
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ConfigProvider renderEmpty={() => <NoData></NoData>}>
      <Table
        scroll={{ x: 800 }}
        className="custom-table-style"
        columns={columns}
        loading={loading}
        pagination={{ ...tableParams.pagination, pageChange, pageSizeChange }}
        dataSource={dataSource}
        rowClassName={handleRowClassName}
      ></Table>
    </ConfigProvider>
  );
}
