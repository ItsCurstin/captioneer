// __tests__/utils/setup.ts

import { expect } from 'vitest';
import { CaptionEntry } from '../../src';
import { CaptioneerError } from '../../src';
import { ErrorCode } from '../../src';

// Custom matcher types
declare module 'vitest' {
  interface Assertion {
    toBeValidCaptionEntry(): void;
    toMatchCaptionEntry(expected: Partial<CaptionEntry>): void;
    toThrowErrorWithCode(code: ErrorCode): void;
  }
}

// Types
export interface MockCaptionEntry {
  start: string;
  dur: string;
  text: string;
}

// Test Constants
export const TEST_CONSTANTS = {
  VALID_VIDEO_ID: 'dQw4w9WgXcQ',
  USER_AGENT: 'Mozilla/5.0 Test Agent',
  BASE_YOUTUBE_URL: 'https://www.youtube.com/watch?v=',
  MOCK_RESPONSES: {
    BASIC_CAPTIONS: [
      { start: '0.0', dur: '1.0', text: 'Hello' },
      { start: '1.0', dur: '2.0', text: 'World' },
    ],
    DISABLED_CAPTIONS: `
      {"playabilityStatus": {"status": "OK"}}
      something without captions
    `,
    INVALID_CAPTIONS: `
      "captions":{"invalid json"},"videoDetails"
    `,
    VIDEO_UNAVAILABLE: 'Video unavailable',
    TOO_MANY_REQUESTS: '<div class="g-recaptcha"></div>',
    MULTI_LANGUAGE: [
      { start: '0.0', dur: '1.0', text: 'Hello' },
      { start: '1.0', dur: '2.0', text: 'World' },
    ],
    SPANISH_CAPTIONS: [
      { start: '0.0', dur: '1.0', text: 'Hola' },
      { start: '1.0', dur: '2.0', text: 'Mundo' },
    ],
  },
  LANGUAGES: {
    ENGLISH: 'en',
    SPANISH: 'es',
    FRENCH: 'fr',
  },
  URLS: {
    CAPTIONS: {
      ENGLISH: 'http://captions.en.url',
      SPANISH: 'http://captions.es.url',
    },
  },
} as const;

// Custom Matchers
expect.extend({
  toBeValidCaptionEntry(received: unknown) {
    const isValid =
      Array.isArray(received) &&
      received.every(
        (entry) =>
          typeof entry.text === 'string' &&
          typeof entry.duration === 'number' &&
          typeof entry.offset === 'number' &&
          typeof entry.lang === 'string',
      );

    return {
      pass: isValid,
      message: () =>
        isValid
          ? `expected ${JSON.stringify(received)} not to be a valid caption entry`
          : `expected ${JSON.stringify(received)} to be a valid caption entry`,
    };
  },

  toMatchCaptionEntry(received: unknown, expected: Partial<CaptionEntry>) {
    const isCaptionEntry = (value: unknown): value is CaptionEntry => {
      return (
        value != null &&
        typeof value === 'object' &&
        'text' in value &&
        'duration' in value &&
        'offset' in value &&
        'lang' in value
      );
    };

    if (!isCaptionEntry(received)) {
      return {
        pass: false,
        message: () => `expected ${JSON.stringify(received)} to be a valid caption entry`,
      };
    }

    const matches = Object.entries(expected).every(
      ([key, value]) => received[key as keyof CaptionEntry] === value,
    );

    return {
      pass: matches,
      message: () =>
        matches
          ? `expected ${JSON.stringify(received)} not to match ${JSON.stringify(expected)}`
          : `expected ${JSON.stringify(received)} to match ${JSON.stringify(expected)}`,
    };
  },

  toThrowErrorWithCode(error: unknown, expectedCode: ErrorCode) {
    const hasCode = error instanceof CaptioneerError && error.code === expectedCode;

    return {
      pass: hasCode,
      message: () =>
        hasCode
          ? `expected error not to have code ${expectedCode}`
          : `expected error to have code ${expectedCode}, but got ${
              error instanceof CaptioneerError ? error.code : 'no code'
            }`,
    };
  },
});

// HTTP Client Mock
export class MockHttpClient {
  private responses: Map<string, { response: string; ok: boolean }> = new Map();

  setResponse(url: string, response: string, ok = true): void {
    this.responses.set(url, { response, ok });
  }

  async get(url: string): Promise<{ ok: boolean; text: () => Promise<string> }> {
    const mockResponse = this.responses.get(url);
    if (!mockResponse) {
      throw new Error(`No mock response set for URL: ${url}`);
    }

    return {
      ok: mockResponse.ok,
      text: async () => mockResponse.response,
    };
  }

  clearResponses(): void {
    this.responses.clear();
  }
}
