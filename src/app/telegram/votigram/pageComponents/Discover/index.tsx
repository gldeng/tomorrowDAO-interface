import { Tabs, TabsProps } from 'antd';
import { ETelegramAppCategory } from '../../type';

import './index.css';
import InfiniteList from './InfiniteList';
export default function Discover() {
  const items: TabsProps['items'] = [
    {
      key: ETelegramAppCategory.Recommend,
      label: 'Recommend',
      children: <InfiniteList category={ETelegramAppCategory.Recommend} />,
    },
    {
      key: ETelegramAppCategory.Game,
      label: 'Game',
      children: 'Game',
    },
    {
      key: ETelegramAppCategory.Earn,
      label: 'Earn',
      children: 'Earn',
    },
    {
      key: ETelegramAppCategory.Finance,
      label: 'Finance',
      children: 'Finance',
    },
    {
      key: ETelegramAppCategory.Social,
      label: 'Social',
      children: 'Social',
    },
    {
      key: ETelegramAppCategory.Utility,
      label: 'Utility',
      children: 'Utility',
    },
    {
      key: ETelegramAppCategory.Information,
      label: 'Information',
      children: 'Information',
    },
    {
      key: ETelegramAppCategory.Ecommerce,
      label: 'E-commerce',
      children: 'E-commerce',
    },
  ];
  return (
    <div className="discover-page-wrap">
      <Tabs
        rootClassName="discover-page-tab"
        defaultActiveKey={ETelegramAppCategory.Recommend}
        items={items}
      />
    </div>
  );
}
