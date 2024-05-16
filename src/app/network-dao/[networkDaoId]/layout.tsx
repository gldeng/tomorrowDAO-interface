'use client';
import React, { Suspense } from 'react';
import NetworkDaoHeader from 'components/NetworkDaoHeader';

import dynamicReq from 'next/dynamic';
import Footer from 'components/Footer';
import { useWalletInit } from 'hooks/useWallet';
import PageLoading from 'components/Loading';
import { usePathname } from 'next/navigation';
import { NetworkDaoHomePathName } from 'config';

const Layout = dynamicReq(
  async () => {
    return (props: React.PropsWithChildren<{}>) => {
      const { children } = props;

      useWalletInit();
      const pathName = usePathname();
      const isHomePage = pathName === NetworkDaoHomePathName;

      return (
        <div className="flex w-[100vw] h-[100vh] flex-col relative box-border min-h-screen bg-global-grey">
          <Suspense>
            <NetworkDaoHeader />
          </Suspense>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <Suspense>
              <div className="flex-1 flex justify-center">
                <div
                  className={`flex-1 max-w-[1440px] mx-auto bg-white ${
                    isHomePage ? '' : 'py-6 mb-6 px-4 lg:px-10'
                  }`}
                >
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
      );
    };
  },
  { ssr: false },
);

export default Layout;
