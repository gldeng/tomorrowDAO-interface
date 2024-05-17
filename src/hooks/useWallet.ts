import {
  useWebLogin,
  WebLoginState,
  WebLoginEvents,
  useWebLoginEvent,
  useLoginState,
  WalletType,
  useGetAccount,
  usePortkeyLock,
  PortkeyInfo,
} from 'aelf-web-login';
import { message } from 'antd';
import { useCallback } from 'react';
import { getOriginalAddress } from 'utils/addressFormatting';
import { dispatch } from 'redux/store';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { useLocalStorage } from 'react-use';
import { cloneDeep } from 'lodash-es';
import { TWalletInfoType } from 'types';
import { storages } from 'utils/constant';
import { useRegisterContractServiceMethod } from 'contract/baseContract';

export const useWalletInit = () => {
  const [, setLocalWalletInfo] = useLocalStorage<TWalletInfoType>(storages.walletInfo);
  const getAccountInAELF = useGetAccount('AELF');
  const { wallet, walletType } = useWebLogin();
  // register Contract method
  useRegisterContractServiceMethod();
  const callBack = useCallback(
    (state: WebLoginState) => {
      if (state === WebLoginState.lock) {
        // backToHomeByRoute();
      }
      if (state === WebLoginState.logined) {
        const walletInfo: TWalletInfoType = {
          address: wallet?.address || '',
          publicKey: wallet?.publicKey,
          aelfChainAddress: '',
        };
        if (walletType === WalletType.elf) {
          walletInfo.aelfChainAddress = wallet?.address || '';
          walletInfo.nightElfInfo = wallet.nightElfInfo;
        }
        if (walletType === WalletType.discover) {
          walletInfo.discoverInfo = {
            accounts: wallet.discoverInfo?.accounts || {},
            address: wallet.discoverInfo?.address || '',
            nickName: wallet.discoverInfo?.nickName,
          };
        }
        if (walletType === WalletType.portkey) {
          walletInfo.portkeyInfo = wallet.portkeyInfo as PortkeyInfo;
        }
        setTimeout(() => {
          getAccountInAELF()
            .then((aelfChainAddress: string) => {
              walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);
            })
            .catch((error) => {
              console.log('getAccountInAELF error', error);
            })
            .finally(() => {
              dispatch(setWalletInfo(cloneDeep(walletInfo)));
              setLocalWalletInfo(cloneDeep(walletInfo));
            });
        }, 500);
      }
    },
    [getAccountInAELF, walletType, wallet, setLocalWalletInfo],
  );

  useLoginState(callBack);

  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, (error) => {
    message.error(`${error.message || 'LOGIN_ERROR'}`);
  });
  useWebLoginEvent(WebLoginEvents.LOGINED, () => {
    message.success('log in');
  });

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    console.log('logout');
    localStorage.removeItem(storages.accountInfo);
    localStorage.removeItem(storages.walletInfo);
    dispatch(
      setWalletInfo({
        address: '',
        aelfChainAddress: '',
      }),
    );
  });
  useWebLoginEvent(WebLoginEvents.USER_CANCEL, () => {
    message.error('user cancel');
  });
};

export const useWalletService = () => {
  const { login, logout, loginState, walletType, wallet } = useWebLogin();
  const { lock } = usePortkeyLock();
  const isLogin = loginState === WebLoginState.logined;
  return { login, logout, isLogin, walletType, lock, wallet };
};
