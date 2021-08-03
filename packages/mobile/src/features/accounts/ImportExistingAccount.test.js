import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ImportExistingAccount} from './ImportExistingAccount';
import {renderAppProviders} from '../../core/test-utils';

const mockStore = configureMockStore();

describe('ImportExistingAccount', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      renderAppProviders(
        <ImportExistingAccount onClose={jest.fn()} visible={true} />,
      ),
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
