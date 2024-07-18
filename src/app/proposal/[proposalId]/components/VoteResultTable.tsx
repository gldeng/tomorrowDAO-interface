import { memo, useMemo, useState } from 'react';
import { HashAddress, Table } from 'aelf-design';
import { TVotingOption } from './type';
import { ColumnsType } from 'antd/es/table';
import thousandsNumber from 'utils/thousandsNumber';
import Link from 'next/link';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { explorer, sideChainSuffix } from 'config';

const columns: ColumnsType<IProposalDetailDataVoteTopListItem> = [
  {
    width: 328,
    title: 'Voter',
    dataIndex: 'voter',
    render: (text) => {
      return (
        <HashAddress
          address={text}
          preLen={8}
          endLen={9}
          chain={sideChainSuffix}
          className="card-sm-text-bold"
        />
      );
    },
  },
  {
    width: 344,
    title: 'Transaction ID',
    dataIndex: 'transactionId',
    render: (text) => {
      return (
        <Link href={`${explorer}/tx/${text}`}>
          <HashAddress
            className="card-sm-text-bold"
            ignorePrefixSuffix={true}
            preLen={8}
            endLen={9}
            address={text}
          />
        </Link>
      );
    },
  },
  {
    width: 224,
    title: 'Result',
    dataIndex: 'option',
    render: (text) => {
      return (
        <span
          className={clsx(
            'card-sm-text-bold',
            text === TVotingOption.Approved
              ? 'text-approve'
              : text === TVotingOption.Rejected
              ? 'text-rejection'
              : 'text-abstention',
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    width: 224,
    title: 'Votes',
    dataIndex: 'amount',
    render: (text) => {
      return <span className="card-sm-text-bold">{thousandsNumber(text)}</span>;
    },
  },
  {
    title: 'Time',
    dataIndex: 'voteTime',
    align: 'right',
    render: (text) => {
      return (
        <span className="card-sm-text font-normal">
          {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      );
    },
  },
];
interface IVoteResultTableProps {
  voteTopList: IProposalDetailDataVoteTopListItem[];
}
const defaultPageSize = 20;
const VoteResultTable = (props: IVoteResultTableProps) => {
  const { voteTopList } = props;
  const [tableParams, setTableParams] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: defaultPageSize,
  });

  const pageChange = (page: number, pageSize: number) => {
    setTableParams({
      page,
      pageSize,
    });
  };
  const lists = useMemo(() => {
    const { page, pageSize } = tableParams;
    return voteTopList?.slice((page - 1) * pageSize, page * pageSize) ?? [];
  }, [tableParams, voteTopList]);
  return (
    <div className="card-shape vote-result-table-wrap">
      <div className="flex justify-between px-8 py-6 title">
        <h3 className="card-title">Voting Results</h3>
      </div>
      <Table
        rowKey={'transactionId'}
        columns={columns as any}
        scroll={{ x: 'max-content' }}
        pagination={{
          ...tableParams,
          total: voteTopList?.length ?? 0,
          onChange: pageChange,
        }}
        dataSource={lists}
      ></Table>
    </div>
  );
};

export default memo(VoteResultTable);
