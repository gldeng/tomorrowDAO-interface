'use client';
import { AELFDProvider } from 'aelf-design';
import { PREFIXCLS, THEME_CONFIG, CUSTOM_TOKEN_CONFIG } from 'utils/AntdThemeConfig';
import { ConfigProvider } from 'antd';

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG} customToken={CUSTOM_TOKEN_CONFIG}>
      <ConfigProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        {children}
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default Provider;
