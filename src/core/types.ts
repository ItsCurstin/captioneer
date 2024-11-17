// src/core/types.ts

import { CaptioneerHttpClient } from '../http/types';

export interface CaptioneerConfig {
  lang?: string;
  httpClient?: CaptioneerHttpClient;
}

export interface CaptionEntry {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

export interface CaptionSource {
  baseUrl: string;
  languageCode: string;
}

export interface CaptionTrackList {
  captionTracks?: CaptionSource[];
}

export interface YouTubeCaptionsResponse {
  playerCaptionsTracklistRenderer?: CaptionTrackList;
}
