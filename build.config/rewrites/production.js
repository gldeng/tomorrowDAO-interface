module.exports = [
  {
    source: '/api/:path*',
    destination: 'https://api.tmrwdao.com/api/:path*',
  },
  {
    source: '/connect/token',
    destination: 'https://api.tmrwdao.com/connect/token',
  },
  {
    source: '/explorer-api/:path*',
    destination: 'https://explorer.aelf.io/api/:path*',
  },
];
