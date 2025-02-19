const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@common-components': path.resolve(__dirname, 'src/components/_common'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@design-system': path.resolve(__dirname, 'src/design-system/index'),
      '@mock': path.resolve(__dirname, 'src/mock'),
      '@libs': path.resolve(__dirname, 'src/libs'),
    },
  },
  babel: {
    plugins: [
      [
        'babel-plugin-styled-components',
        {
          fileName: false,
          displayName: true,
        },
      ],
    ],
  },
};
