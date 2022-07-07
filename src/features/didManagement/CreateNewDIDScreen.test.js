import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateNewDIDScreen} from './CreateNewDIDScreen';

const mockStore = configureMockStore();

describe('CreateNewDIDScreen', () => {
  it('should render correctly ', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(<CreateNewDIDScreen />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
