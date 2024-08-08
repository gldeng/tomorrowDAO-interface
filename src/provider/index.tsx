'use client';
import { AELFDProvider } from 'aelf-design';
import { PREFIXCLS, THEME_CONFIG, CUSTOM_TOKEN } from 'utils/AntdThemeConfig';
import { ConfigProvider } from 'antd';
import StoreProvider from './store';
import WebLoginProvider from './webLoginProvider';
import en_US from 'antd/lib/locale/en_US';
import { useUrlPath } from 'hooks/useUrlPath';

interface IProps {
  children: React.ReactNode;
}
function Provider(props: IProps) {
  const { children } = props;
  return (
    <StoreProvider>
      <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG} customToken={CUSTOM_TOKEN}>
        <ConfigProvider locale={en_US} prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
          <WebLoginProvider>{children}</WebLoginProvider>
        </ConfigProvider>
      </AELFDProvider>
    </StoreProvider>
  );
}

export default Provider;
