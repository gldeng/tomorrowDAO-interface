import { useAsyncEffect, useUnmount } from 'ahooks';
import { treasuryContractAddress } from 'config';
import { callViewContract } from 'contract/callContract';
import { eventBus, HeaderUpdateTreasury } from 'utils/myEvent';

const useUpdateHeaderDaoInfo = (daoId: string) => {
  useAsyncEffect(async () => {
    if (!daoId) return;
    const res = await callViewContract<string, string>(
      'GetTreasuryAccountAddress',
      daoId,
      treasuryContractAddress,
    );
    if (!res) return;
    console.log('useUpdateHeaderDaoInfo ', 1);
    eventBus.emit(HeaderUpdateTreasury, daoId);
  }, [daoId]);
  useUnmount(() => {
    console.log('useUpdateHeaderDaoInfo ', 2);
    eventBus.emit(HeaderUpdateTreasury, null);
  });
};

export default useUpdateHeaderDaoInfo;
