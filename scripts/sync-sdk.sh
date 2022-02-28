mkdir ./node_modules/@docknetwork
rm -rf ./node_modules/@docknetwork/react-native-sdk
rm -rf ./node_modules/@docknetwork/wallet-sdk-**

# there is a script to clone the sdk repo
# its located at ./scripts/sdk-download.js
cp -rf ../wallet-sdk/packages/core ./node_modules/@docknetwork/wallet-sdk-core
cp -rf ../wallet-sdk/packages/react-native ./node_modules/@docknetwork/wallet-sdk-react-native
cp -rf ../wallet-sdk/packages/transactions ./node_modules/@docknetwork/wallet-sdk-transactions
