// src/core/captioneer.ts

import {
  CaptioneerError,
  CaptionsNotAvailableError,
  InvalidVideoIdError,
  LanguageNotAvailableError,
  NetworkError,
  TooManyRequestsError,
  VideoUnavailableError,
} from '../errors/errors';
import { FetchHttpClient } from '../http/fetch-client';
import { HttpClient } from '../http/types';
import { extractCaptionTracks, parseCaptionContent } from '../utils/parsers';
import { validateVideoId } from '../utils/validators';
import { CaptionEntry, CaptionSource, CaptionTrackList, CaptioneerConfig } from './types';

export class Captioneer {
  private static readonly USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';

  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? new FetchHttpClient();
  }

  public async fetchCaptions(
    videoId: string,
    config?: Omit<CaptioneerConfig, 'httpClient'>,
  ): Promise<CaptionEntry[]> {
    try {
      const identifier = this.validateAndExtractVideoId(videoId);
      const headers = this.buildHeaders(config?.lang);

      const videoPageBody = await this.fetchVideoPage(identifier, headers);
      const captions = extractCaptionTracks(videoPageBody, identifier);
      const captionTrack = this.selectCaptionTrack(identifier, captions, config?.lang);

      const captionContent = await this.fetchCaptionContent(captionTrack, headers);
      return parseCaptionContent(captionContent, config?.lang ?? captionTrack.languageCode);
    } catch (error) {
      if (error instanceof CaptioneerError) {
        throw error;
      }
      throw new NetworkError('An unexpected error occurred while fetching captions', error);
    }
  }

  private validateAndExtractVideoId(videoId: string): string {
    const identifier = validateVideoId(videoId);
    if (!identifier) {
      throw new InvalidVideoIdError(videoId);
    }
    return identifier;
  }

  private buildHeaders(lang?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': Captioneer.USER_AGENT,
    };

    if (lang) {
      headers['Accept-Language'] = lang;
    }

    return headers;
  }

  private async fetchVideoPage(videoId: string, headers: Record<string, string>): Promise<string> {
    const response = await this.httpClient
      .get(`https://www.youtube.com/watch?v=${videoId}`, { headers })
      .catch((error) => {
        throw new NetworkError('Failed to fetch video page', error);
      });

    const pageContent = await response.text();

    if (pageContent.includes('class="g-recaptcha"')) {
      throw new TooManyRequestsError();
    }

    if (!pageContent.includes('"playabilityStatus":')) {
      throw new VideoUnavailableError(videoId);
    }

    return pageContent;
  }

  private async fetchCaptionContent(
    captionTrack: CaptionSource,
    headers: Record<string, string>,
  ): Promise<string> {
    const response = await this.httpClient.get(captionTrack.baseUrl, { headers }).catch((error) => {
      throw new NetworkError('Failed to fetch captions', error);
    });

    if (!response.ok) {
      throw new CaptionsNotAvailableError(captionTrack.languageCode);
    }

    return response.text();
  }

  private selectCaptionTrack(
    videoId: string,
    captions: CaptionTrackList,
    requestedLang?: string,
  ): CaptionSource {
    if (!captions.captionTracks?.length) {
      throw new CaptionsNotAvailableError(videoId);
    }

    if (requestedLang) {
      const track = captions.captionTracks.find((track) => track.languageCode === requestedLang);
      if (!track) {
        throw new LanguageNotAvailableError(
          requestedLang,
          captions.captionTracks.map((track) => track.languageCode),
          videoId,
        );
      }
      return track;
    }

    return captions.captionTracks[0];
  }
}
