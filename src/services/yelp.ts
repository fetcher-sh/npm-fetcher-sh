import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface YelpSearchParams extends QueryParams {
  query: string;
  location?: string;
}

/**
 * Yelp — `yelp.fetcher.sh`.
 * Business search by query and location, place details, and reviews.
 */
export class YelpService extends BaseService {
  /** Search businesses. `GET /api/yelp/search` */
  search<T = any>(params: YelpSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/yelp/search", { ...options, params: { ...params, ...options?.params } });
  }

  /** A place by id. `GET /api/yelp/place/{id}` */
  place<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/yelp/place/{id}", { id }, options);
  }

  /** Resolve a place by @handle. `GET /api/yelp/place/handle/{handle}` */
  placeByHandle<T = any>(handle: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/yelp/place/handle/{handle}", { handle }, options);
  }

  /** A place's reviews. `GET /api/yelp/place/{id}/reviews` */
  placeReviews<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/yelp/place/{id}/reviews", { id }, options);
  }
}
