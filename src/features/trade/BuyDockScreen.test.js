import {shallow} from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import {BuyDockScreenScreen} from './BuyDockScreen';
import thunk from 'redux-thunk';
import {renderAppProviders} from '../../core/test-utils';
import TransakProvider, {
  parseTransakConfig,
  TransakIntroView,
  TransakWebView,
} from './components/TransakProvider';
import queryString from 'query-string';

const mockStore = configureMockStore([thunk]);

describe('BuyDockScreenScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <BuyDockScreenScreen
        walletAddress={'3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB'}
        orderId={'fd1b4a14-f4be-4218-9e76-4aec9c00db69'}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render TransakProvider correctly', () => {
    const wrapper = shallow(
      renderAppProviders(
        <TransakProvider
          walletAddress={'3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB'}
          partnerOrderId={'fd1b4a14-f4be-4218-9e76-4aec9c00db69'}
        />,
      ),
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render TransakIntro Component', () => {
    const wrapper = shallow(
      renderAppProviders(<TransakIntroView onPress={jest.fn()} />),
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render TransakProvider Webview', () => {
    const queryUrl = queryString.stringify({
      partnerOrderId: 'fd1b4a14-f4be-4218-9e76-4aec9c00db69',
      cryptoCurrencyCode: 'DOCK',
      walletAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
    });
    const wrapper = shallow(<TransakWebView url={queryUrl} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('is correct env selected for production', () => {
    const TRANSAK_ENVIRONMENT_CONFIG = {
      mainnet: 'PROD_TRANSAK_ENVIRONMENT',
      local: 'STAGING_TRANSAK_ENVIRONMENT',
      testnet: 'STAGING_TRANSAK_ENVIRONMENT',
    };

    const TRANSAK_API_KEY_CONFIG = {
      mainnet: 'PROD_TRANSAK_API_KEY',
      local: 'STAGING_TRANSAK_API_KEY',
      testnet: 'STAGING_TRANSAK_API_KEY',
    };
    const TRANSAK_BASE_URL_CONFIG = {
      mainnet: 'PROD_TRANSAK_BASE_URL',
      local: 'STAGING_TRANSAK_BASE_URL',
      testnet: 'STAGING_TRANSAK_BASE_URL',
    };

    expect(parseTransakConfig(TRANSAK_ENVIRONMENT_CONFIG, 'mainnet')).toBe(
      'PROD_TRANSAK_ENVIRONMENT',
    );

    expect(parseTransakConfig(TRANSAK_API_KEY_CONFIG, 'mainnet')).toBe(
      'PROD_TRANSAK_API_KEY',
    );

    expect(parseTransakConfig(TRANSAK_BASE_URL_CONFIG, 'mainnet')).toBe(
      'PROD_TRANSAK_BASE_URL',
    );
  });

  it('is correct env selected for testnet', () => {
    const TRANSAK_ENVIRONMENT_CONFIG = {
      mainnet: 'PROD_TRANSAK_ENVIRONMENT',
      local: 'STAGING_TRANSAK_ENVIRONMENT',
      testnet: 'STAGING_TRANSAK_ENVIRONMENT',
    };

    const TRANSAK_API_KEY_CONFIG = {
      mainnet: 'PROD_TRANSAK_API_KEY',
      local: 'STAGING_TRANSAK_API_KEY',
      testnet: 'STAGING_TRANSAK_API_KEY',
    };
    const TRANSAK_BASE_URL_CONFIG = {
      mainnet: 'PROD_TRANSAK_BASE_URL',
      local: 'STAGING_TRANSAK_BASE_URL',
      testnet: 'STAGING_TRANSAK_BASE_URL',
    };

    expect(parseTransakConfig(TRANSAK_ENVIRONMENT_CONFIG, 'testnet')).toBe(
      'STAGING_TRANSAK_ENVIRONMENT',
    );

    expect(parseTransakConfig(TRANSAK_API_KEY_CONFIG, 'testnet')).toBe(
      'STAGING_TRANSAK_API_KEY',
    );

    expect(parseTransakConfig(TRANSAK_BASE_URL_CONFIG, 'testnet')).toBe(
      'STAGING_TRANSAK_BASE_URL',
    );
  });
});
