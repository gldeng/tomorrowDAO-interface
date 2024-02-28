'use client';
import { HeaderLogo } from 'components/Logo';
import './index.css';
import Login from 'components/Login';
import { PCMenu } from 'components/Menu';
import Link from 'next/link';
import useResponsive from 'hooks/useResponsive';
import { MobileMenu } from 'components/Menu';
import { ReactComponent as MenuArrow } from 'assets/imgs/menu-arrow.svg';
import { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isLG } = useResponsive();
  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        label: 'Create a DAO',
        key: 'CreateDAO',
      },
      {
        label: (
          <div className="menu-label">
            <span className="menu-label-text">Resources</span>
            {!isLG && <MenuArrow />}
          </div>
        ),
        key: 'Resources',
        popupClassName: 'pc-menu-popup',
        children: [
          {
            label: 'Documentation',
            key: 'Documentation',
          },
          {
            label: 'GitHub',
            key: 'GitHub',
          },
          {
            label: 'White Paper',
            key: 'White Paper',
          },
        ],
      },
      {
        label: (
          <div className="menu-label">
            <span className="menu-label-text">Community</span>
            {!isLG && <MenuArrow />}
          </div>
        ),
        popupClassName: 'pc-menu-popup',
        key: 'Community',
        children: [
          {
            label: 'Documentation',
            key: 'Documentation1',
          },
          {
            label: 'GitHub',
            key: 'GitHub1',
          },
          {
            label: 'White Paper',
            key: 'White Paper1',
          },
        ],
      },
    ];
  }, [isLG]);
  const router = useRouter();

  const pathname = usePathname();

  const [current, setCurrent] = useState('CreateDAO');

  const onClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'CreateDAO':
        router.push('/guide');
        break;
    }
    setCurrent(e.key);
  };

  useEffect(() => {
    if (pathname === '/guide' || pathname === '/create') {
      setCurrent('CreateDAO');
    }
  }, [pathname]);

  return (
    <header className="header-container">
      <div className="header-banner">
        <div className="header-logo">
          <div className="header-menu">
            <Link href="/">
              <HeaderLogo />
            </Link>
            {!isLG && <PCMenu selectedKeys={[current]} items={items} onClick={onClick} />}
          </div>
          <Login />
        </div>
        {isLG && (
          <div className="header-menu-icon">
            <MobileMenu selectedKeys={[current]} items={items} onClick={onClick} />
          </div>
        )}
      </div>
    </header>
  );
}
