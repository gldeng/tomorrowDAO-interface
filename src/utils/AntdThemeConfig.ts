import { ThemeConfig } from 'antd';
import { IAelfdCustomToken } from 'aelf-design/dist/es/provider';
export const PREFIXCLS = 'TMRWDAO';

export const THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: '#764DF1',
    colorPrimaryHover: '#7F58F5',
    colorPrimaryActive: '#6F45EF',
    colorBorder: '#EDEDED',
    colorPrimaryBorder: '#EDEDED',
  },
};

export const CUSTOM_TOKEN_CONFIG: IAelfdCustomToken = {
  customAddress: {
    primaryLinkColor: '#434343',
    primaryIconColor: '#B8B8B8',
    addressHoverColor: '#7F58F5',
    addressActiveColor: '#6F45EF',
  },
};
