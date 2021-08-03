import { shallow } from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import { AccountDetailsScreen } from './AccountDetailsScreen';

const mockStore = configureMockStore();

describe('AccountDetailsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <AccountDetailsScreen
        account={{
          meta: {
            name: 'Test account',
            balance: {
              value: 2,
            }
          }
        }}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
