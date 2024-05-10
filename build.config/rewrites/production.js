module.exports = [
  {
    source: '/api/:path*',
    destination: 'https://test-api.tmrwdao.com/api/:path*',
  },
  {
    source: '/explorer-api/:path*',
    destination: 'https://explorer-test.aelf.io/api/:path*',
  },
];
