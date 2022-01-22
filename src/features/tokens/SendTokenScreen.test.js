import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {SendTokenScreen, handleFeeUpdate} from './SendTokenScreen';
import {setToast} from '../../core/toast';
import {getPlainDockAmount} from 'src/core/format-utils';

const mockStore = configureMockStore();

describe('SendTokenScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <SendTokenScreen
        address={'3B9W5fS4ygoUVnGhzTk7sihSdhCyJQRNMQ7aJfDdsfWb16f1'}
        form={{
          _errors: {},
        }}
        onChange={() => {}}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  describe('handle fee update', () => {
    beforeEach(() => {
      const toastMock = {
        show: jest.fn(),
      };

      setToast(toastMock);
    });

    it('enough balance to pay for fees', () => {
      const setShowConfirmation = jest.fn();
      let form = {
        amount: 1,
      };
      const updateForm = f => {
        form = f;
      };
      const balance = getPlainDockAmount(100);
      const fee = 2;

      const result = handleFeeUpdate({
        accountDetails: {
          balance,
        },
        fee,
        form,
        setShowConfirmation,
        updateForm,
      });

      expect(result).toBe(true);
      expect(form.fee).toBe(fee);
      expect(setShowConfirmation).toBeCalledWith(true);
    });

    it('expect to reduce the amount to pay for fees', () => {
      const setShowConfirmation = jest.fn();
      let form = {
        amount: 2,
      };
      const updateForm = f => {
        form = f;
      };
      const balance = getPlainDockAmount(3);
      const fee = getPlainDockAmount(2);

      const result = handleFeeUpdate({
        accountDetails: {
          balance,
        },
        fee,
        form,
        setShowConfirmation,
        updateForm,
      });

      expect(result).toBe(true);
      expect(form.fee).toBe(fee);
      expect(form.amountMessage).toBeDefined();
      expect(form.amount).toBe(1);
      expect(setShowConfirmation).toBeCalledWith(true);
    });

    it('expect to not have enough balance for fees', () => {
      const setShowConfirmation = jest.fn();
      let form = {
        amount: 2,
      };
      const updateForm = f => {
        form = f;
      };
      const balance = getPlainDockAmount(1);
      const fee = getPlainDockAmount(2);

      const result = handleFeeUpdate({
        accountDetails: {
          balance,
        },
        fee,
        form,
        setShowConfirmation,
        updateForm,
      });

      expect(result).toBe(false);
      expect(form).toBe(form);
      expect(setShowConfirmation).not.toBeCalled();
    });
  });
});
