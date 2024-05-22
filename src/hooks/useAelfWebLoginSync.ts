import { useWebLogin } from 'aelf-web-login';
import { useCallback } from 'react';
import { message } from 'antd';

export default function useAelfWebLoginSync() {
  const { wallet } = useWebLogin();
  const isSyncQuery = useCallback(() => {
    if (!wallet.accountInfoSync.syncCompleted) {
      message.open({
        type: 'info',
        content: 'synchronizing information on the chain, please try again later.',
        duration: 6,
      });
      return false;
    }
    return true;
  }, [wallet]);
  return {
    isSyncQuery,
  };
}
