'use client';
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import useTransparentData from '../../../hooks/useTransparentData'
import BoxWrapper from '../../proposal/[proposalId]/components/BoxWrapper';
import { numberFormatter } from 'utils/numberFormatter';
import Table from './Table/Table';
export default function Transparent() {
  const { tokenList, tokenPriceData} = useTransparentData()
  console.log(tokenList, tokenPriceData)
  const total = useMemo(() => {
    let sum = BigNumber(0);
    for (const item of tokenList) {
      if (item.valueUSD) {
        sum = sum.plus(item.valueUSD)
      }
    }
    return sum.toFormat();
  }, [tokenList])
  return (
    <div>
      <h1>Transparent</h1>
      <BoxWrapper>
        <div>
        total: {total}
        </div>
        <div>
          {
            tokenList.map((item) => { 
              return <div key={item.symbol}>
                {item.symbol} | 
                {item.balance} |
                {item.price ?? '-'} |
                {item.valueUSD?.toFormat() ?? '-'}
              </div>
            })
          }
        </div>
      </BoxWrapper>
      <BoxWrapper className='mt-[20px]'>
        <Table />
      </BoxWrapper>
    </div>
  );
}