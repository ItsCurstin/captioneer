// src/http/captioneer-default-client.ts

import { NetworkError } from '../errors/errors';
import { CaptioneerHttpClient, CaptioneerHttpResponse, CaptioneerRequestOptions } from './types';

export class CaptioneerDefaultClient implements CaptioneerHttpClient {
  async get(url: string, options?: CaptioneerRequestOptions): Promise<CaptioneerHttpResponse> {
    try {
      if (options?.method && options.method !== 'GET') {
        throw new NetworkError('Only GET requests are supported for fetching YouTube captions');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: options?.headers,
      });

      // Handle non-OK responses
      if (!response.ok) {
        throw new NetworkError(
          `Failed to fetch captions. Status: ${response.status} - ${response.statusText}`,
        );
      }

      return {
        ok: response.ok,
        text: () => response.text(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new NetworkError(`CaptioneerDefaultClient error: ${error.message}`, error);
      } else {
        throw new NetworkError('CaptioneerDefaultClient encountered an unknown error');
      }
    }
  }
}
