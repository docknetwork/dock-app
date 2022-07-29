import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ExportDIDScreen} from './ExportDIDScreen';

const mockStore = configureMockStore();

describe('ExportDIDScreen', () => {
  it('should render correctly when form valid', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      password: '',
      passwordConfirmation: '',
      _errors: {},
      _hasError: false,
    };
    const wrapper = shallow(
      <ExportDIDScreen
        form={form}
        onChange={jest.fn()}
        formValid={true}
        onSubmit={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly when form invalid', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      password: '',
      passwordConfirmation: '',
      _errors: {},
      _hasError: false,
    };
    const wrapper = shallow(
      <ExportDIDScreen
        form={form}
        onChange={jest.fn()}
        formValid={false}
        onSubmit={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
