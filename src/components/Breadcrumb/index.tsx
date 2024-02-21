import { Breadcrumb } from 'antd';
import { memo } from 'react';

export interface INavItemProps {
  title?: string;
  href?: string;
}
const NavForPC = ({ items }: { items: INavItemProps[] }) => {
  return <Breadcrumb separator=">" items={items} className="py-6" />;
};

export default memo(NavForPC);
