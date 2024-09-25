import React, { useEffect } from 'react';
import MyAsset, { IMyAssetProps } from 'pageComponents/assets';
import { completeTaskItem } from 'api/request';
import { curChain } from 'config';
import { UserTask, UserTaskDetail } from '../../type';
export default function Assets(props: IMyAssetProps) {
  useEffect(() => {
    completeTaskItem({
      chainId: curChain,
      userTask: UserTask.Daily,
      userTaskDetail: UserTaskDetail.DailyViewAsset,
    });
  }, []);
  return <MyAsset {...props} />;
}
