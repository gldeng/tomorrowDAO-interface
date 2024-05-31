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
import { curChain } from 'config';

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
    // const { caHash } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
    // const managerAddress = await getManagerAddressByWallet(wallet, walletType);
    const key = `ELF_${wallet.address}_${curChain}`;
    if (loginState !== WebLoginState.logined) return false;
    const accountInfo = getLocalJWT(key);

    return accountInfo;
  }, [loginState, wallet]);

  const getToken: (params?: {
    needLoading?: boolean;
  }) => Promise<null | ITokenRes> = async (params?: { needLoading?: boolean }) => {
    const { needLoading } = params || {};
    if (loginState !== WebLoginState.logined) return null;

    const timestamp = Date.now();
    const plainTextOrigin = `${wallet.address}-${timestamp}`;
    // const plainText: any = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
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
        appName: 'TomorrowDAOServer',
        address: wallet.address,
        signInfo:
          walletType === WalletType.portkey
            ? Buffer.from(`${wallet.address}-${timestamp}`).toString('hex')
            : AElf.utils.sha256(plainTextOrigin),
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
    const reqParams = {
      grant_type: 'signature',
      scope: 'TomorrowDAOServer',
      client_id: 'TomorrowDAOServer_App',
      timestamp,
      signature,
      source,
      publickey: publicKey,
      chain_id: originChainId,
      address: wallet.address,
    } as ITokenParams;
    if (caHash) {
      reqParams.ca_hash = caHash;
    }
    const res = await getTokenFromServer({
      params: reqParams,
      needLoading,
    });

    // checkJoined(wallet.address);
    return res;
  };

  return { getToken, checkTokenValid };
};
