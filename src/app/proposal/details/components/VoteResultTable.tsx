import { memo, useCallback, useEffect, useState } from 'react';
import BoxWrapper from './BoxWrapper';
import { FontWeightEnum, HashAddress, Search, Table, Typography } from 'aelf-design';
import { ITableProps, IVotingResult, TVotingOption } from './type';
import { ColumnsType } from 'antd/es/table';
import { tableData } from '../tabItem';
import thousandsNumber from 'utils/thousandsNumber';
import clsx from 'clsx';

const columns: ColumnsType<IVotingResult> = [
  {
    width: 320,
    title: <Typography.Text className="text-Neutral-Secondary-Text">Voters</Typography.Text>,
    dataIndex: 'voter',
    render: (text) => {
      return <HashAddress address={text} preLen={8} endLen={9} />;
    },
  },
  {
    width: 320,
    title: (
      <Typography.Text className="text-Neutral-Secondary-Text">Transaction Id</Typography.Text>
    ),
    dataIndex: 'transactionId',
    render: (text) => {
      return <HashAddress ignorePrefixSuffix={true} preLen={8} endLen={9} address={text} />;
    },
  },
  {
    width: 200,
    title: <Typography.Text className="text-Neutral-Secondary-Text">Result</Typography.Text>,
    dataIndex: 'voteOption',
    render: (text) => {
      return (
        <Typography.Text
          fontWeight={FontWeightEnum.Medium}
          className={clsx(
            text === TVotingOption.Approved
              ? 'text-approve'
              : text === TVotingOption.Rejected
              ? 'text-rejection'
              : 'text-abstention',
          )}
        >
          {text}
        </Typography.Text>
      );
    },
  },
  {
    width: 200,
    title: <Typography.Text className="text-Neutral-Secondary-Text">Votes</Typography.Text>,
    dataIndex: 'amount',
    render: (text) => {
      return (
        <Typography.Text fontWeight={FontWeightEnum.Medium}>
          {thousandsNumber(text)}
        </Typography.Text>
      );
    },
  },
  {
    title: <Typography.Text className="text-Neutral-Secondary-Text">Time</Typography.Text>,
    dataIndex: 'voteTime',
    align: 'right',
    render: (text) => {
      return <Typography.Text>{text}</Typography.Text>;
    },
  },
];

const VoteResultTable = () => {
  const [tableParams, setTableParams] = useState<ITableProps>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<IVotingResult[]>([]);
  const [total, setTotal] = useState(0);

  console.log('total', total);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { current: page = 1, pageSize = 10 } = tableParams.pagination;
    const result = tableData.slice((page - 1) * pageSize, page * pageSize);
    setDataSource(result);
    setTotal(tableData.length);
    setLoading(false);
  }, [tableParams.pagination]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <BoxWrapper>
      <div className="flex justify-between pb-6">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          Voting Results
        </Typography.Title>
        <div>
          <Search
            inputSize="small"
            onClear={() => {
              console.log(1);
            }}
            onSelectChange={(obj) => {
              console.log(obj);
            }}
            onPressEnter={() => {
              console.log('enter');
            }}
          />
        </div>
      </div>
      <Table
        columns={columns}
        loading={loading}
        pagination={{ ...tableParams.pagination, total, pageChange, pageSizeChange }}
        dataSource={dataSource}
      ></Table>
    </BoxWrapper>
  );
};

export default memo(VoteResultTable);
