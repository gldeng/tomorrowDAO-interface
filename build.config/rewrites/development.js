module.exports = [
  {
    source: '/api/:path*',
    destination: 'http://192.168.67.187:8068/api/:path*',
  },
  {
    source: '/cms/:path*',
    destination: 'http://18.166.65.26:3104/:path*',
    basePath: false,
  },
];
