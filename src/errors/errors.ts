// src/errors/errors.ts

import { ErrorCode } from './codes';

/**
 * Interface for error details
 */
export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  timestamp: string;
  videoId?: string;
  availableLanguages?: string[];
  requestedLanguage?: string;
  originalError?: unknown;
}

/**
 * Base error class for YouTube transcript related errors
 */
export class CaptioneerError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: string;
  public readonly details: ErrorDetails;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.GENERIC,
    details?: Partial<ErrorDetails>,
  ) {
    super(`[Captioneer] 🚨 ${message}`);
    this.name = 'CaptioneerError';
    this.code = code;
    this.timestamp = new Date().toISOString();

    this.details = {
      code,
      message,
      timestamp: this.timestamp,
      ...details,
    };

    Object.setPrototypeOf(this, CaptioneerError.prototype);
  }

  /**
   * Converts error to a plain object for logging or serialization
   */
  public toJSON(): ErrorDetails {
    return this.details;
  }

  /**
   * Creates a formatted string representation of the error
   */
  public toString(): string {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}

/**
 * Error thrown when YouTube is rate limiting requests
 */
export class TooManyRequestsError extends CaptioneerError {
  constructor() {
    super(
      'YouTube is receiving too many requests from this IP and now requires solving a captcha to continue',
      ErrorCode.TOO_MANY_REQUESTS,
    );
    this.name = 'TooManyRequestsError';
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

/**
 * Error thrown when the video is no longer available
 */
export class VideoUnavailableError extends CaptioneerError {
  constructor(videoId: string) {
    super(`The video is no longer available (${videoId})`, ErrorCode.VIDEO_UNAVAILABLE, {
      videoId,
    });
    this.name = 'VideoUnavailableError';
    Object.setPrototypeOf(this, VideoUnavailableError.prototype);
  }
}

/**
 * Error thrown when transcripts are disabled for the video
 */
export class CaptionsDisabledError extends CaptioneerError {
  constructor(videoId: string) {
    super(`Transcript is disabled on this video (${videoId})`, ErrorCode.CAPTIONS_DISABLED, {
      videoId,
    });
    this.name = 'CaptionsDisabledError';
    Object.setPrototypeOf(this, CaptionsDisabledError.prototype);
  }
}

/**
 * Error thrown when no transcripts are available
 */
export class CaptionsNotAvailableError extends CaptioneerError {
  constructor(videoId: string) {
    super(
      `No transcripts are available for this video (${videoId})`,
      ErrorCode.CAPTIONS_NOT_AVAILABLE,
      { videoId },
    );
    this.name = 'CaptionsNotAvailableError';
    Object.setPrototypeOf(this, CaptionsNotAvailableError.prototype);
  }
}

/**
 * Error thrown when the requested language is not available
 */
export class LanguageNotAvailableError extends CaptioneerError {
  constructor(lang: string, availableLangs: string[], videoId: string) {
    super(
      `No transcripts are available in ${lang} for this video (${videoId}). Available languages: ${availableLangs.join(
        ', ',
      )}`,
      ErrorCode.LANGUAGE_NOT_AVAILABLE,
      {
        videoId,
        requestedLanguage: lang,
        availableLanguages: availableLangs,
      },
    );
    this.name = 'LanguageNotAvailableError';
    Object.setPrototypeOf(this, LanguageNotAvailableError.prototype);
  }
}

/**
 * Error thrown when the video ID cannot be parsed
 */
export class InvalidVideoIdError extends CaptioneerError {
  constructor(videoId: string) {
    super(`Invalid YouTube video ID or URL: ${videoId}`, ErrorCode.INVALID_VIDEO_ID, { videoId });
    this.name = 'InvalidVideoIdError';
    Object.setPrototypeOf(this, InvalidVideoIdError.prototype);
  }
}

/**
 * Error thrown when there's a network-related issue
 */
export class NetworkError extends CaptioneerError {
  constructor(message: string, originalError?: unknown) {
    super(`Network error: ${message}`, ErrorCode.NETWORK_ERROR, { originalError });
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error thrown when parsing the YouTube page or transcript fails
 */
export class ParseError extends CaptioneerError {
  constructor(message: string, originalError?: unknown) {
    super(`Failed to parse response: ${message}`, ErrorCode.PARSE_ERROR, { originalError });
    this.name = 'ParseError';
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}

/**
 * Type guard to check if an error is a YoutubeTranscriptError
 */
export function isCaptioneerError(error: unknown): error is CaptioneerError {
  return error instanceof CaptioneerError;
}

/**
 * Helper function to check if an error has a specific error code
 */
export function hasErrorCode(error: unknown, code: ErrorCode): boolean {
  return isCaptioneerError(error) && error.code === code;
}

/**
 * Export all error-related items in a single object
 */
export const YoutubeTranscriptErrors = {
  ErrorCode,
  YoutubeTranscriptError: CaptioneerError,
  YoutubeTranscriptTooManyRequestError: TooManyRequestsError,
  YoutubeTranscriptVideoUnavailableError: VideoUnavailableError,
  YoutubeTranscriptDisabledError: CaptionsDisabledError,
  YoutubeTranscriptNotAvailableError: CaptionsNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError: LanguageNotAvailableError,
  YoutubeTranscriptInvalidVideoIdError: InvalidVideoIdError,
  YoutubeTranscriptNetworkError: NetworkError,
  YoutubeTranscriptParseError: ParseError,
  isYoutubeTranscriptError: isCaptioneerError,
  hasErrorCode,
} as const;
