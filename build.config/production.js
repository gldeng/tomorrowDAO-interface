const commonConfig = require('./common');
module.exports = {
  ...commonConfig,
  swcMinify: true,
  experimental: {
    'react-use': {
      transform: 'react-use/lib/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  productionBrowserSourceMaps: false,
  resolve: {},
};
