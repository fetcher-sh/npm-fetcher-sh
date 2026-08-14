import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface GooglePlaySearchParams extends QueryParams {
  query: string;
}

/**
 * Google Play — `googleplay.fetcher.sh`.
 * App search, app details, reviews, permissions, data safety, and developer
 * catalogs.
 */
export class GooglePlayService extends BaseService {
  /** Search apps. `GET /api/googleplay/apps` */
  searchApps<T = any>(params: GooglePlaySearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/googleplay/apps", { ...options, params: { ...params, ...options?.params } });
  }

  /** An app's details. `GET /api/googleplay/apps/{appId}` */
  app<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/googleplay/apps/{appId}", { appId }, options);
  }

  /** An app's reviews. `GET /api/googleplay/apps/{appId}/reviews` */
  appReviews<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/googleplay/apps/{appId}/reviews", { appId }, options);
  }

  /** An app's requested permissions. `GET /api/googleplay/apps/{appId}/permissions` */
  appPermissions<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/googleplay/apps/{appId}/permissions", { appId }, options);
  }

  /** An app's data-safety declarations. `GET /api/googleplay/apps/{appId}/datasafety` */
  appDataSafety<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/googleplay/apps/{appId}/datasafety", { appId }, options);
  }

  /** Apps similar to a given app. `GET /api/googleplay/apps/{appId}/similar` */
  appSimilar<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/googleplay/apps/{appId}/similar", { appId }, options);
  }

  /** A developer's catalog. `GET /api/googleplay/developers/{developerId}` */
  developer<T = any>(developerId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/googleplay/developers/{developerId}", { developerId }, options);
  }
}
