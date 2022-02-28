import {useWallet} from '@docknetwork/wallet-sdk-react-native/lib';
import {useEffect, useMemo, useState} from 'react';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';

export function useAccount(address) {
  const {documents} = useWallet({syncDocs: true});
  const [balance, setBalance] = useState(0);

  const account = useMemo(() => {
    return documents.find(doc => doc.id === address);
  }, [documents, address]);

  useEffect(() => {
    walletService.resolveCorrelations(address).then(correlations => {
      const currency = correlations.find(item => item.type === 'Currency');

      if (!currency) {
        throw new Error(`No currency document found for account ${address}`);
      }

      setBalance(currency.value);
    });
  }, [address]);

  return {
    account,
    balance,
  };
}
