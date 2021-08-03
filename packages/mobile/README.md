# dock-app

## Project setup
```
yarn install
cd ios
pod install
```


## Webview
This project is using a webview to handle polkadot-js and webassembly
You need to clone the repository: https://github.com/docknetwork/react-native-sdk

Webview server setup:

```
yarn install
```

## Starting the app
To start the app you need 3 separate terminal tabs
```
# 1: start the metro server
yarn start


# 2: start the webview server
# In the https://github.com/docknetwork/react-native-sdk project
yarn start


# 3: start the ios emulator
yarn ios


```