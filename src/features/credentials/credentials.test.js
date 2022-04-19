import {renderHook} from '@testing-library/react-hooks';
import {
  sortByIssuanceDate,
  getCredentialTimestamp,
  useCredentials,
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
      const result = mockCreds.sort(sortByIssuanceDate);

      result.forEach((item, idx) => expect(item.id).toEqual(idx));
    });
  });

  describe('useCredentials', () => {
    const creds = [...mockCreds];

    beforeAll(async () => {
      jest.spyOn(creds, 'sort');
      jest
        .spyOn(Credentials.getInstance(), 'query')
        .mockImplementation(() => Promise.resolve(creds));
      await renderHook(() => useCredentials());
    });

    it('expect to fetch credentials', () => {
      expect(Credentials.getInstance().query).toBeCalled();
    });

    it('expect to sort credentials', () => {
      expect(creds.sort).toBeCalled();
    });
  });
});
