import { useState } from 'react';
import Assets from 'pageComponents/assets';
import FootTabBar from '../FootTabBar';
import MyPoints from '../MyPoints';
import VoteList from '../VoteList';

export default function Main() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      {activeTab === 0 && <VoteList />}
      {activeTab === 1 && <MyPoints />}
      {activeTab === 2 && (
        <Assets
          redirect={false}
          onBack={() => {
            setActiveTab(0);
          }}
        />
      )}
      <FootTabBar
        value={activeTab}
        onChange={(value: number) => {
          setActiveTab(value);
        }}
      />
    </div>
  );
}
