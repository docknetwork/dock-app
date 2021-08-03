import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ImportAccountSetupScreen} from './ImportAccountSetupScreen';

const mockStore = configureMockStore();

describe('ImportAccountSetupScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <ImportAccountSetupScreen
        onChange={jest.fn()}
        form={{
          accountName: 'test'
        }}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
