import qs from 'query-string';

const getChainIdQuery: () => { chainId?: string } = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  const searchParams = qs.parse(window.location.search);
  const chainId = searchParams.chainId as string;
  return {
    chainId,
  };
};

export default getChainIdQuery;
