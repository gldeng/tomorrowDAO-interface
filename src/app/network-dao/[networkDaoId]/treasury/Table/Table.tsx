import React, { useEffect, useState } from 'react';
import { Table, HashAddress } from 'aelf-design';
import { ConfigProvider, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import NoData from './NoData';
import { mainExplorer, treasuryAccountAddress } from 'config';
import { useRequest } from 'ahooks';
import { fetchAddressTransferList } from 'api/request';
// import useResponsive from 'hooks/useResponsive';
import { getFormattedDate } from 'utils/time';
import { numberFormatter } from 'utils/numberFormatter';
import { TokenIconMap } from 'constants/token';

const checkIsOut = (address: string, record: IAddressTransferListDataListItem) => {
  const { from, to, isCrossChain } = record;
  if (isCrossChain === 'Transfer' || isCrossChain === 'no') {
    if (from === address) {
      return true;
    }
    return false;
  }
  // isCrossChain: Receive
  if (to === address) {
    return false;
  }
  return true;
};
const defaultPageSize = 20;
export default function RecordTable() {
  const [timeFormat, setTimeFormat] = useState('Age');
  // const { isLG } = useResponsive();

  const [tableParams, setTableParams] = useState<{ page: number; pageSize: number }>({
    page: 1,
    pageSize: defaultPageSize,
  });
  const {
    data: transferListData,
    // error: transferListError,
    loading: transferListLoading,
    run,
  } = useRequest(
    () => {
      return fetchAddressTransferList({
        address: treasuryAccountAddress,
        pageSize: tableParams.pageSize,
        pageNum: tableParams.page,
      });
    },
    {
      manual: true,
    },
  );
  const handleFormatChange = () => {
    setTimeFormat(timeFormat === 'Age' ? 'Date Time' : 'Age');
  };

  const columns: ColumnsType<IAddressTransferListDataListItem> = [
    {
      title: 'Txn Hash',
      dataIndex: 'txId',
      width: 168,
      className: 'treasury-table-column-clear-pl',
      render(hash) {
        return (
          <span className="txn-hash">
            <Link href={`${mainExplorer}/tx/${hash}`} target="_blank">
              {hash.slice(0, 15)}...
            </Link>
          </span>
        );
      },
    },
    {
      dataIndex: 'action',
      title: 'Method',
      width: 128,
      render: (text) => {
        return (
          <Tooltip title={text} overlayClassName="table-item-tooltip__white">
            <div className="method">{text}</div>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: 'time',
      width: 144,
      title: (
        <div className="time" onClick={handleFormatChange}>
          {timeFormat}
        </div>
      ),
      render: (text) => {
        return <div>{getFormattedDate(text, timeFormat)}</div>;
      },
    },
    {
      title: 'From',
      dataIndex: 'from',
      width: 228,
      render(from, record) {
        return (
          <div className="from">
            <Link href={`${mainExplorer}/address/${from}`} target="_blank">
              <HashAddress className='treasury-address' address={from} preLen={8} endLen={9} />
            </Link>
          </div>
        );
      },
    },
    {
      title: 'Interacted With (To )',
      dataIndex: 'to',
      width: 280,
      render(to, record) {
        const isOut = checkIsOut(treasuryAccountAddress, record);
        return (
          <div className="to flex">
            <Tag color="error" className="w-[36px] flex justify-center">
              { isOut ? 'out' : 'in' }
            </Tag>
            <Link href={`${mainExplorer}/address/${to}`} target="_blank">
              <HashAddress className='treasury-address' address={to} preLen={8} endLen={9} />
            </Link>
          </div>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 180,
      render(amount) {
        return `${numberFormatter(amount)}`;
      },
    },
    {
      title: 'Token',
      dataIndex: 'symbol',
      // width: 200,
      render(symbol) {
        return (
          <Link href={`${mainExplorer}/token/${symbol}`}>
            <div className="token">
              {TokenIconMap[symbol] && <img src={TokenIconMap[symbol]} className="token-logo " alt="" />}
              {symbol}
            </div>
          </Link>
        );
      },
    },
    // {
    //   title: 'Txn Fee',
    //   dataIndex: 'txFee',
    //   align: 'right',
    //   width: 150,
    //   render(fee, record) {
    //     const { symbol } = record;
    //     return <div>{fee[symbol] ? `${fee[symbol]}${symbol}` : '-'}</div>;
    //   },
    // },
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
  useEffect(() => {
    run();
  }, [tableParams]);

  const handleRowClassName = (): string => {
    return 'customRow';
  };

  return (
    <ConfigProvider renderEmpty={() => <NoData></NoData>}>
      <Table
        scroll={{ x: 'max-content' }}
        className="custom-table-style"
        columns={columns as any}
        loading={transferListLoading}
        pagination={{
          ...tableParams,
          total: transferListData?.data?.total ?? 0,
          pageChange,
          pageSizeChange,
        }}
        dataSource={transferListData?.data?.list ?? []}
        rowClassName={handleRowClassName}
      ></Table>
    </ConfigProvider>
  );
}
