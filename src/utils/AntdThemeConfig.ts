import { ThemeConfig } from 'antd';
import { IAelfdCustomToken } from 'aelf-design/dist/es/provider';
export const PREFIXCLS = 'TMRWDAO';

export const THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: '#764DF1',
    colorPrimaryHover: '#7F58F5',
    colorPrimaryActive: '#6F45EF',
    colorBorder: '#E1E1E1',
    colorPrimaryBorder: '#EDEDED',
    controlHeight: 48,
  },
  components: {
    Form: {
      labelColor: '#434343',
      labelFontSize: 16,
      itemMarginBottom: 32,
    },
    Steps: {
      iconSize: 40,
      controlHeight: 40,
    },
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
