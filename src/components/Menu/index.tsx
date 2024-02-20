import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { ReactComponent as MenuArrow } from 'assets/imgs/menu-arrow.svg';
import './index.css';
const items: MenuProps['items'] = [
  {
    label: 'Create a DAO',
    key: 'CreateDAO',
  },
  {
    label: (
      <div className="menu-label">
        <span className="menu-label-text">Resources</span>
        <MenuArrow />
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
        <MenuArrow />
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

function PCMenu() {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      className="custom-menu"
      mode="horizontal"
      items={items}
      style={{ minWidth: 0, flex: 'auto' }}
    />
  );
}

export { PCMenu };
