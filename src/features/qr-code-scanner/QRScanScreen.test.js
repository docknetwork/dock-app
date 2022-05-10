import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {QRScanScreen} from './QRScanScreen';

const mockStore = configureMockStore();

describe('QRScanScreen', () => {
  it('should render correctly when isScreenFocus=true', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <QRScanScreen onData={jest.fn} isScreenFocus={true} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render correctly when isScreenFocus=false', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <QRScanScreen onData={jest.fn} isScreenFocus={false} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
