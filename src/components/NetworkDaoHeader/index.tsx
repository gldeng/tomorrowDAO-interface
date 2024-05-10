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
// import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isLG } = useResponsive();

  const formatUrl = (pathname: string) => {
    const url = `${pathname}${window.location.search}`;
    return url;
  };

  const pathname = usePathname();

  const items: MenuProps['items'] = useMemo(() => {
    return [
      // {
      //   label: <Link href={formatUrl('/network-dao')}>Home</Link>,
      //   key: 'Home',
      // },
      {
        label: <Link href={formatUrl('/network-dao/transparent')}>Transparent</Link>,
        key: 'transparent',
      },
      {
        label: (
          <div className="menu-label">
            <span className="menu-label-text">Governance</span>
            {!isLG && <MenuArrow className="transition-all duration-200" />}
          </div>
        ),
        popupClassName: 'pc-menu-popup',
        key: 'Governance',
        children: [
          {
            label: <Link href={formatUrl(`/network-dao/proposal-list`)}>Governance Proposals</Link>,
            key: 'Governance Proposals',
          },
          {
            label: (
              <Link href={formatUrl('/network-dao/organization')}>Governance Organization</Link>
            ),
            key: 'Governance Organization',
          },
          {
            label: <Link href={formatUrl('/network-dao/vote')}>Governance BP Election</Link>,
            key: 'Governance BP Election',
          },
          {
            label: (
              <Link href={formatUrl('/network-dao/apply')}>Governance Contract Management</Link>
            ),
            key: 'Governance Contract Management',
          },
          {
            label: (
              <Link href={formatUrl('/network-dao/resource')}>Governance Resources Trade</Link>
            ),
            key: 'Governance Resources Trade',
          },
          {
            label: <Link href={formatUrl('/network-dao/resource')}>1 </Link>,
            key: 'Governance Resources Trade',
          },
        ],
      },
    ];
  }, [isLG]);

  const [current, setCurrent] = useState('CreateDAO');

  const onClick: MenuProps['onClick'] = (e) => {
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
