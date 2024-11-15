// __tests__/errors/errors.test.ts

import { describe, expect, it } from 'vitest';
import { CaptioneerError, TooManyRequestsError, hasErrorCode, isCaptioneerError } from '../../src';
import { ErrorCode } from '../../src';

describe('Captioneer Errors', () => {
  describe('Base Error', () => {
    it('should create error with correct properties', () => {
      const error = new CaptioneerError('Test error');

      expect(error.message).toContain('Test error');
      expect(error.code).toBe(ErrorCode.GENERIC);
      expect(error.details).toBeDefined();
      expect(error.timestamp).toBeDefined();
    });

    it('should properly serialize to JSON', () => {
      const error = new CaptioneerError('Test error');
      const json = error.toJSON();

      expect(json).toMatchObject({
        code: ErrorCode.GENERIC,
        message: expect.stringContaining('Test error'),
        timestamp: expect.any(String),
      });
    });
  });

  describe('Error Type Guards', () => {
    it('should correctly identify CaptioneerError', () => {
      const error = new TooManyRequestsError();
      const regularError = new Error('Regular error');

      expect(isCaptioneerError(error)).toBe(true);
      expect(isCaptioneerError(regularError)).toBe(false);
    });

    it('should correctly check error codes', () => {
      const error = new TooManyRequestsError();

      expect(hasErrorCode(error, ErrorCode.TOO_MANY_REQUESTS)).toBe(true);
      expect(hasErrorCode(error, ErrorCode.GENERIC)).toBe(false);
    });
  });

  describe('Error Inheritance', () => {
    it('should maintain proper inheritance chain', () => {
      const error = new TooManyRequestsError();

      expect(error).toBeInstanceOf(CaptioneerError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
