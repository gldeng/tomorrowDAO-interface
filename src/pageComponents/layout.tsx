'use client';
import React, { useEffect, Suspense } from 'react';
import { Layout as AntdLayout } from 'antd';
import StoreProvider from '../provider/store';
import Header from 'components/Header';
import Loading from 'components/Loading';
import dynamicReq from 'next/dynamic';

import { store } from 'redux/store';
import Footer from 'components/Footer';
import DynamicBreadCrumb from 'components/DynamicBreadCrumb';
import { useWalletInit } from 'hooks/useWallet';
import PageLoading from 'components/Loading';

const Layout = dynamicReq(
  async () => {
    return (props: React.PropsWithChildren<{}>) => {
      const { children } = props;
      useWalletInit();
      return (
        <StoreProvider>
          <div className="flex w-[100vw] h-[100vh] flex-col relative box-border min-h-screen bg-global-grey">
            <Suspense>
              <Header />
            </Suspense>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <Suspense>
                <div className="flex-1 flex justify-center">
                  <div className="flex-1 max-w-[1440px] mx-auto py-6 mb-6 px-4 lg:px-10">
                    <DynamicBreadCrumb />
                    {children}
                  </div>
                </div>
              </Suspense>
              <Suspense>
                <Footer />
              </Suspense>
            </div>
            <PageLoading />
          </div>
        </StoreProvider>
      );
    };
  },
  { ssr: false },
);

export default Layout;
