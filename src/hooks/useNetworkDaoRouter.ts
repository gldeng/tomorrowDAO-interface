import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { NetworkDaoHomePathName } from 'config';

export default function useNetworkDaoRouter() {
  const router = useRouter();
  const { networkDaoId } = useParams<{ networkDaoId: string }>();
  const push = useCallback(
    (path: string) => {
      router.push(`${NetworkDaoHomePathName}/${networkDaoId}${path}`);
    },
    [networkDaoId, router],
  );
  return {
    push,
  };
}
