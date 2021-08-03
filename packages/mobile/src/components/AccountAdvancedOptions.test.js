import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {AccountAdvancedOptions} from './AccountAdvancedOptions';

const mockStore = configureMockStore();

describe('AccountAdvancedOptions', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <AccountAdvancedOptions
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
