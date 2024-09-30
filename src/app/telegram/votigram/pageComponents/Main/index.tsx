import { useState } from 'react';
import Assets from '../Assets';
import FootTabBar from '../../components/FootTabBar';
import Task from '../Task';
import VoteList from '../VoteList';
import Discover from '../Discover';
import Footer from '../../components/Footer';
import Referral from '../Referral';
import { IStackItem, ITabSource } from '../../type';

export interface IMainProps {
  onShowMore?: (item: IRankingListResItem) => void;
}

export default function Main(props: IMainProps) {
  const { onShowMore } = props;
  const [activeTabStack, setActiveTabStack] = useState<IStackItem[]>([
    { path: ITabSource.Discover },
  ]);
  const activeTab = activeTabStack[activeTabStack.length - 1];
  const pushStackByValue = (value: number) => {
    setActiveTabStack([...activeTabStack, { path: value }]);
  };
  const activeTabItem = (item: IStackItem) => {
    setActiveTabStack([...activeTabStack, item]);
  };
  return (
    <div className="relative z-[1]">
      {activeTab.path === ITabSource.Discover && <Discover />}
      {activeTab.path === ITabSource.Vote && <VoteList onShowMore={onShowMore} />}
      <Task
        style={{
          display: activeTab.path === ITabSource.Task ? 'block' : 'none',
        }}
        show={activeTab.path === ITabSource.Task}
        activeTabItem={activeTabItem}
      />
      {activeTab.path === ITabSource.Referral && <Referral />}
      {activeTab.path === ITabSource.Asset && (
        <Assets
          redirect={false}
          onBack={() => {
            const lastItem = activeTabStack[activeTabStack.length - 2];
            if (lastItem) {
              pushStackByValue(lastItem.path);
            } else {
              pushStackByValue(0);
            }
          }}
        />
      )}
      {activeTab.path !== ITabSource.Asset && (
        <FootTabBar
          value={activeTab.path}
          onChange={(value: number) => {
            pushStackByValue(value);
          }}
        />
      )}
      {/* {activeTab.path !== ITabSource.Discover && ( */}
      <Footer classname="telegram-votigram-footer-main" />
      {/* // )} */}
    </div>
  );
}
