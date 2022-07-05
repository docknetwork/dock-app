import {getErrorMessageFromErrorObject} from './toast';
import {translate} from '../locales';

describe('Toast', () => {
  it('can get error message from error object', () => {
    const errorObject = new Error('Something went wrong');

    expect(getErrorMessageFromErrorObject(errorObject)).toBe(
      'Something went wrong',
    );

    expect(getErrorMessageFromErrorObject('Oops')).toBe('Oops');
    expect(
      getErrorMessageFromErrorObject(
        '[AssertionError: account already exists]',
      ),
    ).toBe('account already exists');

    expect(getErrorMessageFromErrorObject()).toBe(
      translate('global.unexpected_error'),
    );
  });
});
