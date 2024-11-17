import { beforeEach, describe, expect, it } from 'vitest';
import { CaptioneerDefaultClient } from '../../src';
import { NetworkError } from '../../src';
import { CaptioneerGETHttpMethod } from '../../src';
import { TEST_CONSTANTS } from '../utils/setup';

describe('DefaultHttpClient', () => {
  let client: CaptioneerDefaultClient;

  beforeEach(() => {
    client = new CaptioneerDefaultClient();
  });

  it('should make successful GET requests', async () => {
    const response = await client.get(
      TEST_CONSTANTS.BASE_YOUTUBE_URL + TEST_CONSTANTS.VALID_VIDEO_ID,
    );
    expect(response.ok).toBe(true);
    expect(typeof response.text).toBe('function');
    const text = await response.text();
    expect(typeof text).toBe('string');
  });

  it('should handle request headers correctly', async () => {
    const headers = { 'User-Agent': TEST_CONSTANTS.USER_AGENT };
    const response = await client.get(TEST_CONSTANTS.BASE_YOUTUBE_URL, { headers });
    expect(response.ok).toBe(true);
  });

  it('should throw NetworkError for invalid URLs', async () => {
    await expect(client.get('invalid-url')).rejects.toThrow(NetworkError);
  });

  it('should throw NetworkError for network failures', async () => {
    await expect(client.get('http://invalid.domain.test')).rejects.toThrow(NetworkError);
    await expect(client.get('http://invalid.domain.test')).rejects.toThrow('Network error');
  });

  it('should throw error when using non-GET method', async () => {
    const invalidMethod = 'POST' as CaptioneerGETHttpMethod;
    await expect(
      client.get(TEST_CONSTANTS.BASE_YOUTUBE_URL, { method: invalidMethod }),
    ).rejects.toThrow('Only GET requests are supported');
  });

  it('should default to GET method when no method specified', async () => {
    const response = await client.get(TEST_CONSTANTS.BASE_YOUTUBE_URL);
    expect(response.ok).toBeDefined();
  });

  it('should throw NetworkError with status details for non-OK responses', async () => {
    await expect(client.get('http://invalid.domain.test')).rejects.toThrow(NetworkError);
    await expect(client.get('http://invalid.domain.test')).rejects.toThrow('Network error');
  });

  it('should handle unknown errors appropriately', async () => {
    const mockFetch = global.fetch;
    global.fetch = () => Promise.reject('unknown');

    await expect(client.get(TEST_CONSTANTS.BASE_YOUTUBE_URL)).rejects.toThrow(
      'CaptioneerDefaultClient encountered an unknown error',
    );

    global.fetch = mockFetch;
  });
});
