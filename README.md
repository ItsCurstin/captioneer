# Captioneer

A powerful TypeScript library for fetching YouTube video transcripts with ease.

[![Build Status](https://github.com/CurstinJR/captioneer/actions/workflows/ci.yml/badge.svg)](https://github.com/CurstinJR/captioneer/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/CurstinJR/captioneer/branch/main/graph/badge.svg)](https://codecov.io/gh/CurstinJR/captioneer)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/captioneer)](https://bundlephobia.com/package/captioneer)
[![npm downloads](https://img.shields.io/npm/dm/captioneer)](https://www.npmjs.com/package/captioneer)
[![npm version](https://badge.fury.io/js/captioneer.svg)](https://www.npmjs.com/package/captioneer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 Fetch transcripts from any YouTube video
- 🌍 Support for multiple languages
- 💪 Type-safe with full TypeScript support
- ⚡ Modern ESM and CommonJS support
- 🛡️ Robust error handling
- 🧪 Well-tested and reliable

## Installation

```bash
npm install captioneer
# or
yarn add captioneer
# or
pnpm add captioneer
```

## Usage

### Basic Example

```typescript
import { Captioneer } from 'captioneer';

const captioneer = new Captioneer();

// Fetch captions for a video
const captions = await captioneer.fetchCaptions('dQw4w9WgXcQ');
console.log(captions);
```

### With Language Selection

```typescript
const captions = await captioneer.fetchCaptions('dQw4w9WgXcQ', {
  lang: 'es' // Fetch Spanish captions
});
```

### Error Handling

```typescript
import { Captioneer, isCaptioneerError, ErrorCode } from 'captioneer';

try {
  const captions = await captioneer.fetchCaptions('VIDEO_ID');
} catch (error) {
  if (isCaptioneerError(error)) {
    switch (error.code) {
      case ErrorCode.LANGUAGE_NOT_AVAILABLE:
        console.log('Language not available:', error.details.availableLanguages);
        break;
      case ErrorCode.VIDEO_UNAVAILABLE:
        console.log('Video is not available');
        break;
      // Handle other specific errors
    }
  }
}
```

## API Reference

### Captioneer

Main class for interacting with YouTube transcripts.

**Methods**

`fetchCaptions(videoId: string, config?: CaptioneerConfig): Promise<CaptionEntry[]>`

Fetches captions for a YouTube video.

- videoId: YouTube video ID or URL
- config: Optional configuration object
    - lang: Language code (e.g., 'en', 'es')

Returns an array of caption entries.

### Types

```typescript
interface CaptionEntry {
  text: string;
  duration: number;
  offset: number;
  lang: string;
}

interface CaptioneerConfig {
  lang?: string;
}
```

### Error Handling

The library provides specific error types for different scenarios:

- TooManyRequestsError: Rate limiting detected
- VideoUnavailableError: Video not accessible
- CaptionsDisabledError: Captions are disabled
- LanguageNotAvailableError: Requested language not available
- InvalidVideoIdError: Invalid video ID format
- NetworkError: Network-related issues
- ParseError: Response parsing failed

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the library
pnpm build

# Run linting
pnpm lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by ItsCurstin