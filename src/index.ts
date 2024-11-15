// src/index.ts

// Core
export { Captioneer } from './core/captioneer';

// Types
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
