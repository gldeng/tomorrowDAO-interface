'use client';
import React, { useEffect, Suspense } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import Loading from 'components/Loading';
import dynamic from 'next/dynamic';
import 'styles/global.css';

import { store } from 'redux/store';
import Footer from 'components/Footer';
import DynamicBreadCrumb from 'components/DynamicBreadCrumb';

const Layout = dynamic(async () => {
  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;

    return (
      <html lang="en">
        <body>
          <div className="relative box-border min-h-screen bg-global-grey flex flex-col h-full">
            <Suspense>
              <Header />
            </Suspense>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <DynamicBreadCrumb />
              <Suspense>
                <div className="flex-1">{children}</div>
              </Suspense>
              <Suspense>
                <Footer />
              </Suspense>
            </div>
          </div>
        </body>
      </html>
    );
  };
});

export default Layout;
