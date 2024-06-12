import { useEffect } from 'react';
import { eventBus, HeaderUpdate } from 'utils/myEvent';

const useUpdateHeaderDaoInfo = (daoId: string) => {
  useEffect(() => {
    eventBus.emit(HeaderUpdate, daoId);
  }, [daoId]);
};

export default useUpdateHeaderDaoInfo;
