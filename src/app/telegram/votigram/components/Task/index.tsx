import React, { useEffect } from 'react';
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

interface ITaskProps {
  style?: React.CSSProperties;
  className?: string;
  show: boolean;
  activeTabItem: (item: IStackItem) => void;
}
const Task: React.FC<ITaskProps> = (props: ITaskProps) => {
  const { style, className, show, activeTabItem } = props;
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
  return (
    <div className={`votigram-task-wrap ${className}`} style={style}>
      <h2 className="title font-28-32 my-[24px]">Complete tasks to earn points</h2>
      {taskListLoading ? (
        <div className="votigram-loading-wrap">
          <Loading />
        </div>
      ) : (
        <div>
          {taskList?.data?.taskList?.map((taskGroup, index) => {
            return (
              <div className="task-group-item" key={'group' + index}>
                <h2 className="font-18-22-weight text-white">{taskTitle[taskGroup.userTask]}</h2>
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
    </div>
  );
};

export default Task;
