module.exports = [
  {
    source: '/api/app/:path*',
    destination: 'https://test-api.tmrwdao.com/api/app/:path*',
  },
  {
    source: '/connect/token',
    destination: 'https://test-api.tmrwdao.com/connect/token',
  },
  {
    source: '/explorer-api/:path*',
    destination: 'https://explorer-test.aelf.io/api/:path*',
  },
];
