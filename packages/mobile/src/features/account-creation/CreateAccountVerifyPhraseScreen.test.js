import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateAccountVerifyPhraseScreen} from './CreateAccountVerifyPhraseScreen';

const mockStore = configureMockStore();

describe('CreateAccountVerifyPhraseScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateAccountVerifyPhraseScreen
        form={{
          word1: 'test',
          word2: 'test2',
        }}
        confirmationIndexes={[3, 5]}
        onChange={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
