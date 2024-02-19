import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import './index.css';
const items: MenuProps['items'] = [
  {
    label: 'Create a DAO',
    key: 'CreateDAO',
    // icon: <MailOutlined />,
  },
  {
    label: 'Resources',
    key: 'Resources',
    // icon: <AppstoreOutlined />,
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
    label: 'Community',
    key: 'Community',
    // icon: <SettingOutlined />,
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
