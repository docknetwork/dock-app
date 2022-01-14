import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet'
import {SUBSTRATE_NETWORKS, NetworkManager} from '@docknetwork/wallet-sdk-core/lib/modules/network-manager';
import { appOperations } from './app-slice';

describe('App slice', () => {
  describe('operations', () => {
    it('set network', async () => {
      const networkId = 'testnet';
      await appOperations.setNetwork(networkId)();
      expect(NetworkManager.getInstance().networkId).toBe(networkId);
    });
  })
});
