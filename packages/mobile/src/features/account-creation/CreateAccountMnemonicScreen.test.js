import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateAccountMnemonicScreen} from './CreateAccountMnemonicScreen';

const mockStore = configureMockStore();

describe('CreateAccountMnemonicScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateAccountMnemonicScreen
        phrase="test phrase"
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
