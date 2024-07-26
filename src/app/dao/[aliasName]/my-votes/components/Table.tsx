import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Table, HashAddress } from 'aelf-design';
import { ConfigProvider, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { fetchDaoInfo, fetchVoteHistory } from 'api/request';
import { EVoteOption } from 'types/vote';
import NoData from 'components/NoData';
import { curChain, explorer } from 'config';
import { useRequest } from 'ahooks';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useWalletService } from 'hooks/useWallet';
import breadCrumb from 'utils/breadCrumb';
import { DownOutlined, UpOutlined } from '@aelf-design/icons';
import BigNumber from 'bignumber.js';

const defaultPageSize = 20;
const allValue = 'All';
export default function RecordTable() {
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const { aliasName } = useParams<{ aliasName: string }>();
  const runFetchVoteHistoryRef = useRef<(daoId: string) => void>();
  const { isLogin } = useWalletService();
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
  const daoId = daoData?.data?.id;

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
    (daoId) => {
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

  useEffect(() => {
    breadCrumb.updateMyVotesPage(aliasName);
  }, [aliasName]);
  const columns: ColumnsType<IVoteHistoryItem> = [
    {
      title: 'Time',
      dataIndex: 'timeStamp',
      width: 207,
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
      width: 576,
      render: (text, record) => {
        const renderProposalNode = <div className="text-neutralPrimaryText font-bold">{text}</div>;
        return <Link href={`/proposal/${record.proposalId}`}>{renderProposalNode}</Link>;
      },
    },
    {
      title: 'Vote',
      dataIndex: 'myOption',
      className: 'vote-option-column',
      width: 116,
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
        return <span className={`vote-record-${option} font-bold`}>{EVoteOption[option]}</span>;
      },
    },
    {
      title: 'Votes',
      dataIndex: 'voteNum',
      width: 206,
      render(voteNum) {
        return <span>{BigNumber(voteNum).toFormat()}</span>;
      },
    },
    {
      title: 'Txn Hash',
      dataIndex: 'transactionId',
      render(transactionId) {
        return (
          <Link href={`${explorer}/tx/${transactionId}`}>
            <HashAddress
              className="pl-[4px] my-record-tx-hash"
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

  const pageChange = (page: number, pageSize: number) => {
    setTableParams({
      page,
      pageSize,
    });
  };

  const handleRowClassName = (): string => {
    return 'customRow';
  };
  useEffect(() => {
    if (walletInfo.address && daoId) {
      runFetchVoteHistoryRef.current?.(daoId);
    }
  }, [tableParams, walletInfo, isLogin, daoId]);

  return (
    <ConfigProvider renderEmpty={() => <NoData></NoData>}>
      <Table
        scroll={{ x: 'max-content' }}
        className="custom-table-style full-table table-header-normal table-td-sm clear-table-padding table-padding-large"
        columns={columns as any}
        loading={voteHistoryLoading}
        pagination={{
          ...tableParams,
          total: voteHistoryData?.data?.total ?? 0,
          onChange: pageChange,
        }}
        dataSource={voteHistoryData?.data?.items ?? []}
        rowClassName={handleRowClassName}
      ></Table>
    </ConfigProvider>
  );
}
