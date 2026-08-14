import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface GoogleSearchParams extends QueryParams {
  query: string;
}

/**
 * Google Search — `google.fetcher.sh`.
 * Programmatic Google web search results as clean JSON.
 */
export class GoogleService extends BaseService {
  /** Web search. `GET /api/google/search` */
  search<T = any>(params: GoogleSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/google/search", { ...options, params: { ...params, ...options?.params } });
  }
}
