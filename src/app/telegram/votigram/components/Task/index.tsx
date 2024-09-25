import React, { useEffect, useRef } from 'react';
import { flatten } from 'lodash-es';
import './index.css';
import { useRequest, usePrevious } from 'ahooks';
import { getTaskList } from 'api/request';
import { curChain } from 'config';
import Loading from '../Loading';
import { taskTitle } from '../../const';
import { IStackItem, UserTaskDetail } from '../../type';
import { TelegramIcon, UserAddIcon, XIcon, DiscardIcon } from 'components/Icons';
import { WalletOutlined } from '@aelf-design/icons';
import BigNumber from 'bignumber.js';
import { TaskItem } from './TaskItem';
import { useWebLogin } from 'aelf-web-login';
import CommonModal, { ICommonModalRef } from '../CommonModal';
import { Button } from 'antd';

interface ITaskProps {
  style?: React.CSSProperties;
  className?: string;
  show: boolean;
  activeTabItem: (item: IStackItem) => void;
}
const Task: React.FC<ITaskProps> = (props: ITaskProps) => {
  const { style, className, show, activeTabItem } = props;
  const { wallet } = useWebLogin();
  const completeTaskModalRef = useRef<ICommonModalRef>(null);
  const {
    data: taskList,
    error: taskListError,
    loading: taskListLoading,
    run: getTaskListFn,
    runAsync: getTaskListAsync,
  } = useRequest(
    async () => {
      const res = await getTaskList({ chainId: curChain });
      return res;
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (!show) return;
    getTaskListFn();
  }, [show]);
  useEffect(() => {
    const listsGroup = taskList?.data?.taskList?.map((group) => group.data);
    const lists = flatten(listsGroup);
    const completed = [
      UserTaskDetail.DailyVote,
      UserTaskDetail.ExploreFollowX,
      UserTaskDetail.ExploreJoinDiscord,
      UserTaskDetail.ExploreJoinTgChannel,
    ].every((item) => {
      const task = lists.find((list) => list.userTaskDetail === item);
      return task?.complete;
    });
    const key = `${wallet.address}-${curChain}-task-complate`;
    if (completed && !localStorage.getItem(key)) {
      localStorage.setItem(key, 'true');
      completeTaskModalRef.current?.open();
    }
  }, [taskList, wallet.address]);
  return (
    <div className={`votigram-task-wrap ${className}`} style={style}>
      <h2 className="title font-20-25-weight mt-[24px] mb-[8px] flex-center">
        <img src="/images/tg/celebratory-fireworks-icon.png" alt="" />
        Complete tasks to earn points
      </h2>
      <div className="flex-center">
        <img src="/images/tg/complete-task.png" alt="" className="task-complete-icon" />
      </div>
      {taskListLoading ? (
        <div className="votigram-loading-wrap">
          <Loading />
        </div>
      ) : (
        <div>
          {taskList?.data?.taskList?.map((taskGroup, index) => {
            return (
              <div className="task-group-item" key={'group' + index}>
                <h2 className="font-18-22-weight text-white flex items-center">
                  <img
                    src={taskTitle[taskGroup.userTask].icon}
                    alt=""
                    width={16}
                    className="mr-[4px]"
                  />
                  {taskTitle[taskGroup.userTask].title}
                </h2>
                {taskGroup?.data?.map((taskItem, i) => {
                  return (
                    <TaskItem
                      key={'item' + i}
                      taskItem={taskItem}
                      activeTabItem={activeTabItem}
                      userTask={taskGroup.userTask}
                      getTaskListFn={getTaskListFn}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      <CommonModal
        ref={completeTaskModalRef}
        title="Congratulations!"
        content={
          <div className="complete-task-modal-content">
            <img
              src={'/images/tg/celebratory-fireworks-icon.png'}
              alt=""
              width={96}
              height={96}
              className="rounded-[16px] mt-[24px]"
            />
            <p className="my-[24px]">
              You have completed a specific task and now have a chance to participate in the raffle!
            </p>
            <div className="mt-[16px] w-full">
              <Button
                onClick={() => {
                  completeTaskModalRef.current?.close();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Task;
