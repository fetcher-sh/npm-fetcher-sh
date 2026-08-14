import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface InstagramSearchParams extends QueryParams {
  query: string;
  cursor?: string;
}

/**
 * Instagram — `instagram.fetcher.sh`.
 * Profiles, posts, reels, stories, followers, hashtags, locations, and comment
 * threads.
 */
export class InstagramService extends BaseService {
  /** Search users. `GET /api/instagram/user/search` */
  searchUsers<T = any>(params: InstagramSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/instagram/user/search", { ...options, params: { ...params, ...options?.params } });
  }

  /** Resolve a profile by @handle. `GET /api/instagram/user/handle/{handle}` */
  userByHandle<T = any>(handle: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/handle/{handle}", { handle }, options);
  }

  /** Resolve a numeric user id from a @handle. `GET /api/instagram/userid/{handle}` */
  userId<T = any>(handle: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/userid/{handle}", { handle }, options);
  }

  /** A user by numeric id. `GET /api/instagram/user/{id}` */
  user<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}", { id }, options);
  }

  /** A user's posts. `GET /api/instagram/user/{id}/posts` */
  userPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}/posts", { id }, options);
  }

  /** Posts a user is tagged in. `GET /api/instagram/user/{id}/posts/tagged` */
  userTaggedPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}/posts/tagged", { id }, options);
  }

  /** A user's reels. `GET /api/instagram/user/{id}/reels` */
  userReels<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}/reels", { id }, options);
  }

  /** A user's stories. `GET /api/instagram/user/{id}/stories` */
  userStories<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}/stories", { id }, options);
  }

  /** A user's followers. `GET /api/instagram/user/{id}/followers` */
  userFollowers<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}/followers", { id }, options);
  }

  /** Accounts a user follows. `GET /api/instagram/user/{id}/followings` */
  userFollowings<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/user/{id}/followings", { id }, options);
  }

  /** A post by shortcode. `GET /api/instagram/post/code/{code}` */
  postByCode<T = any>(code: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/post/code/{code}", { code }, options);
  }

  /** A post's comments. `GET /api/instagram/post/{id}/comments` */
  postComments<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/post/{id}/comments", { id }, options);
  }

  /** Posts under a hashtag. `GET /api/instagram/hashtag/{name}/posts` */
  hashtagPosts<T = any>(name: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/hashtag/{name}/posts", { name }, options);
  }

  /** Reels under a hashtag. `GET /api/instagram/hashtag/{name}/reels` */
  hashtagReels<T = any>(name: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/hashtag/{name}/reels", { name }, options);
  }

  /** Posts at a location. `GET /api/instagram/location/{id}/posts` */
  locationPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/location/{id}/posts", { id }, options);
  }

  /** Posts using an audio track. `GET /api/instagram/audio/{id}/posts` */
  audioPosts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/instagram/audio/{id}/posts", { id }, options);
  }
}
