import {getCoinCapToken} from './price-service';

describe('Price service', () => {
  describe('getCoinCapToken', () => {
    const successResponse = {
      priceUsd: 200,
    };

    it('expect to return success response', async () => {
      global.fetch = () =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({data: successResponse}),
        });

      const result = await getCoinCapToken('DOCK');

      expect(result).toBe(successResponse);
    });

    it('expect to handle error', async () => {
      global.fetch = () =>
        Promise.resolve({
          status: 400,
        });

      let error;

      try {
        await getCoinCapToken('DOCK');
      } catch (err) {
        error = err;
      }

      await expect(error.message).toBe('unable to fetch price');
    });
  });
});
