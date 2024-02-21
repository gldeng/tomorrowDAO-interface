'use client';
import React, { useState } from 'react';
import { Drawer, Menu } from 'antd';
import MenuButton from 'components/MenuButton';
import './index.css';
import { HeaderLogo } from 'components/Logo';
import { ReactComponent as CloseIcon } from 'assets/imgs/close.svg';
import type { MenuProps } from 'antd';

export interface IMobileMenuProps extends Omit<MenuProps, 'mode'> {
  className?: string;
}

function PCMenu(props: IMobileMenuProps) {
  return (
    <Menu
      className="custom-menu"
      mode="horizontal"
      style={{ minWidth: 0, flex: 'auto' }}
      {...props}
    />
  );
}

function MobileMenu(props: IMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="mobile-menu-container">
      <div onClick={showDrawer}>
        <MenuButton />
      </div>
      <Drawer
        width="100%"
        title={
          <div className="menu-header-container">
            <HeaderLogo />
            <CloseIcon className="cursor-pointer" width={16} height={16} onClick={onClose} />
          </div>
        }
        className="mobile-menu-drawer"
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <Menu mode="inline" className="mobile-custom-menu" {...props} />
      </Drawer>
    </div>
  );
}

export { PCMenu, MobileMenu };
