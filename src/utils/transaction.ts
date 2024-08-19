import { WalletType, WalletInfo } from 'aelf-web-login';
import { getRawTransactionPortkey } from './getRawTransactionPortkey';
import { getRawTransactionDiscover } from './getRawTransactionDiscover';
import { getRawTransactionNightELF } from './getRawTransactionNightELF';
const checkIsOut = (address: string, record: IAddressTransferListDataListItem) => {
  const { from, to, isCrossChain } = record;
  if (isCrossChain === 'Transfer' || isCrossChain === 'no') {
    if (from === address) {
      return true;
    }
    return false;
  }
  // isCrossChain: Receive
  if (to === address) {
    return false;
  }
  return true;
};
export { checkIsOut };

export interface IRowTransactionPrams<T> {
  walletInfo: WalletInfo;
  walletType: WalletType;
  params: T;
  methodName: string;
  contractAddress: string;
  caContractAddress: string;
  rpcUrl: string;
  chainId: Chain;
}

export const getRawTransaction: <T>(
  params: IRowTransactionPrams<T>,
) => Promise<string | null> = async ({
  walletInfo,
  contractAddress,
  caContractAddress,
  methodName,
  walletType,
  params,
  rpcUrl,
  chainId,
}: IRowTransactionPrams<any>) => {
  console.log('getRawTransaction params', params, rpcUrl, methodName, chainId, walletType);
  if (!rpcUrl || !chainId) return Promise.reject('');

  let res = null;

  try {
    switch (walletType) {
      case WalletType.portkey:
        if (!walletInfo.portkeyInfo) return Promise.reject('');
        res = await getRawTransactionPortkey({
          caHash: walletInfo.portkeyInfo.caInfo.caHash,
          privateKey: walletInfo.portkeyInfo.walletInfo.privateKey,
          contractAddress,
          caContractAddress,
          rpcUrl,
          params,
          methodName,
        });
        break;
      case WalletType.discover:
        if (!walletInfo.discoverInfo) return Promise.reject('');
        res = await getRawTransactionDiscover({
          contractAddress,
          caAddress: walletInfo.discoverInfo.address,
          caContractAddress,
          rpcUrl,
          params,
          methodName,
        });
        break;
      case WalletType.elf:
        res = await getRawTransactionNightELF({
          contractAddress,
          params,
          chainId,
          account: walletInfo.address,
          methodName,
          rpcUrl,
        });
        break;
    }

    return res;
  } catch (error) {
    console.log('getRawTransaction error', error);
    return Promise.reject(error);
  }
};
