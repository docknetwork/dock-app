import {
  AccountsScreenTestIDs,
  AddAccountModalTestIDs,
} from '../src/features/accounts/test-ids';
import {
  CreateAccountBackupTestIDs,
  CreateAccountSetupTestIDs,
} from '../src/features/account-creation/test-ids';

async function tapPasscode() {
  for (let i = 0; i < 6; i++) {
    await element(by.id('keyboardNumber1')).tap();
  }
}

export async function createWallet() {
  await waitFor(element(by.id('createWalletScreen')))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id('createWalletButton')).tap();
  await waitFor(element(by.id('createPasscodeScreen')))
    .toBeVisible()
    .withTimeout(5000);

  for (let i = 0; i < 6; i++) {
    await element(by.id('keyboardNumber1')).tap();
  }

  await tapPasscode();

  await waitFor(element(by.id('accountsScreen')))
    .toBeVisible()
    .withTimeout(5000);
}

export async function unlockWallet() {
  await waitFor(element(by.id('unlockWalletScreen')))
    .toBeVisible()
    .withTimeout(5000);

  await tapPasscode();
}

describe('Wallet and accounts', () => {
  it('Expect to create wallet button', async () => {
    await device.launchApp({newInstance: true});
    await createWallet();
  });

  it('Expect to unlock the wallet', async () => {
    await device.terminateApp();
    await device.launchApp({newInstance: false});
    await unlockWallet();
  });

  it('Expect to create new account', async () => {
    await waitFor(element(by.id(AccountsScreenTestIDs.screen)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(AccountsScreenTestIDs.addAccountMenuBtn)).tap();
    await waitFor(element(by.id(AddAccountModalTestIDs.addAccountModal)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(AddAccountModalTestIDs.addAccountOption)).tap();
    await waitFor(element(by.id(CreateAccountSetupTestIDs.screen)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(CreateAccountSetupTestIDs.acountNameInput)).typeText(
      'Test Account',
    );
    await waitFor(element(by.id(CreateAccountSetupTestIDs.nextBtn)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(CreateAccountSetupTestIDs.nextBtn)).tap();
    await waitFor(element(by.id(CreateAccountBackupTestIDs.screen)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(CreateAccountBackupTestIDs.skipBtn)).tap();

    await waitFor(element(by.id(AccountsScreenTestIDs.screen)))
      .toBeVisible()
      .withTimeout(5000);
  });
});
