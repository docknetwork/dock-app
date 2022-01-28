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


// console.log();

// throw 'err';
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
      // resolveRequest: (context, realModuleName, platform, moduleName) => {
        // Resolve file path logic...
      
        // console.log(moduleName);

        // return context.resolveRequest(context, realModuleName, platform, moduleName);
        // return {
        //   filePath: context.originModulePath,
        //   type: 'sourceFile',
        // };
      // },
      // blacklistRE: exclusionList([/rn-rpc-webview\/source\/.*/]),
      resolverMainFields: ["react-native", "main"],
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      // nodeModulesPaths: [
      //   path.resolve(__dirname, '../wallet-sdk/packages/react-native'),
      //   path.resolve(__dirname, '../wallet-sdk')
      // ],
      // watchFolders: [
      //   path.resolve(__dirname, '../wallet-sdk'),
      //   path.resolve(__dirname, '../wallet-sdk/packages/react-native'),
      // ],
      extraNodeModules: {
        ...extraNodeModules,
        // '@docknetwork/wallet-sdk-react-native': path.resolve(__dirname, '../wallet-sdk/packages/react-native'),
        // '@docknetwork/wallet-sdk-core': path.resolve(__dirname, '../wallet-sdk/packages/core'),
        vm: require.resolve('vm-browserify'),
        'test2': path.resolve(__dirname, './src'),
        src: path.resolve(__dirname, './src'),
        // '@docknetwork/wallet-sdk-transactions': path.resolve(__dirname, '../wallet-sdk/packages/transactions'),
        mrklt: path.resolve(__dirname, "./src/mrklt.js"),
        'credentials-context': path.resolve(__dirname, "./rn-packages/credentials-context.js"),
        'security-context': path.resolve(__dirname, "./rn-packages/security-context.js"),
      }
    }
  };
})
