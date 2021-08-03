import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateAccountSetupScreen} from './CreateAccountSetupScreen';

const mockStore = configureMockStore();

describe('CreateAccountSetupScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateAccountSetupScreen
        form={{
          accountName: 'test',
        }}
        onChange={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
