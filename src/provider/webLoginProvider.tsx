'use client';
import { NetworkType, TelegramPlatform } from '@portkey/did-ui-react';
import { NetworkDaoHomePathName, TELEGRAM_BOT_ID, aelfWebLoginNetworkType, curChain } from 'config';
import dynamicReq from 'next/dynamic';
import { PortkeyProvider, WebLoginProvider, setGlobalConfig } from 'aelf-web-login';

import { store } from 'redux/store';
import getChainIdQuery from 'utils/url';
import { usePathname } from 'next/navigation';

type TNodes = {
  AELF: { chainId: string; rpcUrl: string };
  tDVW: { chainId: string; rpcUrl: string };
  tDVV: { chainId: string; rpcUrl: string };
};

type TNodeKeys = keyof TNodes;
const APP_NAME = 'TMRWDAO';

function addBasePath(url: string) {
  if (String(url).startsWith('http')) {
    return url;
  }
  return `${url}`;
}
function moveKeyToFront(nodes: TNodes, key: TNodeKeys) {
  const reordered = {} as TNodes;
  if (nodes[key]) {
    reordered[key] = nodes[key];
  }
  Object.keys(nodes).forEach((k) => {
    const newKey = k as TNodeKeys;
    if (newKey !== key) {
      reordered[newKey] = nodes[newKey];
    }
  });
  return reordered;
}
// const WebLoginProviderDynamic = (props: WebLoginProviderProps) => {
//   const info = store.getState().elfInfo.elfInfo;

//   return <WebLoginProvider {...props} />;
// };

// eslint-disable-next-line import/no-anonymous-default-export
export default function LoginSDKProvider({ children }: { children: React.ReactNode }) {
  const info = store.getState().elfInfo.elfInfo;
  const server = info.portkeyServer;
  const connectUrl = info?.connectUrl;
  const networkType = (info.networkType || 'TESTNET') as NetworkType;

  const pathName = usePathname();
  const isNetWorkDao = pathName.startsWith(NetworkDaoHomePathName);

  const getChainId = () => {
    if (isNetWorkDao) {
      const chain = getChainIdQuery();
      return chain.chainId ?? 'AELF';
    }
    return curChain;
  };
  const chainId = getChainId();
  const getNodes = () => {
    const nodes = {
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
    };
    if (isNetWorkDao) {
      const chain = getChainIdQuery();
      const chainId = chain.chainId ?? 'AELF';
      if (chainId === 'tDVW') {
        return moveKeyToFront(nodes, 'tDVW');
      }
      if (chainId === 'tDVV') {
        return moveKeyToFront(nodes, 'tDVV');
      }
    }
    return nodes;
  };
  const nodes = getNodes();
  const referrerCode = TelegramPlatform.getInitData()?.start_param;
  console.log('referrerCode', referrerCode);
  setGlobalConfig({
    appName: APP_NAME,
    chainId: chainId,
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
      socialLogin: {
        Telegram: {
          botId: TELEGRAM_BOT_ID,
        },
      },
      referralInfo: {
        referralCode: referrerCode ?? '',
        projectCode: '13027',
      },
    },
    aelfReact: {
      appName: APP_NAME,
      nodes: nodes,
    },
    defaultRpcUrl:
      (info?.[`rpcUrl${String(info?.curChain).toUpperCase()}`] as unknown as string) ||
      info?.rpcUrlTDVW ||
      '',
    networkType: aelfWebLoginNetworkType,
  });
  return (
    <PortkeyProvider networkTypeV2={info?.networkType}>
      <div className="1">
        <WebLoginProvider
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
        </WebLoginProvider>
      </div>
    </PortkeyProvider>
  );
}
