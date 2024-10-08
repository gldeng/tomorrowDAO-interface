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
      children: <InfiniteList category={ETelegramAppCategory.Game} />,
    },
    {
      key: ETelegramAppCategory.Earn,
      label: 'Earn',
      children: <InfiniteList category={ETelegramAppCategory.Earn} />,
    },
    {
      key: ETelegramAppCategory.Finance,
      label: 'Finance',
      children: <InfiniteList category={ETelegramAppCategory.Finance} />,
    },
    {
      key: ETelegramAppCategory.Social,
      label: 'Social',
      children: <InfiniteList category={ETelegramAppCategory.Social} />,
    },
    {
      key: ETelegramAppCategory.Utility,
      label: 'Utility',
      children: <InfiniteList category={ETelegramAppCategory.Utility} />,
    },
    {
      key: ETelegramAppCategory.Information,
      label: 'Information',
      children: <InfiniteList category={ETelegramAppCategory.Information} />,
    },
    {
      key: ETelegramAppCategory.Ecommerce,
      label: 'E-commerce',
      children: <InfiniteList category={ETelegramAppCategory.Ecommerce} />,
    },
  ];
  return (
    <div className="discover-page-wrap">
      <Tabs
        rootClassName="discover-page-tab"
        defaultActiveKey={ETelegramAppCategory.Recommend}
        items={items}
        tabBarExtraContent={null}
      />
    </div>
  );
}
