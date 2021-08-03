import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {GenericPasswordScreen} from './ExportAccountPasswordScreen';

const mockStore = configureMockStore();

describe('GenericPasswordScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <GenericPasswordScreen
        onChange={jest.fn()}
        form={{
          password: 'test',
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
