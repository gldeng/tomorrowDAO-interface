'use client';
import { NetworkType } from '@portkey/did-ui-react';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';

const APP_NAME = 'TMRWDAO';

function addBasePath(url: string) {
  if (String(url).startsWith('http')) {
    return url;
  }
  return `${url}`;
}

const PortkeyProviderDynamic = dynamic(
  async () => {
    const weblogin = await import('aelf-web-login').then((module) => module);
    return weblogin.PortkeyProvider;
  },
  { ssr: false },
) as any;
const WebLoginProviderDynamic = dynamic(
  async () => {
    const info = store.getState().elfInfo.elfInfo;
    const server = info.portkeyServer;
    const connectUrl = info?.connectUrl;
    const networkType = (info.networkType || 'TESTNET') as NetworkType;

    const webLogin = await import('aelf-web-login').then((module) => module);

    webLogin.setGlobalConfig({
      appName: APP_NAME,
      chainId: info.curChain || '',
      onlyShowV2: true,
      portkey: {},
      portkeyV2: {
        networkType: networkType,
        useLocalStorage: true,
        graphQLUrl: info.graphqlServer,
        connectUrl: addBasePath(connectUrl || ''),
        requestDefaults: {
          timeout: networkType === 'TESTNET' ? 300000 : 80000,
          baseURL: addBasePath(server || ''),
        },
        serviceUrl: server,
      },
      aelfReact: {
        appName: APP_NAME,
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: info?.rpcUrlAELF as unknown as string,
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: info?.rpcUrlTDVW as unknown as string,
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: info?.rpcUrlTDVV as unknown as string,
          },
        },
      },
      defaultRpcUrl:
        (info?.[`rpcUrl${String(info?.curChain).toUpperCase()}`] as unknown as string) ||
        info?.rpcUrlTDVW ||
        '',
      networkType: info?.networkType || 'TESTNET',
    });
    return webLogin.WebLoginProvider;
  },
  { ssr: false },
);

// eslint-disable-next-line import/no-anonymous-default-export
export default function webLoginProvider({ children }: { children: React.ReactNode }) {
  const info = store.getState().elfInfo.elfInfo;
  return (
    <PortkeyProviderDynamic networkTypeV2={info?.networkType}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          design: 'CryptoDesign',
          keyboard: {
            v2: true,
          },
          autoShowUnlock: false,
          checkAccountInfoSync: true,
        }}
        extraWallets={['discover', 'elf']}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
        }}
      >
        {children}
      </WebLoginProviderDynamic>
    </PortkeyProviderDynamic>
  );
}
