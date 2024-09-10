import { useState } from 'react';
import Assets from 'pageComponents/assets';
import FootTabBar from '../FootTabBar';
import MyPoints from '../MyPoints';
import VoteList from '../VoteList';
import Footer from '../Footer';
import Referral from '../Referral';

export interface IMainProps {
  onShowMore?: (item: IRankingListResItem) => void;
}
export default function Main(props: IMainProps) {
  const { onShowMore } = props;
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="relative z-[1]">
      {activeTab === 0 && <VoteList onShowMore={onShowMore} />}
      {activeTab === 1 && <MyPoints />}
      {activeTab === 2 && <Referral />}
      {activeTab === 3 && (
        <Assets
          redirect={false}
          onBack={() => {
            setActiveTab(0);
          }}
        />
      )}
      {activeTab !== 3 && (
        <FootTabBar
          value={activeTab}
          onChange={(value: number) => {
            setActiveTab(value);
          }}
        />
      )}
      <Footer classname="telegram-votigram-footer-main" />
    </div>
  );
}
