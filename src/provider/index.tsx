'use client';
import { AELFDProvider } from 'aelf-design';
import { PREFIXCLS, THEME_CONFIG } from 'utils/AntdThemeConfig';
import { ConfigProvider } from 'antd';
import StoreProvider from './store';
import WebLoginProvider from './webLoginProvider';
import en_US from 'antd/lib/locale/en_US';

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        <ConfigProvider locale={en_US} prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
          <WebLoginProvider key={'webLoginProvider'}> {children}</WebLoginProvider>
        </ConfigProvider>
      </AELFDProvider>
    </StoreProvider>
  );
}

export default Provider;
