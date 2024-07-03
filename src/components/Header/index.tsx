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
import { usePathname } from 'next/navigation';
import { eventBus, HeaderUpdateTreasury } from 'utils/myEvent';
export enum ENavKeys {
  CreateDAO = 'CreateDAO',
  Resources = 'Resources',
  Documentation = 'Documentation',
  GitHub = 'GitHub',
  WhitePaper = 'WhitePaper',
  SocialMedia = 'SocialMedia',
  Twitter = 'Twitter',
  Discord = 'Discord',
  Telegram = 'Telegram',
  Treasury = 'Treasury',
}
export default function Header() {
  const { isLG } = useResponsive();
  const pathname = usePathname();
  const [aliasName, setAliasName] = useState<string | null>(null);
  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        label: <Link href={'/create'}>Create a DAO</Link>,
        key: ENavKeys.CreateDAO,
      },
      {
        label: (
          <div className="menu-label">
            <span className="menu-label-text">Resources</span>
            {!isLG && <MenuArrow className="transition-all duration-200" />}
          </div>
        ),
        key: ENavKeys.Resources,
        popupClassName: 'pc-menu-popup',
        children: [
          // {
          //   label: 'Documentation',
          //   key: ENavKeys.Documentation,
          // },
          {
            label: (
              <Link href="https://github.com/TomorrowDAOProject" target="_blank">
                GitHub
              </Link>
            ),
            key: ENavKeys.GitHub,
          },
          // {
          //   label: 'White Paper',
          //   key: ENavKeys.WhitePaper,
          // },
        ],
      },
      {
        label: (
          <div className="menu-label">
            <span className="menu-label-text">Social Media</span>
            {!isLG && <MenuArrow className="transition-all duration-200" />}
          </div>
        ),
        popupClassName: 'pc-menu-popup',
        key: ENavKeys.SocialMedia,
        children: [
          {
            label: (
              <Link href="https://twitter.com/tmrwdao" target="_blank">
                Twitter
              </Link>
            ),
            key: ENavKeys.Twitter,
          },
          // {
          //   label: (
          //     <Link href="https://discord.com/invite/Y73pZaWy" target="_blank">
          //       Discord
          //     </Link>
          //   ),
          //   key: ENavKeys.Discord,
          // },
          {
            label: (
              <Link href="https://t.me/tmrwdao" target="_blank">
                Telegram
              </Link>
            ),
            key: ENavKeys.Telegram,
          },
        ],
      },
      aliasName
        ? {
            label: <Link href={`/dao/${aliasName}/treasury`}>Treasury</Link>,
            key: ENavKeys.Treasury,
          }
        : null,
    ];
  }, [aliasName, isLG]);
  useEffect(() => {
    const setDaoIdCallBack = (aliasName: string | null) => {
      setAliasName(aliasName);
    };
    eventBus.on(HeaderUpdateTreasury, setDaoIdCallBack);
    return () => {
      eventBus.off(HeaderUpdateTreasury, setDaoIdCallBack);
    };
  }, []);
  const [current, setCurrent] = useState('');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  useEffect(() => {
    // refresh from path map to nav active
    if (pathname === '/create') {
      setCurrent(ENavKeys.CreateDAO);
    } else if (pathname.includes('/treasury')) {
      setCurrent(ENavKeys.Treasury);
    } else {
      setCurrent('');
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
