import { Breadcrumb } from 'antd';
import { memo } from 'react';

export interface INavItemProps {
  title?: string;
  href?: string;
}
const NavForPC = ({ items }: { items: INavItemProps[] }) => {
  return (
    <Breadcrumb separator=">" items={items} className="py-6 max-w-[898px] w-[898px] mx-auto " />
  );
};

export default memo(NavForPC);
