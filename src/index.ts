// src/index.ts

// Core
export { Captioneer } from './core/captioneer';
export { CaptioneerDefaultClient } from './http/captioneer-default-client';

// Types
export type {
  CaptioneerHttpClient,
  CaptioneerHttpResponse,
  CaptioneerRequestOptions,
  CaptioneerGETHttpMethod,
} from './http/types';

export type { CaptioneerHttpTimeoutError, CaptioneerHttpRateLimitError } from './http/http-errors';

export type {
  CaptionEntry,
  CaptionSource,
  CaptionTrackList,
  CaptioneerConfig,
} from './core/types';

// Error system
export {
  CaptioneerError,
  TooManyRequestsError,
  VideoUnavailableError,
  CaptionsDisabledError,
  CaptionsNotAvailableError,
  LanguageNotAvailableError,
  InvalidVideoIdError,
  NetworkError,
  ParseError,
  isCaptioneerError,
  hasErrorCode,
} from './errors/errors';

export { ErrorCode } from './errors/codes';
