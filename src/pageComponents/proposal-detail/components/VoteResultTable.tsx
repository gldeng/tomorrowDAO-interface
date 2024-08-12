import { memo, useEffect, useState } from 'react';
import { HashAddress, Table } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { TVotingOption } from './type';
import { ColumnsType } from 'antd/es/table';
import thousandsNumber from 'utils/thousandsNumber';
import Link from 'next/link';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { curChain, explorer, sideChainSuffix } from 'config';
import NoData from 'components/NoData';
import { fetchVoteHistory } from 'api/request';
import { useRequest } from 'ahooks';
import { useWebLogin } from 'aelf-web-login';

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
  daoId: string;
  proposalId: string;
}
const defaultPageSize = 20;
const VoteResultTable = (props: IVoteResultTableProps) => {
  const { daoId, proposalId } = props;
  const { wallet } = useWebLogin();
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
    async () => {
      return fetchVoteHistory({
        proposalId: proposalId,
        chainId: curChain,
        skipCount: (tableParams.page - 1) * tableParams.pageSize,
        maxResultCount: tableParams.pageSize,
        daoId: daoId,
      });
    },
    {
      manual: true,
    },
  );

  const pageChange = (page: number, pageSize: number) => {
    setTableParams({
      page,
      pageSize,
    });
  };
  useEffect(() => {
    if (wallet.address) {
      run();
    }
  }, [run, tableParams, wallet.address]);
  return (
    <div className="card-shape vote-result-table-wrap">
      <div className="flex justify-between px-8 py-6 title">
        <h3 className="card-title">Voting Results</h3>
      </div>
      <ConfigProvider renderEmpty={() => <NoData></NoData>}>
        <Table
          rowKey={'transactionId'}
          columns={columns as any}
          scroll={{ x: 'max-content' }}
          pagination={{
            ...tableParams,
            total: voteHistoryData?.data?.total ?? 0,
            onChange: pageChange,
          }}
          loading={voteHistoryLoading}
          dataSource={voteHistoryData?.data?.items}
        ></Table>
      </ConfigProvider>
    </div>
  );
};

export default memo(VoteResultTable);
