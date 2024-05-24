import { useGetAccount, useWebLogin, WalletType } from 'aelf-web-login';
import { cloneDeep } from 'lodash-es';
import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { dispatch, useSelector } from 'redux/store';
import { did as didV2 } from '@portkey/did-ui-react';
import { did as didV1 } from '@portkey-v1/did-ui-react';
import { MethodsWallet } from '@portkey/provider-types';
import useDiscoverProvider from './useDiscoverProvider';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { getOriginalAddress } from 'utils/addressFormatting';
import { ChainId } from '@portkey/types';
import { curChain } from 'config';

export const useWalletSyncCompleted = (contractChainId = curChain) => {
  const loading = useRef<boolean>(false);
  // todo: 'AELF' curChain
  const getAccountByChainId = useGetAccount(curChain);
  const { wallet, walletType, version } = useWebLogin();
  const { walletInfo } = cloneDeep(useSelector((store: any) => store.userInfo));
  const { discoverProvider } = useDiscoverProvider();
  const did = version === 'v1' ? didV1 : didV2;
  const errorFunc = () => {
    message.open({ content: 'Syncing on-chain account info' });
    loading.current = false;
    return '';
  };

  const getAccount = useCallback(async () => {
    try {
      const aelfChainAddress = await getAccountByChainId();

      walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);

      dispatch(setWalletInfo(walletInfo));
      loading.current = false;
      if (!aelfChainAddress) {
        return errorFunc();
      } else {
        return walletInfo.aelfChainAddress;
      }
    } catch (error) {
      return errorFunc();
    }
  }, [walletInfo, getAccountByChainId]);

  const getAccountInfoSync = useCallback(async () => {
    if (loading.current) return '';
    let caHash;
    let address: any;
    if (walletType === WalletType.elf) {
      return walletInfo.aelfChainAddress;
    }
    if (walletType === WalletType.portkey) {
      loading.current = true;
      const didWalletInfo = wallet.portkeyInfo;
      caHash = didWalletInfo?.caInfo?.caHash;
      address = didWalletInfo?.walletInfo?.address;
      // PortkeyOriginChainId register network address
      const originChainId = didWalletInfo?.chainId;
      if (originChainId === contractChainId) {
        if (contractChainId === 'AELF') {
          return await getAccount();
        } else {
          loading.current = false;
          return wallet.address;
        }
      }
      try {
        const holder = await did.didWallet.getHolderInfoByContract({
          chainId: contractChainId as ChainId,
          caHash: caHash as string,
        });
        const filteredHolders = holder.managerInfos.filter(
          (manager) => manager?.address === address,
        );
        if (filteredHolders.length) {
          return await getAccount();
        } else {
          return errorFunc();
        }
      } catch (error) {
        return errorFunc();
      }
    } else {
      loading.current = true;
      try {
        const provider = await discoverProvider();
        const status = await provider?.request({
          method: MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
          payload: { chainId: contractChainId },
        });
        if (status) {
          return await getAccount();
        } else {
          return errorFunc();
        }
      } catch (error) {
        return errorFunc();
      }
    }
  }, [
    walletType,
    walletInfo.aelfChainAddress,
    wallet.portkeyInfo,
    wallet.address,
    contractChainId,
    getAccount,
    did.didWallet,
    discoverProvider,
  ]);
  return { getAccountInfoSync };
};
