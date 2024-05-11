'use client';
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Divider, ConfigProvider } from 'antd';
import { Table } from 'aelf-design';
import useTransparentData, { ITokenListItem } from '../../../hooks/useTransparentData'
import BoxWrapper from '../../proposal/[proposalId]/components/BoxWrapper';
import { numberFormatter } from 'utils/numberFormatter';
import TransferTable from './Table/Table';
import { ColumnsType } from 'antd/es/table';
export default function Transparent() {
  const { tokenList, tokenPriceData} = useTransparentData()
  console.log('tokenList', tokenList)
  const total = useMemo(() => {
    let sum = BigNumber(0);
    for (const item of tokenList) {
      if (item.valueUSD) {
        sum = sum.plus(item.valueUSD)
      }
    }
    return sum.decimalPlaces(8, BigNumber.ROUND_DOWN).toFormat();
  }, [tokenList])
  const columns: ColumnsType<ITokenListItem> = [
    {
      title: "token",
      dataIndex: "symbol",
    },
    {
      title: "balance",
      dataIndex: "balance",
    },
    {
      title: "value",
      dataIndex: 'valueUSD',
      render(value) {
        return <span>
          {value?.decimalPlaces?.(8, BigNumber.ROUND_DOWN)?.toFormat() ?? '-'}
        </span>
      }
    }
  ];
  return (
    <div>
      <BoxWrapper>
      Network DAO Transparency Hub
      <Divider className="mb-2 lg:mb-6" />
        <div>
          <div className='text-Neutral-Secondary-Text text-[14px] font-not-italic font-500 leading-[22px]'>
           Treasury Balance
          </div>
          <span className='self-stretch text-neutralTitle text-[24px] font-not-italic font-500 leading-[32px]'>
          $ {total}
          </span>
        </div>
        <div>
        <ConfigProvider>
            <Table
              columns={columns as any}
              dataSource={tokenList ?? []}
            ></Table>
          </ConfigProvider>
        </div>
        <div>
        </div>
      </BoxWrapper>
      <BoxWrapper className='mt-[20px]'>
        <TransferTable />
      </BoxWrapper>
    </div>
  );
}