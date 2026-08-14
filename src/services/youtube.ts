import { BaseService } from "./base.js";
import type { QueryParams, RequestOptions } from "../types.js";

export interface YouTubeSearchParams extends QueryParams {
  query: string;
  cursor?: string;
}

/**
 * YouTube — `youtube.fetcher.sh`.
 * Search videos, channels, and playlists; fetch video details, comments,
 * shorts, live streams, and trending.
 */
export class YouTubeService extends BaseService {
  /** Search videos. `GET /api/youtube/search/video` */
  searchVideo<T = any>(params: YouTubeSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/youtube/search/video", { ...options, params: { ...params, ...options?.params } });
  }

  /** Search channels. `GET /api/youtube/search/channel` */
  searchChannel<T = any>(params: YouTubeSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/youtube/search/channel", { ...options, params: { ...params, ...options?.params } });
  }

  /** Search playlists. `GET /api/youtube/search/playlist` */
  searchPlaylist<T = any>(params: YouTubeSearchParams, options?: RequestOptions) {
    return this.getPath<T>("/api/youtube/search/playlist", { ...options, params: { ...params, ...options?.params } });
  }

  /** Trending videos. `GET /api/youtube/trending` */
  trending<T = any>(options?: RequestOptions) {
    return this.getPath<T>("/api/youtube/trending", options);
  }

  /** Videos for a hashtag. `GET /api/youtube/hashtag/{tag}` */
  hashtag<T = any>(tag: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/hashtag/{tag}", { tag }, options);
  }

  /** A video's details. `GET /api/youtube/video/{id}` */
  video<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/video/{id}", { id }, options);
  }

  /** A video's comments. `GET /api/youtube/video/{id}/comments` */
  videoComments<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/video/{id}/comments", { id }, options);
  }

  /** A short's details. `GET /api/youtube/shorts/{id}` */
  shorts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/shorts/{id}", { id }, options);
  }

  /** A channel by id. `GET /api/youtube/channel/{id}` */
  channel<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/channel/{id}", { id }, options);
  }

  /** A channel by @handle. `GET /api/youtube/channel/handle/{handle}` */
  channelByHandle<T = any>(handle: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/channel/handle/{handle}", { handle }, options);
  }

  /** A channel by custom path. `GET /api/youtube/channel/path?path=...` */
  channelByPath<T = any>(path: string, options?: RequestOptions) {
    return this.getPath<T>("/api/youtube/channel/path", { ...options, params: { path, ...options?.params } });
  }

  /** A channel's videos. `GET /api/youtube/channel/{id}/videos` */
  channelVideos<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/channel/{id}/videos", { id }, options);
  }

  /** A channel's shorts. `GET /api/youtube/channel/{id}/shorts` */
  channelShorts<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/channel/{id}/shorts", { id }, options);
  }

  /** A channel's live streams. `GET /api/youtube/channel/{id}/live-streams` */
  channelLiveStreams<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/channel/{id}/live-streams", { id }, options);
  }

  /** Videos in a playlist. `GET /api/youtube/playlist/{id}/videos` */
  playlistVideos<T = any>(id: string, options?: RequestOptions) {
    return this.getTemplate<T>("/api/youtube/playlist/{id}/videos", { id }, options);
  }
}
