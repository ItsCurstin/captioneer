// src/core/types.ts

import { HttpClient } from '../http/types';

export interface CaptioneerConfig {
  lang?: string;
  httpClient?: HttpClient;
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
