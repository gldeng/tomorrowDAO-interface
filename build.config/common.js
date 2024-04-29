const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'silver-abstract-unicorn-590.mypinata.cloud',
        pathname: '/**/*',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    config.ignoreWarnings = [{ module: /node_modules/ }];
    return config;
  },
};
