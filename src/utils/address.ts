import { curChain } from 'config';

export const formatAddress = (address: string) => {
  return `ELF_${address}_${curChain}`;
};
