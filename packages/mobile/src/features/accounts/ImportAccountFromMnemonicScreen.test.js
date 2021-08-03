import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ImportAccountFromMnemonicScreen} from './ImportAccountFromMnemonicScreen';

const mockStore = configureMockStore();

describe('ImportAccountFromMnemonicScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <ImportAccountFromMnemonicScreen
        onChange={jest.fn()}
        form={{
          phrase: 'test',
          _errors: {
            
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
