/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neutralTitle: '#1A1A1A',
        neutralPrimaryText: '#434343',
        baseBorder: '#EDEDED',
        colorPrimary: '#764DF1',
        colorPrimaryHover: '#7F58F5',
        colorPrimaryActive: '#6F45EF',
        approve: '#3888FF',
        rejection: '#F55D6E',
        abstention: '#687083',
        'Neutral-Secondary-Text': '#919191',
        'Primary-Text': '#1A1A1A',
        'Neutral-Primary-Text': '#434343',
        'Neutral-Divider': '#EDEDED',
        'Neutral-Border': '#E1E1E1',
        'Brand-Brand': '#764DF1',
        'Brand-Brand-BG': '#F2EEFF',
        'Brand-hover': '#7F58F5',
        'Brand-click': '#6F45EF',
        'Neutral-Hover-BG': '#FAFAFA',
        'Neutral-Default-BG': '#F6F6F6',
      },
    },
    screens: {
      xs: '480px',
      sm: '641px',
      md: '769px',
      lg: '1025px',
      xl: '1281px',
      '2xl': '1537',
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
