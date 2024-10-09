import { Button, Tabs, TabsProps, Checkbox, CheckboxOptionType } from 'antd';
import { ETelegramAppCategory } from '../../type';
import './index.css';
import InfiniteList from './InfiniteList';
import { useAsyncEffect } from 'ahooks';
import { discoverConfirmChoose, getDiscoverAppView } from 'api/request';
import { curChain } from 'config';
import { useRef, useState } from 'react';
import CommonDrawer, { ICommonDrawerRef } from '../../components/CommonDrawer';
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
const options: {
  value: string;
  label: string;
}[] = [
  {
    value: ETelegramAppCategory.Game,
    label: 'Game',
  },
  {
    value: ETelegramAppCategory.Earn,
    label: 'Earn',
  },
  {
    value: ETelegramAppCategory.Finance,
    label: 'Finance',
  },
  {
    value: ETelegramAppCategory.Social,
    label: 'Social',
  },
  {
    value: ETelegramAppCategory.Utility,
    label: 'Utility',
  },
  {
    value: ETelegramAppCategory.Information,
    label: 'Information',
  },
  {
    value: ETelegramAppCategory.Ecommerce,
    label: 'E-commerce',
  },
];
export default function Discover() {
  const chooseDrawerRef = useRef<ICommonDrawerRef>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const handleConfirmLike = () => {
    discoverConfirmChoose({
      chainId: curChain,
      choices: selectedCategory,
    });
  };
  const onSelectChange = (checkedValues: string[]) => {
    setSelectedCategory(checkedValues);
  };
  useAsyncEffect(async () => {
    const viewRes = await getDiscoverAppView({
      chainId: curChain,
    });
    if (!viewRes.data.discoverViewd) {
      chooseDrawerRef.current?.open();
    }
    chooseDrawerRef.current?.open();
  }, []);
  const handleTabClick: (activeKey: string, e: any) => void = (key, event) => {
    // const min = 0;
    // const wrap = wrapRef.current?.querySelector('.TMRWDAO-tabs-nav-wrap');
    // const scrollWrap = wrapRef.current?.querySelector('.TMRWDAO-tabs-nav-list') as HTMLElement;
    // if (!wrap || !scrollWrap) return;
    // const wrapWidth = wrap.getBoundingClientRect().width;
    // const listWidth = scrollWrap.getBoundingClientRect().width;
    // const deltx = wrapWidth - listWidth;
    // const paddingLeft = 16;
  };

  return (
    <div className="discover-page-wrap" ref={wrapRef}>
      <Tabs
        rootClassName="discover-page-tab"
        defaultActiveKey={ETelegramAppCategory.Recommend}
        items={items}
        tabBarExtraContent={null}
        onTabClick={handleTabClick}
      />
      <CommonDrawer
        title="Choose your favourite category"
        ref={chooseDrawerRef}
        showCloseTarget={false}
        showLeftArrow={false}
        bodyClassname="discover-app-select-drawer"
        rootClassName="discover-app-select-drawer-root"
        drawerProps={{
          destroyOnClose: true,
        }}
        body={
          <div className="">
            <Checkbox.Group
              className="unset-check-box"
              options={options}
              value={selectedCategory}
              onChange={onSelectChange}
            />
            <Button
              type="primary"
              onClick={handleConfirmLike}
              disabled={selectedCategory.length === 0}
            >
              Confirm
            </Button>
            <div
              className="font-14-18-weight text-[#0395FF] mt-[16px] text-center"
              onClick={() => {
                chooseDrawerRef.current?.close();
              }}
            >
              Skip
            </div>
          </div>
        }
      />
    </div>
  );
}
