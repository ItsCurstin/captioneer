// src/utils/parsers.ts

import { CaptionEntry, CaptionTrackList, YouTubeCaptionsResponse } from '../core/types';
import { CaptionsDisabledError, ParseError } from '../errors/errors';

const XML_TRANSCRIPT_PATTERN = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

export function extractCaptionTracks(pageContent: string, videoId: string): CaptionTrackList {
  const captionsSection = pageContent.split('"captions":');

  if (captionsSection.length <= 1) {
    throw new CaptionsDisabledError(videoId);
  }

  try {
    const captionsJson = JSON.parse(
      captionsSection[1].split(',"videoDetails')[0].replace('\n', ''),
    ) as YouTubeCaptionsResponse;

    return captionsJson.playerCaptionsTracklistRenderer || { captionTracks: [] };
  } catch (error) {
    throw new ParseError('Failed to parse caption tracks', error);
  }
}

export function parseCaptionContent(content: string, languageCode: string): CaptionEntry[] {
  const matches = [...content.matchAll(XML_TRANSCRIPT_PATTERN)];

  if (matches.length === 0) {
    throw new ParseError('No caption entries found in content');
  }

  return matches.map((match) => ({
    text: match[3],
    duration: parseFloat(match[2]),
    offset: parseFloat(match[1]),
    lang: languageCode,
  }));
}
