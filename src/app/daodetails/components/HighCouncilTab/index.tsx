import { useEffect, useState } from 'react';
import { Table, IPaginationProps, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';

import NoData from '../NoData';
import './index.css';

interface IDataType {
  key: React.Key;
  name: string;
  address: string;
  onHeaderCell?: any;
  onFilter?: any;
  sorter?: any;
  stakedAmount: string;
  obtainedVotes: string;
}

const data: IDataType[] = [];
for (let i = 0; i < 103; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    address: `London, Park Lane no. ${i}`,
    stakedAmount: '1111' + i,
    obtainedVotes: '222' + i,
  });
}

const handleHeaderCell = () => ({
  style: { background: '#fff' },
});

const columns: ColumnsType<IDataType> = [
  {
    title: 'No.',
    dataIndex: 'key',
    onHeaderCell: handleHeaderCell,
  },
  {
    title: 'Type',
    dataIndex: 'age',
    onHeaderCell: handleHeaderCell,
    filters: [
      { text: 'All', value: '' },
      { text: 'Member', value: 'Member' },
      { text: 'Candidate', value: 'Candidate' },
    ],
    filterMultiple: false,
    onFilter: () => {
      return true;
    },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    onHeaderCell: handleHeaderCell,
    render: (text) => <HashAddress preLen={8} endLen={9} address={text}></HashAddress>,
  },
  {
    title: 'Staked Token',
    dataIndex: 'stakedAmount',
    onHeaderCell: handleHeaderCell,
    sorter: () => {
      return 0;
    },
  },
  {
    title: 'Obtained Votes',
    dataIndex: 'obtainedVotes',
    onHeaderCell: handleHeaderCell,
    sorter: () => {
      return 0;
    },
    defaultSortOrder: 'descend',
  },
];

interface TableParams {
  pagination: IPaginationProps;
}

export default function HighCounCilTab() {
  const [dataSource, setDataSource] = useState<IDataType[]>();
  const [loading, setLoading] = useState(false);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 103,
    },
  });
  const fetchData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { current: page = 1, pageSize = 10 } = tableParams.pagination;
    const result = data.slice((page - 1) * pageSize, page * pageSize);
    // setDataSource(result);
    setLoading(false);
  };

  const pageChange = (page: number) => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: page,
      },
    });
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setTableParams({
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
  }, [tableParams]);

  return (
    <div className="high-council">
      <div className="high-council-header">
        <Typography.Title fontWeight={FontWeightEnum.Medium} level={6}>
          High Council Members
        </Typography.Title>
        <Typography.Text fontWeight={FontWeightEnum.Medium}>High Council Members</Typography.Text>
        {/* <span className="">Total of 17 members</span> */}
      </div>
      <ConfigProvider renderEmpty={() => <NoData></NoData>}>
        <Table
          className="custom-table-style"
          columns={columns}
          loading={loading}
          pagination={{ ...tableParams.pagination, pageChange, pageSizeChange }}
          dataSource={dataSource}
          rowClassName={handleRowClassName}
        ></Table>
      </ConfigProvider>
    </div>
  );
}
