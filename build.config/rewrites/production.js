module.exports = [
  {
    source: '/api/:path*',
    destination: 'https://api.tmrwdao.com/api/:path*',
  },
  {
    source: '/explorer-api/:path*',
    destination: 'https://explorer.aelf.io/api/:path*',
  },
];
