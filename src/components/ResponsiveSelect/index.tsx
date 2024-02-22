import React, { useState } from 'react';
import { Select, Drawer, SelectProps, DrawerProps } from 'antd';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as CloseIcon } from 'assets/imgs/close.svg';
import cls from 'clsx';
import './index.css';

interface ResponsiveSelectProps extends SelectProps {
  drawerProps?: DrawerProps;
}
export const ResponsiveSelect = (props: ResponsiveSelectProps) => {
  const { value, onChange, options, drawerProps } = props;
  const { title, ...resetDrawerProps } = drawerProps ?? {};
  const [open, setOpen] = useState(false);
  // width <= 1024;
  const { isLG } = useResponsive();
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleSelectClick = () => {
    if (isLG) {
      setDrawerVisible(true);
    }
  };

  return (
    <>
      <Drawer
        title={null}
        placement="bottom"
        maskClosable={true}
        onClose={handleDrawerClose}
        open={drawerVisible}
        closeIcon={null}
        height={'80vh'}
        {...resetDrawerProps}
      >
        <div className="flex items-center relative justify-center">
          <h2 className="font-medium text-neutralTitle text-[20px] leading-[28px]">{title}</h2>
          <CloseIcon onClick={handleDrawerClose} className="title-close" />
        </div>
        {options?.map((option) => (
          <div
            onClick={() => {
              onChange?.(option.value, option);
              handleDrawerClose();
              setOpen(false);
            }}
            key={option.value}
            className={cls('drawer-menu-item', { 'item-selected': value === option.value })}
          >
            {option.label}
          </div>
        ))}
      </Drawer>
      <Select
        {...props}
        open={isLG ? false : open}
        onDropdownVisibleChange={(visible) => setOpen(visible)}
        onClick={handleSelectClick}
      >
        {props.children}
      </Select>
    </>
  );
};
