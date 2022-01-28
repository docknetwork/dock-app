
const fs = require('fs');
const {execSync} = require('child_process')
const sdkRepoExists = fs.existsSync('../wallet-sdk');

let output;

if (!sdkRepoExists) {
  console.log('Cloning wallet sdk repo....')
  output = execSync(`
    cd ..;
    git clone https://github.com/docknetwork/react-native-sdk wallet-sdk;
    cd wallet-sdk;
    git checkout feat/wallet-sdk-impl
  `);
  
  console.log(output.toString());
}

console.log('Installing wallet sdk dependencies....')
output = execSync(`
    cd ../wallet-sdk;
    yarn install;
    yarn link-packages;
  `);

console.log(output.toString());

console.log('Linking wallet sdk dependencies....')
  
output = execSync(`
  yarn link "@docknetwork/wallet-sdk-core";
  yarn link "@docknetwork/wallet-sdk-transactions";
  yarn link "@docknetwork/wallet-sdk-react-native";
`);

console.log(output.toString());
  
