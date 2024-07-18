'use client';
import React from 'react';
import { Divider, ConfigProvider, Tabs } from 'antd';
import { HashAddress, IHashAddressProps, Table } from 'aelf-design';
import TransferTable from './Table/Table';
import { TableProps } from 'antd/es/table';
import { TokenIconMap } from 'constants/token';
import useTokenListData from 'hooks/useTokenListData';
import BoxWrapper from 'app/proposal/[proposalId]/components/BoxWrapper';
import Symbol from 'components/Symbol';
import './index.css';
import Link from 'next/link';
import { explorer, mainExplorer } from 'config';
import { isSideChain } from 'utils/chain';
import TreasuryNoTxGuide from 'components/TreasuryNoTxGuide';
import { sortIcon } from 'components/TableIcon';
import { divDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
interface ITransparentProps {
  address: string;
  isNetworkDao: boolean;
  daoId?: string;
  currentChain?: string;
  title: React.ReactNode;
}
export default function Transparent(props: ITransparentProps) {
  const { address, currentChain, title, isNetworkDao, daoId } = props;
  const { tokenList, totalValueUSD, tokenListLoading } = useTokenListData({
    daoId,
    currentChain,
  });

  const columns: TableProps<ITreasuryAssetsResponseDataItem>['columns'] = [
    {
      title: 'token',
      dataIndex: 'symbol',
      align: 'left',
      className: 'treasury-table-column-clear-pl',
      render(token) {
        return (
          <span className="token-pair">
            <Symbol symbol={token} />
          </span>
        );
      },
    },
    {
      title: 'balance',
      dataIndex: 'amount',
      className: 'table-header-sorter-left',
      showSorterTooltip: false,
      render(amount, record) {
        return divDecimals(amount, record.decimal).toFormat();
      },
    },
    {
      title: 'value',
      dataIndex: 'usdValue',
      defaultSortOrder: 'descend',
      // sortIcon,
      sorter: (a, b) => Number(a.usdValue) - Number(b.usdValue),
      render(value) {
        return (
          <span>{value === 0 ? value : BigNumber(value).toFormat(2, BigNumber.ROUND_FLOOR)}</span>
        );
      },
    },
  ];
  console.log('tokenList', tokenList);
  const isShowGuide = tokenList.length === 0 && !tokenListLoading && !isNetworkDao;
  return (
    <div>
      <div className="card-shape pt-6">
        <div className="flex justify-between lg:flex-row flex-col card-px">
          <span className="text-Primary-Text leading-[32px] font-[500] text-[24px]">{title}</span>
          <span className="flex lg:flex-row flex-col">
            <span className="text-Neutral-Secondary-Text leading-[22px] text-[14px] flex pr-[4px]">
              Treasury Assets Address:
            </span>
            <Link
              href={`${isSideChain(currentChain) ? explorer : mainExplorer}/address/${address}`}
              target="_blank"
            >
              <HashAddress
                className="treasury-address"
                address={address}
                chain={currentChain as IHashAddressProps['chain']}
                preLen={8}
                endLen={9}
              />
            </Link>
          </span>
        </div>
        <Divider className="mb-2 lg:mb-6" />
        {isShowGuide ? (
          <TreasuryNoTxGuide address={address} />
        ) : (
          <>
            <div className="card-px">
              <div className="text-Neutral-Secondary-Text text-[14px] flex items-center font-500 h-[22px]">
                Treasury Balance
              </div>
              <div className=" text-neutralTitle text-[24px] flex items-center font-500 h-[32px] mt-[8px]">
                $ {totalValueUSD}
              </div>
            </div>
            <div>
              <ConfigProvider>
                <Table
                  className="full-table token-list-table"
                  columns={columns as any}
                  dataSource={tokenList ?? []}
                  loading={tokenListLoading}
                  scroll={{
                    x: true,
                  }}
                ></Table>
              </ConfigProvider>
            </div>
          </>
        )}

        <div></div>
      </div>
      {!isShowGuide && (
        <div className="mt-[20px] card-shape pt-[20px]">
          <h2 className="pb-[20px] card-px">All Income and Expenses</h2>
          <Tabs
            defaultActiveKey="1"
            size="small"
            className="full-table"
            items={[
              {
                key: '1',
                label: 'Token Transfers',
                children: (
                  <TransferTable address={address} currentChain={currentChain} isNft={false} />
                ),
              },
              {
                key: '2',
                label: 'NFT Transfers',
                children: (
                  <TransferTable address={address} currentChain={currentChain} isNft={true} />
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
