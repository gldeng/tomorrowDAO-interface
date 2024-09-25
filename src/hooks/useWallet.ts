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
import { setLoginStatus, resetLoginStatus } from 'redux/reducer/loginStatus';
import { useAsyncEffect } from 'ahooks';
import { emitLoading, eventBus, UnAuth, GetTokenLogin } from 'utils/myEvent';
import { apiServer } from 'api/axios';
import { removeJWT, setLocalJWT } from 'utils/localJWT';
import { authManager } from 'utils/walletAndTokenInfo';
import { curChain, networkType } from 'config';
import { useUrlPath } from './useUrlPath';
import { runTimeEnv } from 'utils/env';

export const useWalletService = () => {
  const { login, logout, loginState, walletType, wallet } = useWebLogin();
  const loginStatus = useSelector((state) => state.loginStatus);
  const { lock } = usePortkeyLock();
  const isLogin = loginStatus.loginStatus.isLogin;
  return { login, logout, isLogin, walletType, lock, wallet };
};

export const useCheckLoginAndToken = () => {
  const { loginState, logout, wallet } = useWebLogin();
  const isConnectWallet = useMemo(() => loginState === WebLoginState.logined, [loginState]);
  const { getToken, checkTokenValid } = useGetToken();
  const { isTelegram } = useUrlPath();
  const { isLogin } = useWalletService();

  const getTokenUpdate = async () => {
    const tokenRes = await getToken({
      needLoading: true,
    });
    // const { caHash } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
    // const managerAddress = await getManagerAddressByWallet(wallet, walletType);
    const key = `ELF_${wallet.address}_${curChain}_${networkType}`;
    // // emitLoading(false, 'Authorize account...');
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
      message.success('log in');
    } else {
      logout({ noModal: true });
      dispatch(resetLoginStatus());
      message.error('login failed');
    }
  };
  useAsyncEffect(async () => {
    if (isConnectWallet) {
      if (authManager.isAuthing) return;
      authManager.isAuthing = true;
      emitLoading(true, 'Authorize account...');
      if (!isTelegram) {
        const checkRes = await checkTokenValid();
        if (checkRes) {
          apiServer.setToken(checkRes?.access_token);
          dispatch(
            setLoginStatus({
              hasToken: true,
              isLogin: true,
            }),
          );
          emitLoading(false);
          authManager.isAuthing = false;
          message.success('log in');
          return;
        }
      }
      await getTokenUpdate();
      eventBus.emit(GetTokenLogin);
      authManager.isAuthing = false;
      // emitLoading(true, 'Authorize account...');
    }
  }, [isConnectWallet]);

  useEffect(() => {
    if (wallet.address && isLogin) {
      window.gtag('config', 'TAG_ID', {
        user_id: wallet.address,
      });
      window.gtag('event', 'login_success', {
        user_id: wallet.address,
      });
    }
  }, [wallet.address, isLogin]);

  return {
    checkTokenValid,
    logout,
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
      console.log('web-login-state ->>>>>>>>>>>>>>>>>>>', state);
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
  // useWebLoginEvent(WebLoginEvents.LOGINED, () => {});

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
  const { isTelegram } = useUrlPath();
  const handleClear = () => {
    logout({ noModal: true });
    dispatch(resetLoginStatus());
    removeJWT();
    if (runTimeEnv === 'client' && isTelegram) {
      window.location.reload();
    }
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
