import { useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback, useMemo } from 'react';
import { fetchToken } from 'api/request';
import { message } from 'antd';
import useDiscoverProvider from './useTokenDiscoverProvider';
import { sleep } from '@portkey/utils';
import { IContractError } from 'types';
import { formatErrorMsg, LoginFailed } from 'contract/util';
import { emitLoading } from 'utils/myEvent';
import { getCaHashAndOriginChainIdByWallet, getManagerAddressByWallet } from 'utils/wallet';
import { getLocalJWT } from 'utils/localJWT';

const AElf = require('aelf-sdk');

export const useGetToken = () => {
  const { loginState, wallet, getSignature, walletType, logout } = useWebLogin();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const isConnectWallet = useMemo(() => {
    return loginState === WebLoginState.logined;
  }, [loginState]);

  const getTokenFromServer: (props: {
    params: ITokenParams;
    needLoading?: boolean;
    retryCount?: number;
  }) => Promise<ITokenRes | null> = useCallback(
    async (props: { params: ITokenParams; needLoading?: boolean; retryCount?: number }) => {
      const { params, needLoading = false, retryCount = 6 } = props;
      try {
        needLoading && emitLoading(true, 'Authorize account...');
        const rest = await fetchToken(params);
        // await sleep(2000);
        // const rest = {
        //   access_token:
        //     'eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5RTRDRDY0N0Y1MDIzRTc4ODUzNERBNEY3Q0I4MDdDQjIxRTlGMkMiLCJ4NXQiOiJXZVROWkg5UUktZUlVMDJrOTh1QWZMSWVueXciLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiI1NjgyY2YwZC1mMDkyLTQwN2MtYWZjNC02NmRmZjk0NTQ0ZjAiLCJvaV9wcnN0IjoiU2Nocm9kaW5nZXJTZXJ2ZXJfQXBwIiwiY2xpZW50X2lkIjoiU2Nocm9kaW5nZXJTZXJ2ZXJfQXBwIiwib2lfdGtuX2lkIjoiNmE4NTU5NWMtOThiOS02MDAzLTJhYzYtM2ExMmQ3M2I5YWQyIiwiYXVkIjoiU2Nocm9kaW5nZXJTZXJ2ZXIiLCJzY29wZSI6IlNjaHJvZGluZ2VyU2VydmVyIiwianRpIjoiZjBjMjI1ODctMzA4My00YjA4LThjNDktZjRjMjc5NDE0MWJlIiwiZXhwIjoxNzE3MTcwODI5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwiaWF0IjoxNzE2OTk4MDMwfQ.Dp_F1DQ6sDrbapLSUy-LtOIXwbzESE0d_aaediRWwn0ZBi6-JcLv_BxY9mzLM94EcwWwbDNc0ax4aOid_s5biccKPWFbKgcSar6VC_jQPyYkAJRigD5OF-6PtMGyawf6AxscUgI3rcQungqWjpcHKUnZ6T6U9UCQsM47Y-C7nGQgnRe5PNqfJToQPtbOZyYb2d6ssiKup_XQygWB8DJbdMBq9IL1UJWJD0iVvYD-hAVhWGnl7ohUjPCvYSbiBEw2WbCBtBGHDeBmsvPe29Zlq-z5XYSEB7dlaov791QFya0Vu4j_BbAfNaWYe4dCPCHYy6EygwTUfuqdjTJ5w1CDwQ',
        //   expires_in: 120,
        //   token_type: 'Bearer',
        // };
        needLoading && emitLoading(false);
        return rest;
      } catch (error) {
        if (retryCount) {
          await sleep(1000);
          const retry = retryCount - 1;
          return getTokenFromServer({
            ...props,
            retryCount: retry,
          });
        } else {
          message.error(LoginFailed);
          isConnectWallet && logout({ noModal: true });
          needLoading && emitLoading(false);
          return null;
        }
      }
    },
    [],
  );

  const checkTokenValid = useCallback(async () => {
    const { caHash } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
    const managerAddress = await getManagerAddressByWallet(wallet, walletType);
    if (loginState !== WebLoginState.logined) return false;
    const accountInfo = getLocalJWT(caHash + managerAddress);

    return accountInfo;
  }, [loginState, wallet, walletType]);

  const getToken: (params?: { needLoading?: boolean }) => Promise<null | ITokenRes> = useCallback(
    async (params?: { needLoading?: boolean }) => {
      const { needLoading } = params || {};
      if (loginState !== WebLoginState.logined) return null;

      const timestamp = Date.now();

      const signInfo = AElf.utils.sha256(`${wallet.address}-${timestamp}`);

      let publicKey = '';
      let signature = '';
      let source = '';

      // ------------------------------------- signature -------------------------------------
      const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
      if (walletType === WalletType.discover) {
        try {
          const { pubKey, signatureStr } = await getSignatureAndPublicKey(signInfo);
          publicKey = pubKey || '';
          signature = signatureStr || '';
          source = 'portkey';
        } catch (error) {
          const resError = error as IContractError;
          const errorMessage = formatErrorMsg(resError).errorMessage.message;
          message.error(errorMessage);
          isConnectWallet && logout({ noModal: true });
          return null;
        }
      } else {
        const sign = await getSignature({
          appName: 'schrodinger',
          address: wallet.address,
          signInfo:
            walletType === WalletType.portkey
              ? Buffer.from(`${wallet.address}-${timestamp}`).toString('hex')
              : signInfo,
        });
        if (sign?.errorMessage) {
          const errorMessage = formatErrorMsg(sign?.errorMessage as unknown as IContractError)
            .errorMessage.message;
          message.error(errorMessage);
          isConnectWallet && logout({ noModal: true });
          return null;
        }

        publicKey = wallet.publicKey || '';
        signature = sign.signature;
        if (walletType === WalletType.elf) {
          source = 'nightElf';
        } else {
          source = 'portkey';
        }
      }
      // ------------------------------------- request api -------------------------------------
      const res = await getTokenFromServer({
        params: {
          grant_type: 'signature',
          scope: 'TomorrowDAOServer',
          client_id: 'TomorrowDAOServer_App',
          timestamp,
          signature,
          source,
          publickey: publicKey,
          ca_hash: caHash,
          chain_id: originChainId,
          address: wallet.address,
        } as ITokenParams,
        needLoading,
      });

      // checkJoined(wallet.address);
      return res;
    },
    [
      loginState,
      wallet,
      walletType,
      getTokenFromServer,
      getSignatureAndPublicKey,
      isConnectWallet,
      logout,
      getSignature,
    ],
  );

  return { getToken, checkTokenValid };
};
