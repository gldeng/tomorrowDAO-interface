'use client';
import React, { Suspense } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import DynamicBreadCrumb from 'components/DynamicBreadCrumb';
import PageLoading from 'components/Loading';
import { usePathname } from 'next/navigation';
import ResultModal from 'components/ResultModal';
import './layout.css';
import DAOHeader from './home/components/DAOHeader';
import useResponsive from 'hooks/useResponsive';

const Layout = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;
  const pathName = usePathname();
  const isHome = pathName === '/';
  const isCreateDao = pathName === '/create';
  const isExolore = pathName === '/explore';
  const { isLG } = useResponsive();
  return (
    <div className="flex w-[100vw] h-[100vh] flex-col relative box-border min-h-screen bg-global-grey">
      <Suspense>
        <Header />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Suspense>
          <div className={isHome ? 'dao-home-background' : ''}>
            {isLG && isExolore && <DAOHeader />}
            <div
              className={`flex-1  mx-auto py-4 lg:py-6 mb-6 px-4 lg:px-8 page-content-wrap ${
                isCreateDao ? 'max-w-[898px]' : 'max-w-[1440px]'
              }`}
            >
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
      <ResultModal />
    </div>
  );
};

export default Layout;
