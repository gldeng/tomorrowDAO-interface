'use client';
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Divider, ConfigProvider } from 'antd';
import { HashAddress, IHashAddressProps, Table } from 'aelf-design';
import TransferTable from './Table/Table';
import { ColumnsType } from 'antd/es/table';
import { TokenIconMap } from 'constants/token';
import useTokenListData, { ITokenListItem } from 'hooks/useTokenListData';
import BoxWrapper from 'app/proposal/[proposalId]/components/BoxWrapper';

import './index.css';
import Link from 'next/link';
import { explorer, mainExplorer } from 'config';
import { isSideChain } from 'utils/chian';
interface ITransparentProps {
  address: string;
  currentChain?: string;
  title: React.ReactNode;
}
export default function Transparent(props: ITransparentProps) {
  const { address, currentChain, title } = props;
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
          <span>
            {TokenIconMap[token] && (
              <img className="token-logo " src={TokenIconMap[token]} alt="" />
            )}
            {token}
          </span>
        );
      },
    },
    {
      title: 'balance',
      dataIndex: 'balance',
      defaultSortOrder: 'descend',
      sorter: (a, b) => Number(a.balance) - Number(b.balance),
      className: 'table-header-sorter-left',
      showSorterTooltip: false,
    },
    {
      title: 'value',
      dataIndex: 'valueUSD',
      render(value) {
        return <span>{value?.decimalPlaces?.(8, BigNumber.ROUND_DOWN)?.toFormat() ?? '-'}</span>;
      },
    },
  ];
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
        <div>
          <div className="text-Neutral-Secondary-Text text-[14px] font-not-italic font-500 h-[22px]">
            Treasury Balance
          </div>
          <div className="self-stretch text-neutralTitle text-[24px] font-not-italic font-500 h-[32px] mt-[8px]">
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
        <div></div>
      </BoxWrapper>
      <BoxWrapper className="mt-[20px]">
        <h2 className="pb-[20px]">All Income and Expenses</h2>
        <TransferTable address={address} currentChain={currentChain} />
      </BoxWrapper>
    </div>
  );
}
