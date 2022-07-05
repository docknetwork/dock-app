import {setToast} from '../../core/toast';
import {createAccountOperations} from './create-account-slice';
import {mockState, mockDispatch} from '../../core/test-utils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {keyringService} from '@docknetwork/wallet-sdk-core/lib/services/keyring';

const mockStore = configureMockStore([thunk]);
describe('Create accounts slice', () => {
  describe('operations', () => {
    describe('checkExistingAccount', () => {
      const toastMock = {
        show: jest.fn(),
      };

      setToast(toastMock);

      const state = {
        accounts: [
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
        ],
      };

      it('expect account to be found', () => {
        const accountFound = createAccountOperations.checkExistingAccount(1)(
          mockDispatch(),
          mockState('account', state),
        );

        expect(accountFound).toBe(true);
        expect(toastMock.show).toBeCalled();
      });

      it('expect account to not be found', () => {
        toastMock.show.mockReset();

        const accountFound = createAccountOperations.checkExistingAccount(5)(
          mockDispatch(),
          mockState('account', state),
        );

        expect(accountFound).toBe(false);
        expect(toastMock.show).not.toBeCalled();
      });
    });

    it('Check password before unlock json', () => {
      const store = mockStore({
        createAccount: {
          loading: true,
          form: {
            data: {
              address: '3HVkSiuFQj5dSjuAMX7ghwGz567fwaZhF1fSkhKm9BtHz9Mu',
              encoded: 'nUAWfr/JDa',
              encoding: {content: [Array], type: [Array], version: '3'},
              meta: {},
            },
            json: true,
          },
          mnemonicPhrase: '',
          accountToBackup: null,
        },
      });
      return store
        .dispatch(createAccountOperations.unlockJson('test'))
        .then(() => {
          expect(keyringService.addFromJson).toHaveBeenCalled();
        });
    });
  });
});
