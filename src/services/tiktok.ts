import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface TikTokPostSearchParams extends QueryParams {
  query: string;
  /** e.g. `MOST_LIKED`. */
  sortType?: string;
  /** e.g. `THIS_WEEK`. */
  dateRange?: string;
  cursor?: string;
}

/**
 * TikTok — `tiktok.fetcher.sh`.
 * Search posts, resolve users by handle, and pull followers, hashtags, music,
 * comments, and replies.
 */
export class TikTokService extends BaseService {
  /** Search posts. `GET /api/tiktok/post/search` */
  searchPosts<T = any>(params: TikTokPostSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/tiktok/post/search", { ...options, params: { ...params, ...options?.params } });
  }

  /** Resolve a post from its share URL. `GET /api/tiktok/post?url=...` */
  postByUrl<T = any>(url: string, options?: RequestOptions) {
    return this.getPath<T>("/api/tiktok/post", { ...options, params: { url, ...options?.params } });
  }

  /** A post by id. `GET /api/tiktok/post/{id}` */
  post<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/post/{id}", { id }, options);
  }

  /** A post's comments. `GET /api/tiktok/post/{id}/comments` */
  postComments<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/post/{id}/comments", { id }, options);
  }

  /** Replies to a comment. `GET /api/tiktok/post/{id}/comments/{commentId}/replies` */
  commentReplies<T = any>(id: string, commentId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/post/{id}/comments/{commentId}/replies", { id, commentId }, options);
  }

  /** Resolve a user by @username. `GET /api/tiktok/user/handle/{username}` */
  userByHandle<T = any>(username: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/user/handle/{username}", { username }, options);
  }

  /** A user's posts. `GET /api/tiktok/user/{id}/posts` */
  userPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/user/{id}/posts", { id }, options);
  }

  /** A user's followers. `GET /api/tiktok/user/{id}/followers` */
  userFollowers<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/user/{id}/followers", { id }, options);
  }

  /** Accounts a user follows. `GET /api/tiktok/user/{id}/followings` */
  userFollowings<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/user/{id}/followings", { id }, options);
  }

  /** Resolve a hashtag by name. `GET /api/tiktok/hashtag/handle/{name}` */
  hashtagByName<T = any>(name: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/hashtag/handle/{name}", { name }, options);
  }

  /** Posts under a hashtag id. `GET /api/tiktok/hashtag/{id}/posts` */
  hashtagPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/hashtag/{id}/posts", { id }, options);
  }

  /** Posts at a location. `GET /api/tiktok/location/{locationId}/posts` */
  locationPosts<T = any>(locationId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/location/{locationId}/posts", { locationId }, options);
  }

  /** Posts using a track. `GET /api/tiktok/music/{id}/posts` */
  musicPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/tiktok/music/{id}/posts", { id }, options);
  }
}
