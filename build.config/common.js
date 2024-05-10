const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rewritesConfig = require('./rewrites/index');
const ROOT = path.resolve(__dirname, '../src/app/network-dao/');
module.exports = {
  ssg: false,
  reactStrictMode: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    domains: ['www.baidu.com', '**.baidu.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'silver-abstract-unicorn-590.mypinata.cloud',
        pathname: '/**/*',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });
    config.ignoreWarnings = [{ module: /node_modules/ }];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@config': path.resolve(ROOT, '_src/config'),
      '@src': path.resolve(ROOT, '_src'),
      '@pages': path.resolve(ROOT, '_src/pages'),
      '@components': path.resolve(ROOT, '_src/components'),
      '@common': path.resolve(ROOT, '_src/common'),
      '@utils': path.resolve(ROOT, '_src/utils'),
      '@store': path.resolve(ROOT, '_src/store'),
      '@api': path.resolve(ROOT, '_src/api'),
      '@actions': path.resolve(ROOT, '_src/redux/actions/'),
      '@redux': path.resolve(ROOT, '_src/redux/'),
    };
    // config.module.rules.push({
    //   test: /\.less$/,
    //   use: [
    //     {
    //       loader: MiniCssExtractPlugin.loader,
    //       options: {},
    //     },
    //     'css-loader',
    //     'postcss-loader',
    //     'less-loader',
    //   ],
    // });
    // config.module.rules.push({
    //   test: /\.css$/i,
    //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
    // });
    // config.plugins.push(new MiniCssExtractPlugin());

    return config;
  },
};
