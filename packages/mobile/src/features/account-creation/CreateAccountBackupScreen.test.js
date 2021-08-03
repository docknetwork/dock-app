import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateAccountBackupScreen} from './CreateAccountBackupScreen';

const mockStore = configureMockStore();

describe('CreateAccountBackupScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateAccountBackupScreen
        form={{
          password: 'test',
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
