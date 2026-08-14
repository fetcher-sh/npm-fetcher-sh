import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface GoogleMapsSearchParams extends QueryParams {
  query: string;
}

/**
 * Google Maps — `google-maps.fetcher.sh`.
 * Place search, place details, and reviews.
 */
export class GoogleMapsService extends BaseService {
  /** Search places. `GET /api/google-maps/place/search` */
  searchPlaces<T = any>(params: GoogleMapsSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/google-maps/place/search", { ...options, params: { ...params, ...options?.params } });
  }

  /** A place's details by feature id. `GET /api/google-maps/place/{fid}` */
  place<T = any>(fid: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/google-maps/place/{fid}", { fid }, options);
  }

  /** A place's reviews. `GET /api/google-maps/place/{fid}/reviews` */
  placeReviews<T = any>(fid: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/google-maps/place/{fid}/reviews", { fid }, options);
  }

  /** A single review. `GET /api/google-maps/review/{id}` */
  review<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/google-maps/review/{id}", { id }, options);
  }
}
