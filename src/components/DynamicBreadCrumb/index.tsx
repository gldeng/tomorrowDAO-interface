'use client';
import Breadcrumb from 'components/Breadcrumb';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { INavItemProps } from 'components/Breadcrumb';

const DynamicBreadCrumb = () => {
  const pathname = usePathname();

  const items: INavItemProps[] = useMemo(() => {
    if (pathname === '/') {
      return [];
    }
    const pathArr = pathname.split('/');
    const arr: INavItemProps[] = [];
    pathArr.forEach((path, index) => {
      if (index === 0) {
        arr.push({
          title: 'TMRW DAO',
          href: '/',
        });
      } else {
        arr.push({
          title: path,
          href: `/${path}`,
        });
      }
    });
    delete arr[pathArr.length - 1].href;
    return arr;
  }, [pathname]);

  return <Breadcrumb items={items} />;
};

export default DynamicBreadCrumb;
