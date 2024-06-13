import { useEffect } from 'react';
import { eventBus, HeaderUpdateTreasury, UndoHeaderUpdateTreasury } from 'utils/myEvent';

const useUpdateHeaderDaoInfo = (daoId: string) => {
  useEffect(() => {
    if (!daoId) return;
    eventBus.emit(HeaderUpdateTreasury, daoId);
    return () => {
      eventBus.emit(UndoHeaderUpdateTreasury, null);
    };
  }, [daoId]);
};

export default useUpdateHeaderDaoInfo;
