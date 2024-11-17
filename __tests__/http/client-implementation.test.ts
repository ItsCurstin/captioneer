import { describe, expect, it } from 'vitest';
import { NetworkError } from '../../src';
import { CaptioneerHttpClient } from '../../src';
import { CaptioneerGETHttpMethod } from '../../src/http/types';
import { TEST_CONSTANTS } from '../utils/setup';

describe('HTTP Client Implementations', () => {
  describe('Custom Client Implementation', () => {
    const mockClient: CaptioneerHttpClient = {
      async get(url, options) {
        if (url.includes('error')) {
          throw new NetworkError('Network error');
        }
        if (options?.method && options.method !== 'GET') {
          throw new NetworkError('Only GET requests are supported');
        }
        return {
          ok: !url.includes('fail'),
          text: async () => 'Mock response',
        };
      },
    };

    it('should handle successful requests', async () => {
      const response = await mockClient.get(TEST_CONSTANTS.BASE_YOUTUBE_URL);
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe('Mock response');
    });

    it('should handle failed requests', async () => {
      const response = await mockClient.get(TEST_CONSTANTS.BASE_YOUTUBE_URL + '/fail');
      expect(response.ok).toBe(false);
    });

    it('should handle network errors', async () => {
      await expect(mockClient.get('/error')).rejects.toThrow(NetworkError);
    });

    it('should handle request options', async () => {
      const headers = { 'Custom-Header': 'value' };
      const response = await mockClient.get(TEST_CONSTANTS.BASE_YOUTUBE_URL, { headers });
      expect(response.ok).toBe(true);
    });

    it('should enforce GET method', async () => {
      const invalidMethod = 'POST' as CaptioneerGETHttpMethod;
      await expect(
        mockClient.get(TEST_CONSTANTS.BASE_YOUTUBE_URL, { method: invalidMethod }),
      ).rejects.toThrow('Only GET requests are supported');
    });
  });
});
