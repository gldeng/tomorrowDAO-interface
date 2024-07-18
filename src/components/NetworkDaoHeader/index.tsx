'use client';
import { HeaderLogo } from 'components/Logo';
import './index.css';
import { PCMenu } from 'components/Menu';
import { Select, SelectProps } from 'antd';
import qs from 'query-string';
import Link from 'next/link';
import useResponsive from 'hooks/useResponsive';
import { MobileMenu } from 'components/Menu';
import { ReactComponent as MenuArrow } from 'assets/imgs/menu-arrow.svg';
import { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { chainIdSelect } from 'config';
import dynamicReq from 'next/dynamic';
import LinkNetworkDao from 'components/LinkNetworkDao';
import { useChainSelect } from 'hooks/useChainSelect';
export enum ENetworkDaoNav {
  treasury = 'treasury',
}
const DynamicLogin = dynamicReq(() => import('components/Login'), {
  ssr: false,
});
export default function Header() {
  const [selectedChain, setSelectedChain] = useState('');
  const { isLG } = useResponsive();

  const pathname = usePathname();
  const { isMainChain } = useChainSelect();

  const items: MenuProps['items'] = useMemo(() => {
    return [
      isMainChain
        ? {
            label: <LinkNetworkDao href={`/treasury`}>Treasury</LinkNetworkDao>,
            key: ENetworkDaoNav.treasury,
          }
        : null,
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
            label: <LinkNetworkDao href={`/`}>Proposals</LinkNetworkDao>,
            key: 'Proposals',
          },
          {
            label: <LinkNetworkDao href={`/organization`}>Organisations</LinkNetworkDao>,
            key: 'Organisations',
          },
          isMainChain
            ? {
                label: <LinkNetworkDao href={`/vote/election`}>BP Elections</LinkNetworkDao>,
                key: 'BP Elections',
              }
            : null,
          {
            label: <LinkNetworkDao href={`/apply`}>Contract Management</LinkNetworkDao>,
            key: 'Contract Management',
          },
          isMainChain
            ? {
                label: <LinkNetworkDao href={`/resource`}>Resource Token Trade</LinkNetworkDao>,
                key: 'Resource Token Trade',
              }
            : null,
          {
            label: <LinkNetworkDao href={`/my-proposals`}>My Proposals</LinkNetworkDao>,
            key: 'My Proposals',
          },
        ],
      },
    ];
  }, [isLG, isMainChain]);

  const [current, setCurrent] = useState('CreateDAO');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  useEffect(() => {
    if (pathname.includes('/treasury')) {
      setCurrent(ENetworkDaoNav.treasury);
    }
  }, [pathname]);
  useEffect(() => {
    const searchParams = qs.parse(window.location.search);
    const chainId = (searchParams.chainId ?? 'AELF') as string;
    setSelectedChain(chainId);
  }, []);
  const handleChange: SelectProps['onChange'] = (obj) => {
    console.log('obj', obj);
    const url = new URL(window.location.protocol + window.location.host + `/network-dao`);
    url.searchParams.set('chainId', obj);
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };

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
          <div className="flex items-center">
            <div className="chain-id-select-wrap">
              <Select
                value={selectedChain}
                onChange={handleChange}
                options={chainIdSelect.map((item) => {
                  return {
                    ...item,
                    label: isLG ? item.label?.split(' ')?.[0] ?? item.label : item.label,
                  };
                })}
                className="chain-id-select"
              />
            </div>
            <DynamicLogin isNetWorkDao={true} />
          </div>
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
