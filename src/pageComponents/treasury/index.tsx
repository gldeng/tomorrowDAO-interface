'use client';
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Divider, ConfigProvider, Tabs } from 'antd';
import { HashAddress, IHashAddressProps, Table } from 'aelf-design';
import TransferTable from './Table/Table';
import { ColumnsType } from 'antd/es/table';
import { TokenIconMap } from 'constants/token';
import useTokenListData, { ITokenListItem } from 'hooks/useTokenListData';
import BoxWrapper from 'app/proposal/[proposalId]/components/BoxWrapper';

import './index.css';
import Link from 'next/link';
import { explorer, mainExplorer } from 'config';
import { isSideChain } from 'utils/chain';
import { numberFormatter } from 'utils/numberFormatter';
import TreasuryNoTxGuide from 'components/TreasuryNoTxGuide';
import { sortIcon } from 'components/TableIcon';
interface ITransparentProps {
  address: string;
  isNetworkDao: boolean;
  currentChain?: string;
  title: React.ReactNode;
}
export default function Transparent(props: ITransparentProps) {
  const { address, currentChain, title, isNetworkDao } = props;
  const { tokenList, totalValueUSD, tokenListLoading } = useTokenListData({
    address,
    currentChain,
  });

  const columns: ColumnsType<ITokenListItem> = [
    {
      title: 'token',
      dataIndex: 'symbol',
      align: 'left',
      className: 'treasury-table-column-clear-pl',
      render(token) {
        return (
          <span className="flex items-center">
            {TokenIconMap[token] && (
              <img className="token-logo pr-[2px]" src={TokenIconMap[token]} alt="" />
            )}
            {token}
          </span>
        );
      },
    },
    {
      title: 'balance',
      dataIndex: 'balance',
      className: 'table-header-sorter-left',
      showSorterTooltip: false,
      render(balance) {
        return numberFormatter(balance);
      },
    },
    {
      title: 'value',
      dataIndex: 'valueUSD',
      defaultSortOrder: 'descend',
      sortIcon,
      sorter: (a, b) => Number(a.valueUSD) - Number(b.valueUSD),
      render(value) {
        return (
          <span>
            {value === 0 ? '-' : value?.decimalPlaces?.(8, BigNumber.ROUND_DOWN)?.toFormat() ?? '-'}
          </span>
        );
      },
    },
  ];
  const isShowGuide = tokenList.length === 0 && !tokenListLoading && !isNetworkDao;
  console.log('isShowGuide', isShowGuide);
  return (
    <div>
      <BoxWrapper>
        <div className="flex justify-between lg:flex-row flex-col">
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
            <div>
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
                  columns={columns as any}
                  dataSource={tokenList ?? []}
                  loading={tokenListLoading}
                ></Table>
              </ConfigProvider>
            </div>
          </>
        )}

        <div></div>
      </BoxWrapper>
      {!isShowGuide && (
        <BoxWrapper className="mt-[20px]">
          <h2 className="pb-[20px]">All Income and Expenses</h2>
          <Tabs
            defaultActiveKey="1"
            size="small"
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
        </BoxWrapper>
      )}
    </div>
  );
}
