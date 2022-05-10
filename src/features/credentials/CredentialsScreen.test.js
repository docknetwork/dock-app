import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CredentialsScreen} from './CredentialsScreen';

const mockStore = configureMockStore();

describe('CredentialsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CredentialsScreen credentials={[]} onRemove={jest.fn} onAdd={jest.fn} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
