'use client';
import { AELFDProvider } from 'aelf-design';
import { PREFIXCLS, THEME_CONFIG, CUSTOM_TOKEN } from 'utils/AntdThemeConfig';
import { ConfigProvider } from 'antd';

import WebLoginProvider from './webLoginProvider';
import en_US from 'antd/lib/locale/en_US';

interface IProps {
  children: React.ReactNode;
}
function Provider(props: IProps) {
  const { children } = props;
  return (
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG} customToken={CUSTOM_TOKEN}>
      <ConfigProvider locale={en_US} prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        <WebLoginProvider key={'webLoginProvider'}> {children}</WebLoginProvider>
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default Provider;
