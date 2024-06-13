import { curChain } from 'config/testnet';
import { curChain as mainnetSideChain } from 'config/mainnet';
export const isSideChain = (chain?: string) => {
  if (!chain) return false;
  return [curChain, mainnetSideChain].includes(chain);
};
