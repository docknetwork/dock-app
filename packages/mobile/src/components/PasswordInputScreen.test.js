import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {PasswordInputScreen} from './PasswordInputScreen';

const mockStore = configureMockStore();

describe('PasswordInputScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <PasswordInputScreen
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
