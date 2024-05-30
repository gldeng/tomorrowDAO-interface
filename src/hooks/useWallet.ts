import {
  useWebLogin,
  WebLoginState,
  WebLoginEvents,
  useWebLoginEvent,
  useLoginState,
  WalletType,
  usePortkeyLock,
  PortkeyInfo,
} from 'aelf-web-login';
import { message } from 'antd';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { dispatch, useSelector } from 'redux/store';
import { setWalletInfo } from 'redux/reducer/userInfo';
import { cloneDeep } from 'lodash-es';
import { TWalletInfoType } from 'types';
import { storages } from 'storages';
import { useRegisterContractServiceMethod } from 'contract/baseContract';
import { useGetToken } from './useGetToken';
import useGetLoginStatus from 'redux/hooks/useGetLoginStatus';
import { setLoginStatus, resetLoginStatus } from 'redux/reducer/loginStatus';
import { useAsyncEffect } from 'ahooks';
import { emitLoading, eventBus, UnAuth } from 'utils/myEvent';
import { apiServer } from 'api/axios';
import { getCaHashAndOriginChainIdByWallet, getManagerAddressByWallet } from 'utils/wallet';
import { setLocalJWT } from 'utils/localJWT';
import { authManager } from 'utils/walletAndTokenInfo';

export const useCheckLoginAndToken = () => {
  const { loginState, login, logout, wallet, walletType } = useWebLogin();
  const isConnectWallet = useMemo(() => loginState === WebLoginState.logined, [loginState]);
  const { getToken, checkTokenValid } = useGetToken();
  const { isLogin } = useGetLoginStatus();
  const success = useRef<<T = any>() => T | void>();

  const checkLogin = async (params?: { onSuccess?: <T = any>() => T | void }) => {
    const { onSuccess } = params || {};
    success.current = onSuccess;
    login();
  };
  const getTokenUpdate = async () => {
    const tokenRes = await getToken({
      needLoading: true,
    });
    const { caHash } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
    const managerAddress = await getManagerAddressByWallet(wallet, walletType);
    const key = caHash + managerAddress;
    // // emitLoading(false, 'Authorize account...');
    console.log('tokenRes', tokenRes);
    emitLoading(false);
    if (tokenRes?.access_token) {
      dispatch(
        setLoginStatus({
          hasToken: true,
          isLogin: true,
        }),
      );
      apiServer.setToken(tokenRes?.access_token);
      setLocalJWT(key, tokenRes as LocalJWTData);
    }
  };
  useAsyncEffect(async () => {
    if (isConnectWallet) {
      if (authManager.isAuthing) return;
      authManager.isAuthing = true;
      emitLoading(true, 'Authorize account...');
      console.log('isConnectWallet', isConnectWallet);
      const checkRes = await checkTokenValid();
      console.log('checkRes', checkRes);
      if (checkRes) {
        dispatch(
          setLoginStatus({
            hasToken: true,
            isLogin: true,
          }),
        );
        emitLoading(false);
        authManager.isAuthing = false;
        return;
      }
      await getTokenUpdate();
      authManager.isAuthing = false;
      // emitLoading(true, 'Authorize account...');
    }
  }, [isConnectWallet]);

  useEffect(() => {
    if (isLogin) {
      success.current && success.current();
      success.current = undefined;
    }
  }, [isLogin]);

  // useAsyncEffect(async () => {
  //   const { caHash } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
  //   const managerAddress = await getManagerAddressByWallet(wallet, walletType);
  //   const accountInfo = getLocalJWT(caHash + managerAddress);
  //   if (accountInfo?.access_token) {
  //     dispatch(
  //       setLoginStatus({
  //         hasToken: true,
  //       }),
  //     );
  //     return;
  //   }
  // }, []);

  return {
    checkTokenValid,
    logout,
    checkLogin,
    getTokenUpdate,
  };
};
export const useWalletInit = () => {
  const webLoginContext = useWebLogin();
  const handleClearRef = useRef<() => void>();
  const { wallet, walletType, logout } = webLoginContext;
  // register Contract method
  useRegisterContractServiceMethod();
  useCheckLoginAndToken();
  const callBack = useCallback(
    (state: WebLoginState) => {
      if (state === WebLoginState.lock) {
        // backToHomeByRoute();
      }
      if (state === WebLoginState.logined) {
        const walletInfo: TWalletInfoType = {
          ...wallet,
          address: wallet?.address || '',
          publicKey: wallet?.publicKey,
        };
        if (walletType === WalletType.elf) {
          // walletInfo.aelfChainAddress = wallet?.address || '';
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
        dispatch(setWalletInfo(cloneDeep(walletInfo)));
      }
    },
    [walletType, wallet],
  );

  useLoginState(callBack);

  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, (error) => {
    message.error(`${error.message || 'LOGIN_ERROR'}`);
  });
  useWebLoginEvent(WebLoginEvents.LOGINED, () => {
    message.success('log in');
  });

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    localStorage.removeItem(storages.daoAccessToken);
    localStorage.removeItem(storages.walletInfo);
    dispatch(resetLoginStatus());
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
  const handleClear = () => {
    logout();
    dispatch(resetLoginStatus());
  };
  handleClearRef.current = handleClear;
  useEffect(() => {
    const clear = () => {
      handleClearRef.current?.();
    };
    eventBus.on(UnAuth, clear);
    return () => {
      eventBus.removeListener(UnAuth, clear);
    };
  }, []);
  // useEffect(() => {
  // WalletAndTokenInfo.setWallet(
  //   webLoginContext.walletType,
  //   webLoginContext.wallet,
  //   webLoginContext.version,
  // );
  // WalletAndTokenInfo.setSignMethod(getToken);
  // }, [getToken, webLoginContext]);
};

export const useWalletService = () => {
  const { login, logout, loginState, walletType, wallet } = useWebLogin();
  const loginStatus = useSelector((state) => state.loginStatus);
  const { lock } = usePortkeyLock();
  const isLogin = loginStatus.loginStatus.isLogin;
  return { login, logout, isLogin, walletType, lock, wallet };
};
