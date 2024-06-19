import { isSideChain } from 'utils/chian';
import { networkType } from 'config';
import getChainIdQuery from 'utils/url';

const getExplorerRPC = () => {
  let explorerRPC = 'https://explorer.aelf.io/chain';
  const chainIdQuery = getChainIdQuery();
  if (networkType === 'TESTNET') {
    if (isSideChain(chainIdQuery.chainId)) {
      explorerRPC = 'https://explorer-test-side02.aelf.io/chain';
    } else {
      explorerRPC = 'https://explorer-test.aelf.io/chain';
    }
  } else if (networkType === 'MAINNET') {
    if (isSideChain(chainIdQuery.chainId)) {
      explorerRPC = 'https://tdvv-explorer.aelf.io/chain';
    } else {
      explorerRPC = 'https://explorer.aelf.io/chain';
    }
  }
  return explorerRPC;
};
export default getExplorerRPC;
