import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface GoogleNewsSearchParams extends QueryParams {
  query: string;
}

/**
 * Google News — `google-news.fetcher.sh`.
 * Headlines by section, keyword search, topics, and article URL decoding.
 */
export class GoogleNewsService extends BaseService {
  /** Keyword search. `GET /api/google-news/search` */
  search<T = any>(params: GoogleNewsSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/search", { ...options, params: { ...params, ...options?.params } });
  }

  /** Latest headlines. `GET /api/google-news/latest` */
  latest<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/latest", options);
  }

  /** World section. `GET /api/google-news/world` */
  world<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/world", options);
  }

  /** Business section. `GET /api/google-news/business` */
  business<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/business", options);
  }

  /** Technology section. `GET /api/google-news/technology` */
  technology<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/technology", options);
  }

  /** Entertainment section. `GET /api/google-news/entertainment` */
  entertainment<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/entertainment", options);
  }

  /** Sport section. `GET /api/google-news/sport` */
  sport<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/sport", options);
  }

  /** Science section. `GET /api/google-news/science` */
  science<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/science", options);
  }

  /** Health section. `GET /api/google-news/health` */
  health<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/health", options);
  }

  /** A specific topic. `GET /api/google-news/topic/{topicId}` */
  topic<T = any>(topicId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/google-news/topic/{topicId}", { topicId }, options);
  }

  /** Supported language/region codes. `GET /api/google-news/language-regions` */
  languageRegions<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/language-regions", options);
  }

  /** Decode a Google News article URL to its source. `GET /api/google-news/decode-article-url` */
  decodeArticleUrl<T = any>(url: string, options?: RequestOptions) {
    return this.getPath<T>("/api/google-news/decode-article-url", { ...options, params: { url, ...options?.params } });
  }
}
