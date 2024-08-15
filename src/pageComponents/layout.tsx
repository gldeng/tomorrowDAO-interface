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
  const isCreateProposal = pathName.includes('/proposal/create');
  const isExolore = pathName === '/explore';
  const { isLG } = useResponsive();
  const notHomeClass = isHome
    ? 'home-landing-page page-content-wrap'
    : `flex-1  mx-auto pt-4 lg:pt-6 lg:px-10 px-4 page-content-wrap mb-16 ${
        isCreateDao || isCreateProposal ? 'max-w-[978px]' : 'max-w-[1440px]'
      }`;
  return (
    <div className="flex w-[100vw] h-[100vh] flex-col relative box-border min-h-screen bg-global-grey">
      <Header />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className={isHome ? 'dao-home-background' : ''}>
          {isLG && isExolore && <DAOHeader />}
          <div className={notHomeClass}>
            <DynamicBreadCrumb />
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <PageLoading />
      <ResultModal />
    </div>
  );
};

export default Layout;
