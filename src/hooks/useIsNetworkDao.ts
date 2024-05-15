import { useParams, usePathname } from 'next/navigation';
import { NetworkDaoHomePathName } from 'config';

export default function useIsNetworkDao() {
  const pathName = usePathname();
  const { networkDaoId } = useParams();
  const isNetWorkDao = pathName.includes(NetworkDaoHomePathName);
  return {
    isNetWorkDao,
    networkDaoId: networkDaoId as unknown as string,
  };
}
