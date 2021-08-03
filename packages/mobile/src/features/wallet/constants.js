export const WalletConstants = {
  createWallet: {
    locales: {
      createNewWallet: 'Create a new wallet',
      importWallet: 'I already have a wallet',
    },
    testID: {
      container: 'createWallet',
    },
  },
  protectYourWallet: {
    locales: {
      biometicsFailed: 'Biometrics failed to load',
      biometicsEnabled: 'Biometrics enabled',
    },
    testID: {
      container: 'protectYourWallet',
    },
  },
  exportWallet: {
    locales: {
      title: 'Create a password',
      description:
        'Please create a password to keep your backup wallet safe. You will need this password when you import your wallet to a new device.',
    },
    testID: {
      container: 'exportWallet',
    },
  },
  importWallet: {
    locales: {
      title: 'Import wallet',
      description:
        'If you backed up your wallet previously, you can upload the file to import your wallet.',
      loadingText: 'Importing wallet',
      successMessage: 'Wallet imported',
      submit: 'Import wallet',
    },
    testID: {
      container: 'importWallet',
      title: 'title',
      description: 'description',
      submitBtn: 'submitBtn',
    },
  },
};
