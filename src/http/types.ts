// src/http/types.ts

export interface HttpClient {
  get(url: string, options?: RequestOptions): Promise<HttpResponse>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
}

export interface HttpResponse {
  ok: boolean;
  text(): Promise<string>;
}
