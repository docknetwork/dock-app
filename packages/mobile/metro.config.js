/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const {getDefaultConfig} = require('metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const getWorkspaces = require('get-yarn-workspaces');
const extraNodeModules = require('node-libs-react-native');

module.exports = async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  const workspaces = getWorkspaces(__dirname);

  const watchFolders = [
    path.resolve(__dirname, '../../', 'node_modules'),
    ...workspaces.filter(workspaceDir => workspaceDir !== __dirname),
  ];

  return {
    // watchFolders: [path.resolve(__dirname, '../../')],
    watchFolders,
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
      blacklistRE: exclusionList([
        // Ignore other resolved react-native installations outside of
        // myapp-native - this prevents a module naming collision when mapped.
        /^((?!mobile).)+[\/\\]node_modules[/\\]react-native[/\\].*/,
        // /^((?!mobile).)+[\/\\]node_modules[/\\]react[/\\].*/,
        // /^((?!mobile).)+[\/\\]node_modules[/\\]react[/\\].*/,
        
      

      // Ignore react-native-svg dependency in myapp-ui, mapped below.
      // react-native-svg must only be included once due to a side-effect. It
      // has not been hoisted as it requires native module linking here.
      // http://bit.ly/2LJ7V4b
      // /components[\/\\]node_modules[/\\]react-native-svg[/\\].*/,
      ]),
      resolverMainFields: ['react-native', 'main'],
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      extraNodeModules: {
        ...extraNodeModules,
        ws: path.resolve(__dirname, 'node_modules', 'ws'),
        'react-native': path.resolve(__dirname, 'node_modules', 'react-native'),
        net: path.resolve(__dirname, 'node_modules', 'react-native-tcp'),
        multiformats: require.resolve('multiformats'),
        // 'react-redux': path.resolve(__dirname, 'node_modules', 'react-redux'),
        'react': path.resolve(__dirname, 'node_modules', 'react'),
        'native-base': path.resolve(__dirname, 'node_modules', 'native-base'),
        'react-native-svg': path.resolve(
          __dirname,
          'node_modules',
          'react-native-svg',
        ),
        'core-js': path.resolve(__dirname, 'node_modules', 'core-js'),
        vm: path.resolve(__dirname, 'vm-browserify'),
        src: path.resolve(__dirname, './src'),
        '@docknetwork/react-native-sdk': path.resolve(
          __dirname,
          '../../../dock-rn-web-bridge',
        ),
        mrklt: path.resolve(__dirname, './src/mrklt.js'),
        'credentials-context': path.resolve(
          __dirname,
          './rn-packages/credentials-context.js',
        ),
        'security-context': path.resolve(
          __dirname,
          './rn-packages/security-context.js',
        ),
      },
      // resolveRequest: (context, realModuleName, platform, moduleName) => {
      //   // Resolve file path logic...
      //   console.log('Resolve request for ', moduleName);

      //   return {
      //     filePath: "path/to/file",
      //     type: 'sourceFile',
      //   };
      // }
    },
  };
};
