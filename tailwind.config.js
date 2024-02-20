/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        baseBorder: '#EDEDED',
        colorPrimary: '#764DF1',
        colorPrimaryHover: '#7F58F5',
        colorPrimaryActive: '#6F45EF',
      },
    },
  },
  plugins: [],
};
