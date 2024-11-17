// src/http/http-errors.ts

import { NetworkError } from '../errors/errors';

/**
 * Represents an HTTP timeout error when a request exceeds its time limit.
 * Thrown when a network request fails to complete within the specified timeout period.
 */
export class CaptioneerHttpTimeoutError extends NetworkError {
  constructor(message: string, cause?: unknown) {
    super(`Request timed out: ${message}`, cause);
    this.name = 'CaptioneerHttpTimeoutError';
  }
}

/**
 * Represents an HTTP rate limit error when API request limits are exceeded.
 * Thrown when too many requests are made within a specified time window.
 */
export class CaptioneerHttpRateLimitError extends NetworkError {
  constructor(message: string, cause?: unknown) {
    super(`Rate limit exceeded: ${message}`, cause);
    this.name = 'CaptioneerHttpRateLimitError';
  }
}
