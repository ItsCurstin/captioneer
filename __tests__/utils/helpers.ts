// __tests__/utils/helpers.ts
// Test helpers and mocks

import { HttpClient, HttpResponse, RequestOptions } from '../../src/http/types';

export class MockHttpClient implements HttpClient {
  private responses: Map<string, { response: string; ok: boolean }> = new Map();

  setResponse(url: string, response: string | null, ok = true) {
    if (response === null) {
      this.responses.delete(url);
    } else {
      this.responses.set(url, { response, ok });
    }
  }

  async get(url: string, _options?: RequestOptions): Promise<HttpResponse> {
    const response = this.responses.get(url);
    if (!response) {
      throw new Error(`No mock response set for URL: ${url}`);
    }

    return {
      ok: response.ok,
      text: async () => response.response,
    };
  }
}

export const mockVideoPageResponse = (
  captionTracks: Array<{ baseUrl: string; languageCode: string }> = [],
) => {
  return `
    something before captions
    "captions":{"playerCaptionsTracklistRenderer":{"captionTracks":[${captionTracks
      .map((track) => `{"baseUrl":"${track.baseUrl}","languageCode":"${track.languageCode}"}`)
      .join(',')}]}},"videoDetails"
    something after captions
  `;
};

export const mockCaptionResponse = (
  entries: Array<{ start: string; dur: string; text: string }>,
) => {
  return entries
    .map((entry) => `<text start="${entry.start}" dur="${entry.dur}">${entry.text}</text>`)
    .join('\n');
};
