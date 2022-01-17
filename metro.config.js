/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const { getDefaultConfig } = require('metro-config');
// const exclusionList = require('metro-config/src/defaults/exclusionList');

const extraNodeModules = require('node-libs-react-native');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      // blacklistRE: exclusionList([/rn-rpc-webview\/source\/.*/]),
      resolverMainFields: ["react-native", "main"],
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      extraNodeModules: {
        ...extraNodeModules,
        vm: require.resolve('vm-browserify'),
        src: path.resolve(__dirname, './src'),
        '@docknetwork/react-native-sdk': path.resolve(__dirname, '../dock-rn-web-bridge'),
        '@docknetwork/wallet-sdk-core': path.resolve(__dirname, '../wallet-sdk/packages/core'),
        mrklt: path.resolve(__dirname, "./src/mrklt.js"),
        'credentials-context': path.resolve(__dirname, "./rn-packages/credentials-context.js"),
        'security-context': path.resolve(__dirname, "./rn-packages/security-context.js"),
      }
    }
  };
})
