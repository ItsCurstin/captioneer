// src/utils/validators.ts

/**
 * Validates and extracts YouTube video ID from various input formats
 */
export function validateVideoId(input: string): string {
  const YOUTUBE_URL_PATTERN =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

  // Direct video ID (11 characters)
  if (input.length === 11) {
    return input;
  }

  // URL format
  const match = input.match(YOUTUBE_URL_PATTERN);
  if (match?.[1]) {
    return match[1];
  }

  return '';
}

/**
 * Checks if a video ID is valid
 */
export function isValidVideoId(videoId: string): boolean {
  return validateVideoId(videoId).length === 11;
}
