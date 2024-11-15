// src/http/fetch-client.ts

import { HttpClient, HttpResponse, RequestOptions } from './types';

export class FetchHttpClient implements HttpClient {
  async get(url: string, options?: RequestOptions): Promise<HttpResponse> {
    const response = await fetch(url, {
      headers: options?.headers,
    });

    return {
      ok: response.ok,
      text: () => response.text(),
    };
  }
}
