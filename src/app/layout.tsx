/* eslint-disable no-inline-styles/no-inline-styles */
'use client';

import { usePathname } from 'next/navigation';
import 'aelf-web-login/dist/assets/index.css';
import 'styles/global.css';
import 'styles/button.css';
import 'aelf-design/css';
import Layout from 'pageComponents/layout';
import Provider from 'provider/';
import Script from 'next/script';
import dynamicReq from 'next/dynamic';
import { useWalletInit } from 'hooks/useWallet';
import StyleRegistry from './StyleRegistry';
import { NetworkDaoHomePathName } from 'config';
import { useUrlPath } from 'hooks/useUrlPath';

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
  const { isHome } = useUrlPath();
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
          name="viewport"
        />
        <title>TMRWDAO: Revolutionise Decentralised Governance with AI</title>
        <meta
          name="description"
          content="Launch & Manage Your DAO with AI: TMRWDAO, the leading AI DAO platform, empowers communities with secure, transparent & efficient decentralised governance."
        />
        {/* Google Tag Manager  */}
        {/* eslint-disable-next-line @next/next/inline-script-id */}
        <Script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PSHXV7WX');
            `}
        </Script>
        {/* End Google Tag Manager */}
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PSHXV7WX"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          ></iframe>
        </noscript>
        <StyleRegistry>
          <Provider>
            {!isHome && <WalletInit />}
            {isNetWorkDao ? <div>{children}</div> : <Layout>{children}</Layout>}
          </Provider>
        </StyleRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
