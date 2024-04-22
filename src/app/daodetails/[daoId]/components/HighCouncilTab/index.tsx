import { useCallback, useEffect, useState } from 'react';
import { Table, IPaginationProps, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd';
import { HCType } from '../../type';

import NoData from '../NoData';
import './index.css';

interface IDataType {
  key: React.Key;
  name: string;
  type: string;
  address: string;
  stakeAmount: string;
  votesAmount: string;
  textWrap?: string;
}

const data: IDataType[] = [];
for (let i = 0; i < 103; i++) {
  data.push({
    key: i,
    type: 'ember',
    name: `Edward King ${i}`,
    address: `London, Park Lane no. ${i}`,
    stakeAmount: '1111',
    votesAmount: '222',
  });
}

interface TableParams {
  pagination: IPaginationProps;
  daoId?: string;
  chainId?: string; // AELF/tDVV
  sortFiled?: string;
  sort?: string;
}

export default function HighCounCilTab(props: {
  hcType?: string;
  onChangeHcType: (t: HCType) => void;
}) {
  const { hcType, onChangeHcType } = props;
  const [dataSource, setDataSource] = useState<IDataType[]>();
  const [loading, setLoading] = useState(false);

  const [tableParams, setTableParams] = useState<TableParams>({
    daoId: 'aaa',
    chainId: '', // AELF/tDVV
    sortFiled: 'obtainedVotes',
    sort: 'desc',
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  const columns: ColumnsType<IDataType> = [
    {
      title: 'No.',
      dataIndex: 'key',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        { text: 'All', value: '' },
        { text: 'Member', value: 'Member' },
        { text: 'Candidate', value: 'Candidate' },
      ],
      filterMultiple: false,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (text) => (
        <HashAddress className="w-250" preLen={8} endLen={9} address={text}></HashAddress>
      ),
      width: '200',
    },
    {
      title: 'Staked Token',
      dataIndex: 'stakeAmount',
      sorter: true,
    },
    {
      title: 'Obtained Votes',
      dataIndex: 'votesAmount',
      sorter: true,
      defaultSortOrder: 'descend',
    },
  ];
  const fetchData = useCallback(async () => {
    setLoading(true);

    const newParams = {
      daoId: tableParams.daoId,
      chainId: tableParams.chainId,
      type: hcType,
      sorting: tableParams.sortFiled + ' ' + tableParams.sort,
      skipCount: tableParams.pagination?.current,
      maxResultCount: tableParams.pagination?.pageSize, //
    };

    console.log(newParams);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { current: page = 1, pageSize = 10 } = tableParams.pagination;
    const result = data.slice((page - 1) * pageSize, page * pageSize);
    setDataSource(result);
    setLoading(false);
  }, [
    hcType,
    tableParams.chainId,
    tableParams.daoId,
    tableParams.pagination,
    tableParams.sort,
    tableParams.sortFiled,
  ]);

  const pageChange = (page: number) => {
    setTableParams((state) => {
      return {
        ...state,
        pagination: {
          ...tableParams.pagination,
          current: page,
        },
      };
    });
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setTableParams((state) => {
      return {
        ...state,
        pagination: {
          ...tableParams.pagination,
          current: page,
          pageSize: pageSize,
        },
      };
    });
  };

  const handleRowClassName = (): string => {
    return 'customRow';
  };

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter: any) => {
    const type = filters.type ? filters.type[0] : '';
    const { field = '', order } = sorter;
    const params = {
      sortFiled: field,
      sort: order ? (order === 'ascend' ? 'asc' : 'desc') : '',
    };
    onChangeHcType(type as HCType);
    setTableParams((state) => {
      return {
        ...state,
        ...params,
        daoId: 'aaaaa',
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="high-council">
      <div className="high-council-header">
        <Typography.Title fontWeight={FontWeightEnum.Medium} level={6}>
          High Council Members
        </Typography.Title>
        <Typography.Text fontWeight={FontWeightEnum.Medium}>Total of 17 members</Typography.Text>
      </div>
      <ConfigProvider renderEmpty={() => <NoData></NoData>}>
        <Table
          // sortDirections={['asc', 'desc']}
          scroll={{ x: 800 }}
          columns={columns}
          loading={loading}
          pagination={{ ...tableParams.pagination, pageChange, pageSizeChange }}
          dataSource={dataSource}
          rowClassName={handleRowClassName}
          onChange={handleTableChange}
        ></Table>
      </ConfigProvider>
    </div>
  );
}
