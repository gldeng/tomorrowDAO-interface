import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';
import Layout from 'pageComponents/layout';
import Provider from 'provider/';
import Script from 'next/script';
import StyleRegistry from './StyleRegistry';

export const metadata = {
  title: 'TMRW DAO',
  description: 'TMRW DAO',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
          name="viewport"
        />
        {/* <link rel="shortcut icon" href="/aelfinscription/favicon.ico" /> */}
        {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-J0D8TQCBTF" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-J0D8TQCBTF');
        `}
        </Script> */}
      </head>
      <body>
        <StyleRegistry>
          <Provider>
            <Layout>{children}</Layout>
          </Provider>
        </StyleRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
