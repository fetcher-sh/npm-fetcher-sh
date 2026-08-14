import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface RedditSearchParams extends QueryParams {
  query: string;
  cursor?: string;
}

/**
 * Reddit — `reddit.fetcher.sh`.
 * Search posts, subreddits, and users; pull hot/new/top/best feeds, comment
 * trees, and user history.
 */
export class RedditService extends BaseService {
  /** Search posts. `GET /api/reddit/search/post` */
  searchPosts<T = any>(params: RedditSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/search/post", { ...options, params: { ...params, ...options?.params } });
  }

  /** Search subreddits. `GET /api/reddit/search/subreddit` */
  searchSubreddits<T = any>(params: RedditSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/search/subreddit", { ...options, params: { ...params, ...options?.params } });
  }

  /** Search users. `GET /api/reddit/search/user` */
  searchUsers<T = any>(params: RedditSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/search/user", { ...options, params: { ...params, ...options?.params } });
  }

  /** Best posts feed. `GET /api/reddit/posts/best` */
  postsBest<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/posts/best", options);
  }

  /** Hot posts feed. `GET /api/reddit/posts/hot` */
  postsHot<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/posts/hot", options);
  }

  /** New posts feed. `GET /api/reddit/posts/new` */
  postsNew<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/posts/new", options);
  }

  /** Top posts feed. `GET /api/reddit/posts/top` */
  postsTop<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/reddit/posts/top", options);
  }

  /** A post by id. `GET /api/reddit/post/{id}` */
  post<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/post/{id}", { id }, options);
  }

  /** A post's comments. `GET /api/reddit/post/{id}/comments` */
  postComments<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/post/{id}/comments", { id }, options);
  }

  /** Replies to a comment. `GET /api/reddit/post/{id}/comments/{commentId}/replies` */
  commentReplies<T = any>(id: string, commentId: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/post/{id}/comments/{commentId}/replies", { id, commentId }, options);
  }

  /** A subreddit's metadata. `GET /api/reddit/subreddit/{name}` */
  subreddit<T = any>(name: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/subreddit/{name}", { name }, options);
  }

  /** A subreddit's posts. `GET /api/reddit/subreddit/{name}/posts` */
  subredditPosts<T = any>(name: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/subreddit/{name}/posts", { name }, options);
  }

  /** A user's profile. `GET /api/reddit/user/{username}` */
  user<T = any>(username: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/user/{username}", { username }, options);
  }

  /** A user's posts. `GET /api/reddit/user/{username}/posts` */
  userPosts<T = any>(username: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/user/{username}/posts", { username }, options);
  }

  /** A user's comments. `GET /api/reddit/user/{username}/comments` */
  userComments<T = any>(username: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/reddit/user/{username}/comments", { username }, options);
  }
}
