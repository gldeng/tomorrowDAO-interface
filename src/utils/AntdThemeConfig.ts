import { ThemeConfig } from 'antd';
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
      finishIconBorderColor: '#764DF1',
    },
    Slider: {
      handleSize: 8,
      handleSizeHover: 10,
      railSize: 8,
    },
  },
};
