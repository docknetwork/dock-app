import {getRealm} from 'src/core/realm';
import {showToast} from 'src/core/toast';
import {translate} from 'src/locales';

const tokenPrices = {};

export const getCoinCapToken = tokenSymbol => {
  return global
    .fetch(`https://api.coincap.io/v2/assets/${tokenSymbol}`)
    .then(res => {
      if (res.status !== 200) {
        throw new Error('unable to fetch price');
      }

      return res.json();
    })
    .then(res => res.data);
};

function getTokenPrice(symbol) {
  const realm = getRealm();

  if (tokenPrices[symbol]) {
    return tokenPrices[symbol];
  }

  const fetchFromNetwork = async () => {
    const {priceUsd} = await getCoinCapToken('dock');
    const price = parseFloat(priceUsd) || 0;

    tokenPrices[symbol] = price;

    realm.write(() => {
      realm.create(
        'TokenPrice',
        {
          symbol: symbol,
          price: price,
        },
        'modified',
      );
    });

    return price;
  };

  const cachedPrice = realm
    .objects('TokenPrice')
    .filtered('symbol = $0', symbol)
    .toJSON()[0];
  const networkResult = fetchFromNetwork();

  if (cachedPrice) {
    return cachedPrice.price;
  }

  return networkResult;
}

export async function getDockTokenPrice() {
  try {
    return await getTokenPrice('DOCK');
  } catch (err) {
    showToast({
      type: 'error',
      message: translate('global.unable_to_fetch_price'),
    });
  }

  return 0;
}
