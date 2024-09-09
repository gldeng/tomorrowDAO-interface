module.exports = [
  {
    source: '/api/:path*',
    destination: 'https://api.tmrwdao.com/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'https://tmrwdao.com/cms/:path*',
  },
  {
    source: '/connect/token',
    destination: 'https://api.tmrwdao.com/connect/token',
  },
  {
    source: '/explorer-api/:path*',
    destination: 'https://explorer.aelf.io/api/:path*',
  },
  {
    source: '/token-price-api/:path*',
    destination: 'https://explorer.aelf.io/api/:path*',
  },
  {
    source: '/side-explorer-api/:path*',
    destination: 'https://tdvv-explorer.aelf.io/api/:path*',
  },
];
