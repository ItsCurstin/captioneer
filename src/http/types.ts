// src/http/types.ts

export type CaptioneerGETHttpMethod = 'GET';

export interface CaptioneerHttpClient {
  get(url: string, options?: CaptioneerRequestOptions): Promise<CaptioneerHttpResponse>;
}

export interface CaptioneerRequestOptions {
  headers?: Record<string, string>;
  method?: CaptioneerGETHttpMethod;
}

export interface CaptioneerHttpResponse {
  ok: boolean;
  text(): Promise<string>;
}
