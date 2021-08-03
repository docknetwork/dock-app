const path = require("path");
const { getLoader, loaderByName, addBeforeLoader } = require("@craco/craco");


process.env.CI = false;

module.exports = {
	webpack: {
		alias: {
			'react': path.resolve(__dirname, 'node_modules/react'),
			'react-native-permissions': require.resolve('./mock.js'),
			'react-native-camera': require.resolve('./mock.js'),
			'react-native-gesture-handler': require.resolve('./mock.js'),
			'react-native-share': require.resolve('./mock.js'),
			'react-native-fs': require.resolve('./mock.js'),
			'react-native-qrcode-scanner': require.resolve('./mock.js'),
			'react-native-qrcode-scanner': require.resolve('./mock.js'),
			mrklt: require.resolve('./mock.js'),
			'credentials-context': require.resolve('./mock.js'),
			'security-context': require.resolve('./mock.js'),
			'react-native-splash-screen': require.resolve('./mock.js'),
			'react-native-keychain': require.resolve('./web-keychain'),
			'react-native-keychain': require.resolve('./web-keychain'),
			'credentials-context': require.resolve('@docknetwork/mobile-wallet/rn-packages/credentials-context'),
			'security-context': require.resolve('@docknetwork/mobile-wallet/rn-packages/security-context'),
			'src':  path.resolve(__dirname, '../mobile/src'),
		},
		plugins: [
			
		],
		configure: (webpackConfig) => {
			const { isFound, match } = getLoader(
				webpackConfig,
				loaderByName("babel-loader")
			);

			if (isFound) {
				match.loader.options.plugins = match.loader.options.plugins.concat([
					[
						require.resolve("babel-plugin-dotenv-import"),
						{
							moduleName: "@env",
							path: ".env",
							blacklist: null,
							whitelist: null,
							safe: false,
							allowUndefined: false,
						},
					],
					require.resolve('babel-plugin-inline-react-svg'),
				]);
			}

			const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
			if (oneOfRule) {
				const tsxRule = oneOfRule.oneOf.find(
					(rule) =>
						rule.test &&
						(rule.test.toString().includes("tsx") ||
							rule.test.toString().includes("ts"))
				);

				const newIncludePaths = [
					path.resolve(__dirname, "../../packages/wallet-components/"),
					path.resolve(__dirname, "../../packages/mobile/"),
				];
				if (tsxRule) {
					if (Array.isArray(tsxRule.include)) {
						tsxRule.include = [...tsxRule.include, ...newIncludePaths];
					} else {
						tsxRule.include = [tsxRule.include, ...newIncludePaths];
					}
				}
			}
			
			// const wasmExtensionRegExp = /\.wasm$/;
      // webpackConfig.resolve.extensions.push('.wasm');

      // webpackConfig.module.rules.forEach((rule) => {
      //   (rule.oneOf || []).forEach((oneOf) => {
      //     if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
      //       oneOf.exclude.push(wasmExtensionRegExp);
      //     }
      //   });
      // });

      // const wasmLoader = {
      //   test: /\.wasm$/,
      //   exclude: /node_modules/,
      //   loaders: ['wasm-loader'],
      // };

      // addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

			

			return webpackConfig;
		},
	},
};
