import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface TwitterSearchParams extends QueryParams {
  /** Search query. Accepts X's native search operators (`from:`, `min_faves:`, ...). */
  query: string;
  cursor?: string;
}

/**
 * Twitter / X — `twitter.fetcher.sh`.
 * Search tweets, resolve profiles, and pull timelines, replies, followers,
 * lists, and trends.
 */
export class TwitterService extends BaseService {
  /** Search tweets. `GET /api/twitter/search` */
  search<T = any>(params: TwitterSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/twitter/search", { ...options, params: { ...params, ...options?.params } });
  }

  /** Search user accounts. `GET /api/twitter/search/users` */
  searchUsers<T = any>(params: TwitterSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/twitter/search/users", { ...options, params: { ...params, ...options?.params } });
  }

  /** Trending topics. `GET /api/twitter/trends` */
  trends<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/twitter/trends", options);
  }

  /** Resolve a profile by @handle. `GET /api/twitter/handle/{handle}` */
  handle<T = any>(handle: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/handle/{handle}", { handle }, options);
  }

  /** Extended "about" info for a @handle. `GET /api/twitter/handle/{handle}/about` */
  handleAbout<T = any>(handle: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/handle/{handle}/about", { handle }, options);
  }

  /** A user by numeric id. `GET /api/twitter/user/{id}` */
  user<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/user/{id}", { id }, options);
  }

  /** A user's tweets. `GET /api/twitter/user/{id}/tweets` */
  userTweets<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/user/{id}/tweets", { id }, options);
  }

  /** A user's replies. `GET /api/twitter/user/{id}/replies` */
  userReplies<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/user/{id}/replies", { id }, options);
  }

  /** A user's followers. `GET /api/twitter/user/{id}/followers` */
  userFollowers<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/user/{id}/followers", { id }, options);
  }

  /** Accounts a user follows. `GET /api/twitter/user/{id}/followings` */
  userFollowings<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/user/{id}/followings", { id }, options);
  }

  /** A single tweet. `GET /api/twitter/tweet/{id}` */
  tweet<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/tweet/{id}", { id }, options);
  }

  /** Replies to a tweet. `GET /api/twitter/tweet/{id}/replies` */
  tweetReplies<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/tweet/{id}/replies", { id }, options);
  }

  /** Accounts that retweeted a tweet. `GET /api/twitter/tweet/{id}/retweeters` */
  tweetRetweeters<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/tweet/{id}/retweeters", { id }, options);
  }

  /** Members of a list. `GET /api/twitter/list/{id}/members` */
  listMembers<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/list/{id}/members", { id }, options);
  }

  /** Tweets in a list. `GET /api/twitter/list/{id}/tweets` */
  listTweets<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/twitter/list/{id}/tweets", { id }, options);
  }
}
