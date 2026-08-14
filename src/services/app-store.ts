import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface AppStoreSearchParams extends QueryParams {
  query: string;
}

/**
 * App Store — `appstore.fetcher.sh`.
 * Apple App Store app and bundle lookups, reviews, similar apps, and developer
 * catalogs.
 */
export class AppStoreService extends BaseService {
  /** Search apps. `GET /api/appstore/apps` */
  searchApps<T = any>(params: AppStoreSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/appstore/apps", { ...options, params: { ...params, ...options?.params } });
  }

  /** An app's details. `GET /api/appstore/apps/{appId}` */
  app<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/apps/{appId}", { appId }, options);
  }

  /** An app's reviews. `GET /api/appstore/apps/{appId}/reviews` */
  appReviews<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/apps/{appId}/reviews", { appId }, options);
  }

  /** Apps similar to a given app. `GET /api/appstore/apps/{appId}/similar` */
  appSimilar<T = any>(appId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/apps/{appId}/similar", { appId }, options);
  }

  /** Search bundles. `GET /api/appstore/bundles` */
  searchBundles<T = any>(params: AppStoreSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/appstore/bundles", { ...options, params: { ...params, ...options?.params } });
  }

  /** A bundle's details. `GET /api/appstore/bundles/{bundleId}` */
  bundle<T = any>(bundleId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/bundles/{bundleId}", { bundleId }, options);
  }

  /** A bundle's reviews. `GET /api/appstore/bundles/{bundleId}/reviews` */
  bundleReviews<T = any>(bundleId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/bundles/{bundleId}/reviews", { bundleId }, options);
  }

  /** Bundles similar to a given bundle. `GET /api/appstore/bundles/{bundleId}/similar` */
  bundleSimilar<T = any>(bundleId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/bundles/{bundleId}/similar", { bundleId }, options);
  }

  /** A developer's catalog. `GET /api/appstore/developers/{developerId}` */
  developer<T = any>(developerId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/appstore/developers/{developerId}", { developerId }, options);
  }
}
