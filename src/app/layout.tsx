'use client';

import { usePathname } from 'next/navigation';
import 'aelf-web-login/dist/assets/index.css';
import 'styles/global.css';
import 'aelf-design/css';
import Layout from 'pageComponents/layout';
import Provider from 'provider/';
import Script from 'next/script';
import dynamicReq from 'next/dynamic';
import { useWalletInit } from 'hooks/useWallet';
import StyleRegistry from './StyleRegistry';
import { NetworkDaoHomePathName } from 'config';

const WalletInit = dynamicReq(
  async () => {
    return () => {
      useWalletInit();
      return <></>;
    };
  },
  { ssr: false },
);

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isNetWorkDao = pathname.startsWith(NetworkDaoHomePathName);
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
          name="viewport"
        />
        {/* <link rel="shortcut icon" href="/aelfinscription/favicon.ico" /> */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Z5LV4SE2RX"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-Z5LV4SE2RX');
          `}
        </Script>
        {/* <Script
          async
          src="https://unpkg.com/vconsole@3.15.1/dist/vconsole.min.js"
          onReady={() => {
            new VConsole();
          }}
        ></Script> */}
      </head>
      <body>
        <StyleRegistry>
          <Provider>
            <WalletInit />
            {isNetWorkDao ? <div>{children}</div> : <Layout>{children}</Layout>}
          </Provider>
        </StyleRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
