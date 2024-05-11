'use client';

import { usePathname } from 'next/navigation';
import 'aelf-web-login/dist/assets/index.css';
import 'styles/global.css';
import 'aelf-design/css';
import Layout from 'pageComponents/layout';
import NetworkDaoLayout from 'pageComponents/network-dao/layout';

import Provider from 'provider/';
import Script from 'next/script';
import StyleRegistry from './StyleRegistry';
import { NetworkDaoHomePathName } from 'config';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isNetWorkDao = pathname.startsWith(NetworkDaoHomePathName);
  return (
    <html lang="en">
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
      </head>
      <body>
        <StyleRegistry>
          <Provider>
            {isNetWorkDao ? (
              <NetworkDaoLayout>{children}</NetworkDaoLayout>
            ) : (
              <Layout>{children}</Layout>
            )}
          </Provider>
        </StyleRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
