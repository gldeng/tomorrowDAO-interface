'use client';
import { useWalletInit } from 'hooks/useWallet';
import dynamicReq from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { NetworkDaoHomePathName } from 'config';
import { useUrlPath } from 'hooks/useUrlPath';
import Layout from 'pageComponents/layout';
const WalletInit = dynamicReq(
  async () => {
    return () => {
      useWalletInit();
      return <></>;
    };
  },
  { ssr: false },
);
export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isNetWorkDao = pathname.startsWith(NetworkDaoHomePathName);
  const { isHome } = useUrlPath();
  return (
    <>
      {!isHome && <WalletInit />}
      {isNetWorkDao ? <div>{children}</div> : <Layout>{children}</Layout>}
    </>
  );
};
