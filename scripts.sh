
cp -rf ./node_modules/ws ./packages/mobile/node_modules
rm -rf ./node_modules/ws
yarn workspace @docknetwork/mobile-wallet postinstall

rm -rf ./packages/mobile/node_modules/react
rm -rf ./packages/mobile/node_modules/react-dom
rm -rf ./packages/mobile/node_modules/react-redux
