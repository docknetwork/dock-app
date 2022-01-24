
const fs = require('fs');
const {execSync} = require('child_process')
const sdkRepoExists = fs.existsSync('../wallet-sdk');

let output;

if (!sdkRepoExists) {
  console.log('Clonning wallet sdk repo....')
  output = execSync(`
    cd ..
    git clone https://github.com/docknetwork/react-native-sdk wallet-sdk;
  `);
  
  console.log(output.toString());
}

console.log('Installing wallet sdk dependencies....')
output = execSync(`
    cd ../wallet-sdk
    yarn install;
    yarn link-packages;
  `);

console.log(output.toString());

console.log('Linking wallet sdk dependencies....')
  
output = execSync(`
  yarn link "@docknetwork/wallet-sdk-core";
  yarn link "@docknetwork/wallet-sdk-transactions";
  yarn link "@docknetwork/wallet-sdk-bundler";
`);

console.log(output.toString());
  
