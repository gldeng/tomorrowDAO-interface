import BigNumber from 'bignumber.js';
import { IStackItem, ITabSource, UserTaskDetail } from '../../type';
import { CheckOutlined, WalletOutlined } from '@aelf-design/icons';
import { TelegramIcon, UserAddIcon, XIcon, DiscardIcon, LoadingIcon } from 'components/Icons';
import { useState } from 'react';
import { completeTaskItem } from 'api/request';
import { curChain } from 'config';

interface ITaskItemProps {
  taskItem: IUserTaskItemDetail;
  activeTabItem: (item: IStackItem) => void;
  userTask: number;
  getTaskListFn: () => void;
}
const openNewPageWaitPageVisible = async (url: string) => {
  if (url.includes('https://t.me')) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    window.Telegram.WebApp.openLink(url);
  }
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setTimeout(() => {
          resolve();
        }, 2000);
      } else {
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            resolve();
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
      }
    }, 200);
  });
};
const taskItemMap: Record<string, { icon: React.ReactNode; title: string; event?: Function }> = {
  [UserTaskDetail.DailyVote]: {
    icon: <TelegramIcon />,
    title: 'Complete a vote',
  },
  [UserTaskDetail.DailyFirstInvite]: {
    icon: <UserAddIcon />,
    title: 'Invite 1 friend',
  },
  [UserTaskDetail.DailyViewAsset]: {
    icon: <WalletOutlined />,
    title: 'View your assets',
  },
  [UserTaskDetail.ExploreJoinTgChannel]: {
    icon: <TelegramIcon />,
    title: 'Join channel',
  },
  [UserTaskDetail.ExploreFollowX]: {
    icon: <XIcon />,
    title: 'Follow us on X',
  },
  [UserTaskDetail.ExploreJoinDiscord]: {
    icon: <DiscardIcon />,
    title: 'Join Discord',
  },
  [UserTaskDetail.ExploreCumulateFiveInvite]: {
    icon: <UserAddIcon />,
    title: 'Invite 5 friends',
  },
  [UserTaskDetail.ExploreCumulateTenInvite]: {
    icon: <UserAddIcon />,
    title: 'Invite 10 friends',
  },
  [UserTaskDetail.ExploreCumulateTwentyInvite]: {
    icon: <UserAddIcon />,
    title: 'Invite 20 friends',
  },
};
const jumpExternalList = [
  {
    taskId: UserTaskDetail.ExploreJoinTgChannel,
    url: 'https://t.me/tmrwdao',
  },
  {
    taskId: UserTaskDetail.ExploreFollowX,
    url: 'https://x.com/tmrwdao',
  },
  {
    taskId: UserTaskDetail.ExploreJoinDiscord,
    url: 'https://discord.com/invite/gTWkeR5pQB',
  },
];
export const TaskItem = (props: ITaskItemProps) => {
  const { taskItem, activeTabItem, userTask, getTaskListFn } = props;
  const [isLoading, setIsLoading] = useState(false);
  const activeTabWithSource = (target: number) => {
    activeTabItem({ path: target, source: ITabSource.Task });
  };
  const jumpAndRefresh = async (taskId: UserTaskDetail) => {
    setIsLoading(true);
    try {
      const jumpItem = jumpExternalList.find((item) => item.taskId === taskItem.userTaskDetail);
      if (jumpItem) {
        await openNewPageWaitPageVisible(jumpItem.url);
        const reportCompleteRes = await completeTaskItem({
          chainId: curChain,
          userTask: userTask,
          userTaskDetail: taskId,
        });
      }
      getTaskListFn();
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };
  const handleClick = async () => {
    if (isLoading || taskItem.complete) return;
    switch (taskItem.userTaskDetail) {
      case UserTaskDetail.DailyVote:
        activeTabWithSource(ITabSource.Vote);
        break;
      case UserTaskDetail.DailyFirstInvite:
        activeTabWithSource(ITabSource.Referral);
        break;
      case UserTaskDetail.DailyViewAsset:
        activeTabWithSource(ITabSource.Asset);
        break;
      case UserTaskDetail.ExploreJoinTgChannel:
      case UserTaskDetail.ExploreFollowX:
      case UserTaskDetail.ExploreJoinDiscord:
        await jumpAndRefresh(taskItem.userTaskDetail);
        break;
      case UserTaskDetail.ExploreCumulateFiveInvite:
      case UserTaskDetail.ExploreCumulateTenInvite:
      case UserTaskDetail.ExploreCumulateTwentyInvite:
        activeTabWithSource(ITabSource.Referral);
        break;
      default:
        break;
    }
  };
  return (
    <div className={`task-item ${taskItem.complete ? 'complete' : ''}`}>
      <div className="icon-wrap">{taskItemMap[taskItem.userTaskDetail]?.icon}</div>
      <div className="task-desc">
        <h3 className="task-desc-title font-17-22">
          {taskItemMap[taskItem.userTaskDetail]?.title}
        </h3>
        <p className="task-desc-points font-14-18-weight">
          +{BigNumber(taskItem.points).toFormat()}
        </p>
      </div>
      <div
        className={`task-button flex-center ${taskItem.complete ? 'complete' : ''}`}
        onClick={handleClick}
      >
        {isLoading ? (
          <LoadingIcon className="animate-spin" />
        ) : taskItem.complete ? (
          <CheckOutlined />
        ) : (
          <span className="text font-14-18-weight font-bold">Start</span>
        )}
      </div>
    </div>
  );
};
