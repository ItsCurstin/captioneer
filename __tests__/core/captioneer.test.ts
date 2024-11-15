// __tests__/core/captioneer.test.ts
// Core functionality tests

import { beforeEach, describe, expect, it } from 'vitest';
import { Captioneer } from '../../src';
import { ErrorCode } from '../../src';
import { MockHttpClient, mockCaptionResponse, mockVideoPageResponse } from '../utils/helpers';
import { MockCaptionEntry, TEST_CONSTANTS } from '../utils/setup';

describe('Captioneer', () => {
  let httpClient: MockHttpClient;
  let captioneer: Captioneer;
  const { VALID_VIDEO_ID, BASE_YOUTUBE_URL, MOCK_RESPONSES } = TEST_CONSTANTS;

  beforeEach(() => {
    httpClient = new MockHttpClient();
    captioneer = new Captioneer(httpClient);
  });

  describe('Video ID Validation', () => {
    const mockBasicCaption: MockCaptionEntry[] = [{ start: '0.0', dur: '1.0', text: 'Hello' }];

    const setupBasicMocks = (videoId: string) => {
      const videoPageResponse = mockVideoPageResponse([
        { baseUrl: 'http://captions.url', languageCode: 'en' },
      ]);

      httpClient.setResponse(
        `${BASE_YOUTUBE_URL}${videoId}`,
        videoPageResponse + '"playabilityStatus":{"status":"OK"}',
        true,
      );

      httpClient.setResponse('http://captions.url', mockCaptionResponse(mockBasicCaption), true);
    };

    it('should accept valid 11-character video ID', async () => {
      setupBasicMocks(VALID_VIDEO_ID);
      const result = await captioneer.fetchCaptions(VALID_VIDEO_ID);
      expect(result).toBeValidCaptionEntry();
    });

    it('should extract video ID from full YouTube URL', async () => {
      const fullUrl = `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`;
      setupBasicMocks(VALID_VIDEO_ID);
      const result = await captioneer.fetchCaptions(fullUrl);
      expect(result).toBeValidCaptionEntry();
    });

    it('should throw InvalidVideoIdError for invalid video ID', async () => {
      await expect(captioneer.fetchCaptions('invalid')).rejects.toThrowErrorWithCode(
        ErrorCode.INVALID_VIDEO_ID,
      );
    });
  });

  describe('Caption Fetching', () => {
    describe('Basic Functionality', () => {
      it('should fetch captions successfully', async () => {
        const videoPageResponse = mockVideoPageResponse([
          { baseUrl: 'http://captions.url', languageCode: 'en' },
        ]);

        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          videoPageResponse + '"playabilityStatus":{"status":"OK"}',
          true,
        );

        httpClient.setResponse(
          'http://captions.url',
          mockCaptionResponse([...MOCK_RESPONSES.BASIC_CAPTIONS]),
          true,
        );

        const result = await captioneer.fetchCaptions(VALID_VIDEO_ID);

        expect(result).toBeValidCaptionEntry();
        expect(result).toHaveLength(2);
        expect(result[0]).toMatchCaptionEntry({
          text: 'Hello',
          duration: 1.0,
          offset: 0.0,
          lang: 'en',
        });
        expect(result[1]).toMatchCaptionEntry({
          text: 'World',
          duration: 2.0,
          offset: 1.0,
          lang: 'en',
        });
      });

      it('should handle empty caption response', async () => {
        const videoPageResponse = mockVideoPageResponse([
          { baseUrl: 'http://captions.url', languageCode: 'en' },
        ]);

        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          videoPageResponse + '"playabilityStatus":{"status":"OK"}',
          true,
        );
        httpClient.setResponse('http://captions.url', '', true);

        await expect(captioneer.fetchCaptions(VALID_VIDEO_ID)).rejects.toThrowErrorWithCode(
          ErrorCode.PARSE_ERROR,
        );
      });
    });

    describe('Language Handling', () => {
      it('should handle language selection', async () => {
        const videoPageResponse = mockVideoPageResponse([
          { baseUrl: 'http://captions.en.url', languageCode: 'en' },
          { baseUrl: 'http://captions.es.url', languageCode: 'es' },
        ]);

        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          videoPageResponse + '"playabilityStatus":{"status":"OK"}',
          true,
        );

        httpClient.setResponse(
          'http://captions.es.url',
          mockCaptionResponse([{ start: '0.0', dur: '1.0', text: 'Hola' }]),
          true,
        );

        const result = await captioneer.fetchCaptions(VALID_VIDEO_ID, {
          lang: 'es',
        });

        expect(result).toBeValidCaptionEntry();
        expect(result[0]).toMatchCaptionEntry({
          text: 'Hola',
          lang: 'es',
        });
      });

      it('should throw LanguageNotAvailableError for unavailable language', async () => {
        const videoPageResponse = mockVideoPageResponse([
          { baseUrl: 'http://captions.url', languageCode: 'en' },
        ]);

        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          videoPageResponse + '"playabilityStatus":{"status":"OK"}',
          true,
        );

        await expect(
          captioneer.fetchCaptions(VALID_VIDEO_ID, { lang: 'es' }),
        ).rejects.toThrowErrorWithCode(ErrorCode.LANGUAGE_NOT_AVAILABLE);
      });
    });

    describe('Error Handling', () => {
      it('should handle too many requests error', async () => {
        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          MOCK_RESPONSES.TOO_MANY_REQUESTS,
          true,
        );

        await expect(captioneer.fetchCaptions(VALID_VIDEO_ID)).rejects.toThrowErrorWithCode(
          ErrorCode.TOO_MANY_REQUESTS,
        );
      });

      it('should handle video unavailable error', async () => {
        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          MOCK_RESPONSES.VIDEO_UNAVAILABLE,
          true,
        );

        await expect(captioneer.fetchCaptions(VALID_VIDEO_ID)).rejects.toThrowErrorWithCode(
          ErrorCode.VIDEO_UNAVAILABLE,
        );
      });

      it('should handle disabled captions', async () => {
        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          MOCK_RESPONSES.DISABLED_CAPTIONS,
          true,
        );

        await expect(captioneer.fetchCaptions(VALID_VIDEO_ID)).rejects.toThrowErrorWithCode(
          ErrorCode.CAPTIONS_DISABLED,
        );
      });

      it('should handle network errors', async () => {
        httpClient.setResponse(`${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`, null);

        await expect(captioneer.fetchCaptions(VALID_VIDEO_ID)).rejects.toThrowErrorWithCode(
          ErrorCode.NETWORK_ERROR,
        );
      });
    });

    describe('Error Details', () => {
      it('should include detailed error information for language errors', async () => {
        const videoPageResponse = mockVideoPageResponse([
          { baseUrl: 'http://captions.url', languageCode: 'en' },
        ]);

        httpClient.setResponse(
          `${BASE_YOUTUBE_URL}${VALID_VIDEO_ID}`,
          videoPageResponse + '"playabilityStatus":{"status":"OK"}',
          true,
        );

        const error = await captioneer
          .fetchCaptions(VALID_VIDEO_ID, { lang: 'es' })
          .catch((e) => e);

        expect(error.details).toMatchObject({
          code: ErrorCode.LANGUAGE_NOT_AVAILABLE,
          videoId: VALID_VIDEO_ID,
          requestedLanguage: 'es',
          availableLanguages: ['en'],
        });
      });
    });
  });
});
