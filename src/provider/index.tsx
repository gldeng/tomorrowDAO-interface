'use client';
import StoreProvider from './store';
import enUS from 'antd/lib/locale/en_US';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useState } from 'react';
import { store } from 'redux/store';
import { AELFDProvider } from 'aelf-design';
import { PREFIXCLS, THEME_CONFIG } from 'utils/AntdThemeConfig';
import { ConfigProvider } from 'antd';

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
      <ConfigProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        {children}
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default Provider;
