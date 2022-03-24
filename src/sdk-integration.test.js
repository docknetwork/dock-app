import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';

describe('Wallet sdk integration', () => {
  const wallet = Wallet.getInstance();

  it('expect to create wallet', () => {
    expect(wallet.context).toBeDefined();
  });

  it('expect to load wallet', async () => {
    await wallet.load();
    expect(wallet.status).toBe('ready');
  });
});
