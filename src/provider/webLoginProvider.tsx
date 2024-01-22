'use client';
import { WebLoginProvider, setGlobalConfig, PortkeyProvider } from 'aelf-web-login';
const APPNAME = 'AElf DApp';


setGlobalConfig({
  appName: APPNAME,
  chainId: 'chainId placeholder',
  networkType: 'networkType placeholder',
  portkey: {
  } ,
  aelfReact: {
    appName: APPNAME,
    nodes: {},
  },
  defaultRpcUrl: '',
});

export default function Providers({ children }) {
  return (
    <PortkeyProvider networkType={'networkType placeholder'}>
      <WebLoginProvider
        nightElf={{
          connectEagerly: false,
        }}
        portkey={{
          autoShowUnlock: true,
          checkAccountInfoSync: true,
        }}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: false,
          autoLogoutOnAccountMismatch: false,
          autoLogoutOnChainMismatch: false,
          onPluginNotFound: (openStore) => {

          },
        }}
        extraWallets={['discover']}>
          {children}
      </WebLoginProvider>
    </PortkeyProvider>
  );
}
