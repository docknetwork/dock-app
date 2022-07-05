import {renderHook, act} from '@testing-library/react-hooks';
import {
  sortByIssuanceDate,
  getCredentialTimestamp,
  useCredentials,
  getDIDAddress,
  processCredential,
  doesCredentialExist,
} from './credentials';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';

const mockCreds = [
  {
    id: 1,
    issuanceDate: '2022-03-25T10:28:18.848Z',
  },
  {
    id: 0,
    issuanceDate: '2023-03-25T10:28:18.848Z',
  },
  {
    id: 2,
    issuanceDate: '2020-03-25T10:28:18.848Z',
  },
  {
    id: 3,
    issuanceDate: null,
  },
];
describe('Credentials helpers', () => {
  describe('getCredentialTimestamp', () => {
    it('expect to get credential timestamp', () => {
      expect(
        getCredentialTimestamp({
          issuanceDate: '2022-03-25T10:28:18.848Z',
        }),
      ).toEqual(1648204098848);
    });

    it('expect handle invalid issuanceDate', () => {
      expect(
        getCredentialTimestamp({
          issuanceDate: 'invalid date',
        }),
      ).toEqual(0);

      expect(
        getCredentialTimestamp({
          issuanceDate: null,
        }),
      ).toEqual(0);
    });

    it('expect throw for invalid credential', () => {
      expect(() => getCredentialTimestamp(null)).toThrowError();
    });
  });

  describe('sortByIssuanceDate', () => {
    it('expect to sort credentials', () => {
      const result = mockCreds
        .map(cred => ({...cred, content: cred}))
        .sort(sortByIssuanceDate);

      result.forEach((item, idx) => expect(item.id).toEqual(idx));
    });
  });

  it('getDIDAddress', () => {
    expect(() => getDIDAddress(null)).toThrowError();
    expect(
      getDIDAddress(
        'did:dock:5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      ),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
    expect(
      getDIDAddress(
        'did:other:5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A',
      ),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
    expect(
      getDIDAddress('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A'),
    ).toBe('5CNyqnHYmrbSE9nmQnpyhdZHi1TavExi3kFWbfrRh1WxQw6A');
  });

  describe('processCredential', () => {
    it('expect to remove timezone offset', async () => {
      const issuanceDate = new Date('2022-04-24T00:53:13.265Z');
      const credential = {
        issuanceDate,
        type: ['VerifiableCredential'],
        credentialSubject: {},
        issuer: 'did:dock:xyz',
      };
      const result = await processCredential({content: credential});
      expect(result.content.issuanceDate.getDate()).toBe(24);
      expect(result.content.issuanceDate.getMonth()).toBe(3);
    });

    it('expect to handle bad data', async () => {
      await expect(processCredential({})).rejects.toThrowError();

      await expect(processCredential(null)).rejects.toThrowError();
    });
  });

  describe('useCredentials', () => {
    const creds = [...mockCreds];
    let hook;
    const onPickFile = jest.fn().mockResolvedValue({});

    beforeEach(async () => {
      jest.spyOn(creds, 'sort');
      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementation(() => Promise.resolve(creds));
      jest
        .spyOn(Credentials.getInstance(), 'add')
        .mockImplementation(value => Promise.resolve(value));
      jest
        .spyOn(Credentials.getInstance(), 'remove')
        .mockImplementation(() => Promise.resolve(creds[0]));
      const {result} = await renderHook(() => useCredentials({onPickFile}));
      hook = result;
    });

    it('expect to fetch credentials', () => {
      expect(Credentials.getInstance().query).toBeCalled();
    });

    it('expect to sort credentials', () => {
      expect(creds.sort).toBeCalled();
    });

    it('expect to delete credential', async () => {
      await act(() => {
        hook.current.handleRemove({id: 1});
      });

      expect(Credentials.getInstance().remove).toBeCalledWith(1);
    });

    it('expect to add credential', async () => {
      await act(async () => {
        await hook.current.onAdd();
      });

      expect(Credentials.getInstance().add).toBeCalled();
      expect(Credentials.getInstance().query).toBeCalled();
    });

    it('expect not to add duplicated credential', () => {
      const allCredentials = mockCreds.map(m => {
        return {
          content: m,
        };
      });
      expect(doesCredentialExist(allCredentials, mockCreds[0])).toBeTruthy();
      expect(
        doesCredentialExist(allCredentials, {
          id: '10a2ed6eae550f6e1b456777de5ed27fdadd2e6ef1f6081e981918735e1d8f92',
        }),
      ).toBeFalsy();
    });
  });
});
