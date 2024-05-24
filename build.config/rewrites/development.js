module.exports = [
  {
    source: '/api/app/:path*',
    destination: 'https://test-api.tmrwdao.com/api/app/:path*',
  },
  {
    source: '/explorer-api/:path*',
    destination: 'https://explorer-test.aelf.io/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'http://18.166.65.26:3104/:path*',
    basePath: false,
  },
];
