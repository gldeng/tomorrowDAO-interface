import { useRequest } from 'ahooks';
import { fetchAddressTokenList } from 'api/request';
import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { curChain } from 'config';
export interface ITokenListItem extends IAddressTokenListDataItem {
  price?: number;
  valueUSD?: BigNumber | number;
}
interface IParams {
  daoId?: string;
  currentChain?: string;
}
export default function useTokenListData(params: IParams) {
  const { daoId, currentChain } = params;
  const {
    data: tokenListData,
    error: tokenListError,
    loading: tokenListLoading,
    run,
  } = useRequest(
    () => {
      return fetchAddressTokenList({
        daoId: daoId ?? '',
        chainId: currentChain ?? curChain,
        maxResultCount: 1000,
        skipCount: 0,
      });
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (daoId) {
      run();
    }
  }, [daoId]);
  const totalValueUSD = useMemo(() => {
    return tokenListData?.data?.data?.reduce((acc, item) => {
      return acc.plus(item.usdValue ?? 0);
    }, new BigNumber(0));
  }, [tokenListData]);
  return {
    tokenList: tokenListData?.data?.data ?? [],
    tokenListLoading,
    tokenListError,
    totalValueUSD: totalValueUSD?.toFormat(),
  };
}
