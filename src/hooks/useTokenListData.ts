import { useRequest } from 'ahooks';
import { fetchTokenPrice, fetchAddressTokenList } from 'api/request';
// import { treasuryAccountAddress } from 'config';
import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
export interface ITokenListItem extends IAddressTokenListDataItem {
  price?: number;
  valueUSD?: BigNumber;
}
interface IParams {
  address?: string;
  currentChain?: string;
}
export default function useTokenListData(params: IParams) {
  const { address, currentChain } = params;
  const {
    data: tokenListData,
    error: tokenListError,
    loading: tokenListLoading,
    run,
  } = useRequest(
    () => {
      return fetchAddressTokenList(
        {
          address: address ?? '',
        },
        currentChain,
      );
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (params.address) {
      run();
    }
  }, [params.address]);
  const tokens = useMemo(() => {
    return tokenListData?.data.map((item) => item.symbol);
  }, [tokenListData]);
  const { data: tokenPriceData } = useRequest(async () => {
    const res: Record<string, number> = {};
    if (!tokens) {
      return res;
    }
    const reqArr = tokens.map((token) => {
      return fetchTokenPrice(
        {
          fsym: token,
        },
        currentChain,
      );
    });
    const resArr = await Promise.all(reqArr);
    for (const priceItem of resArr) {
      if (priceItem.USD) {
        res[priceItem.symbol] = priceItem.USD;
      }
    }
    return res;
  });
  const tokenList: ITokenListItem[] = (tokenListData?.data ?? []).map((item) => {
    return {
      ...item,
      price: tokenPriceData?.[item.symbol],
      valueUSD: tokenPriceData?.[item.symbol]
        ? new BigNumber(item.balance).multipliedBy(tokenPriceData[item.symbol])
        : undefined,
    };
  });
  const totalValueUSD = useMemo(() => {
    let sum = BigNumber(0);
    for (const item of tokenList) {
      if (item.valueUSD) {
        sum = sum.plus(item.valueUSD);
      }
    }
    return sum.decimalPlaces(8, BigNumber.ROUND_DOWN).toFormat();
  }, [tokenList]);
  return {
    tokenPriceData,
    tokenList: tokenList,
    tokenListLoading,
    tokenListError,
    totalValueUSD,
  };
}
