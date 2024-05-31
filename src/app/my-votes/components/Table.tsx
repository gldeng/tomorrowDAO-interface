import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Table, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { fetchVoteHistory } from 'api/request';
import { EVoteOption } from 'types/vote';
import NoData from './NoData';
import { curChain, explorer, NetworkDaoHomePathName } from 'config';
import { useRequest } from 'ahooks';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import Link from 'next/link';
import LinkNetworkDao from 'components/LinkNetworkDao';
import { useWalletService } from 'hooks/useWallet';

const defaultPageSize = 20;
const allValue = 'All';
export default function RecordTable() {
  const searchParams = useSearchParams();
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const pathName = usePathname();
  const { networkDaoId } = useParams();
  const isNetWorkDao = pathName.includes(NetworkDaoHomePathName);
  const daoId = (isNetWorkDao ? networkDaoId : searchParams.get('daoId') ?? '') as string;
  const runFetchVoteHistoryRef = useRef<() => void>();
  const { isLogin } = useWalletService();

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
        daoId: daoId,
      });
    },
    {
      manual: true,
    },
  );
  runFetchVoteHistoryRef.current = run;

  const columns: ColumnsType<IVoteHistoryItem> = [
    {
      title: 'Time',
      dataIndex: 'timeStamp',
      width: 147,
      sorter: (a, b) => {
        return dayjs(a.timeStamp).unix() - dayjs(b.timeStamp).unix();
      },
      defaultSortOrder: 'descend',
      render(time) {
        return <span>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: 'Proposal Name',
      dataIndex: 'proposalTitle',
      width: 250,
      render: (text, record) => {
        const renderProposalNode = <div className="text-neutralPrimaryText">{text}</div>;
        if (isNetWorkDao) {
          return (
            <LinkNetworkDao href={`/proposal-detail-tmrw/${record.proposalId}`}>
              {renderProposalNode}
            </LinkNetworkDao>
          );
        }
        return <Link href={`/proposal/${record.proposalId}`}>{renderProposalNode}</Link>;
      },
    },
    {
      title: 'Proposal ID',
      width: 220,
      dataIndex: 'proposalId',
      render(text, record) {
        const renderId = (
          <HashAddress
            className="pl-[4px]"
            ignorePrefixSuffix={true}
            preLen={8}
            endLen={11}
            address={text}
          ></HashAddress>
        );
        return (
          <div>
            <div>
              {isNetWorkDao ? (
                <LinkNetworkDao href={`/proposal-detail-tmrw/${record.proposalId}`}>
                  {renderId}
                </LinkNetworkDao>
              ) : (
                <Link href={`/proposal/${record.proposalId}`}>{renderId}</Link>
              )}
            </div>
            <div>{record.executer === walletInfo.address ? <span>Executed by me</span> : ''}</div>
          </div>
        );
      },
    },
    {
      title: 'Vote',
      dataIndex: 'myOption',
      width: 100,
      filterMultiple: false,
      filters: [
        { text: 'All', value: allValue },
        { text: 'Approve', value: 0 },
        { text: 'Reject', value: 1 },
        { text: 'Abstain', value: 2 },
      ],
      onFilter: (value, record) => {
        if (value === allValue) {
          return true;
        }
        return record.myOption === value;
      },
      render(option) {
        return <span className={`vote-record-${option}`}>{EVoteOption[option]}</span>;
      },
    },
    {
      title: 'Votes',
      dataIndex: 'voteNum',
      width: 87,
    },
    {
      title: 'Txn Hash',
      dataIndex: 'transactionId',
      width: 220,
      render(transactionId) {
        return (
          <Link href={`${explorer}/tx/${transactionId}`}>
            <HashAddress
              className="pl-[4px]"
              ignorePrefixSuffix={true}
              preLen={8}
              endLen={11}
              address={transactionId}
            ></HashAddress>
          </Link>
        );
      },
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
    if ((walletInfo.address, isLogin)) {
      runFetchVoteHistoryRef.current?.();
    }
  }, [tableParams, walletInfo, isLogin]);

  return (
    <ConfigProvider renderEmpty={() => <NoData></NoData>}>
      <Table
        scroll={{ x: 'max-content' }}
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
