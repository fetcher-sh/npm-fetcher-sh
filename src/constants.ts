/** Default root host. Every endpoint in the catalog is served from here. */
export const DEFAULT_BASE_URL = "https://fetcher.sh";

/** Environment variable read for the API key when none is passed explicitly. */
export const API_KEY_ENV = "FETCHER_API_KEY";

/** Networks accepted for x402 payment (CAIP-2 identifiers). */
export const SUPPORTED_NETWORKS = [
  "eip155:8453", // Base
  "eip155:137", // Polygon
  "eip155:42161", // Arbitrum
  "eip155:143", // Monad
  "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", // Solana
] as const;

/** Per-service metadata: dedicated host and human-readable summary. */
export interface ServiceInfo {
  key: string;
  name: string;
  host: string;
  endpoints: number;
  summary: string;
}

export const SERVICES: Record<string, ServiceInfo> = {
  twitter: {
    key: "twitter",
    name: "Twitter / X",
    host: "https://twitter.fetcher.sh",
    endpoints: 15,
    summary:
      "Search tweets, resolve profiles by handle or ID, and pull timelines, replies, followers, lists, and trends.",
  },
  youtube: {
    key: "youtube",
    name: "YouTube",
    host: "https://youtube.fetcher.sh",
    endpoints: 15,
    summary:
      "Search videos, channels, and playlists; fetch video details, comments, shorts, live streams, and trending.",
  },
  tiktok: {
    key: "tiktok",
    name: "TikTok",
    host: "https://tiktok.fetcher.sh",
    endpoints: 13,
    summary:
      "Search posts, resolve users by handle, and pull followers, hashtags, music, comments, and replies.",
  },
  instagram: {
    key: "instagram",
    name: "Instagram",
    host: "https://instagram.fetcher.sh",
    endpoints: 16,
    summary:
      "Profiles, posts, reels, stories, followers, hashtags, locations, and comment threads.",
  },
  reddit: {
    key: "reddit",
    name: "Reddit",
    host: "https://reddit.fetcher.sh",
    endpoints: 15,
    summary:
      "Search posts, subreddits, and users; pull hot/new/top/best feeds, comment trees, and user history.",
  },
  google: {
    key: "google",
    name: "Google Search",
    host: "https://google.fetcher.sh",
    endpoints: 1,
    summary: "Programmatic Google web search results as clean JSON.",
  },
  googleMaps: {
    key: "googleMaps",
    name: "Google Maps",
    host: "https://google-maps.fetcher.sh",
    endpoints: 4,
    summary: "Place search, place details, and reviews.",
  },
  googleNews: {
    key: "googleNews",
    name: "Google News",
    host: "https://google-news.fetcher.sh",
    endpoints: 12,
    summary:
      "Headlines by section (world, business, technology, ...), keyword search, topics, and article URL decoding.",
  },
  googlePlay: {
    key: "googlePlay",
    name: "Google Play",
    host: "https://googleplay.fetcher.sh",
    endpoints: 7,
    summary:
      "App search, app details, reviews, permissions, data safety, and developer catalogs.",
  },
  appStore: {
    key: "appStore",
    name: "App Store",
    host: "https://appstore.fetcher.sh",
    endpoints: 9,
    summary:
      "Apple App Store app and bundle lookups, reviews, similar apps, and developer catalogs.",
  },
  yelp: {
    key: "yelp",
    name: "Yelp",
    host: "https://yelp.fetcher.sh",
    endpoints: 4,
    summary:
      "Business search by query and location, place details, and reviews.",
  },
};

/** A single priced endpoint in the catalog. */
export interface EndpointInfo {
  service: string;
  method: "GET";
  path: string;
  price: number;
  label: string;
}

/**
 * The full catalog of 111 priced GET endpoints, mirrored from
 * https://fetcher.sh/llms.txt. Prices are USD per call, settled in USDC.
 */
export const ENDPOINTS: EndpointInfo[] = [
  // Twitter / X
  { service: "twitter", method: "GET", path: "/api/twitter/handle/{handle}", price: 0.005, label: "Handle" },
  { service: "twitter", method: "GET", path: "/api/twitter/handle/{handle}/about", price: 0.005, label: "Handle about" },
  { service: "twitter", method: "GET", path: "/api/twitter/list/{id}/members", price: 0.005, label: "List members" },
  { service: "twitter", method: "GET", path: "/api/twitter/list/{id}/tweets", price: 0.005, label: "List tweets" },
  { service: "twitter", method: "GET", path: "/api/twitter/search", price: 0.005, label: "Search" },
  { service: "twitter", method: "GET", path: "/api/twitter/search/users", price: 0.005, label: "Search users" },
  { service: "twitter", method: "GET", path: "/api/twitter/trends", price: 0.005, label: "Trends" },
  { service: "twitter", method: "GET", path: "/api/twitter/tweet/{id}", price: 0.002, label: "Tweet" },
  { service: "twitter", method: "GET", path: "/api/twitter/tweet/{id}/replies", price: 0.005, label: "Tweet replies" },
  { service: "twitter", method: "GET", path: "/api/twitter/tweet/{id}/retweeters", price: 0.005, label: "Tweet retweeters" },
  { service: "twitter", method: "GET", path: "/api/twitter/user/{id}", price: 0.005, label: "User" },
  { service: "twitter", method: "GET", path: "/api/twitter/user/{id}/followers", price: 0.005, label: "User followers" },
  { service: "twitter", method: "GET", path: "/api/twitter/user/{id}/followings", price: 0.005, label: "User followings" },
  { service: "twitter", method: "GET", path: "/api/twitter/user/{id}/replies", price: 0.005, label: "User replies" },
  { service: "twitter", method: "GET", path: "/api/twitter/user/{id}/tweets", price: 0.005, label: "User tweets" },

  // YouTube
  { service: "youtube", method: "GET", path: "/api/youtube/channel/handle/{handle}", price: 0.005, label: "Channel handle" },
  { service: "youtube", method: "GET", path: "/api/youtube/channel/path", price: 0.005, label: "Channel path" },
  { service: "youtube", method: "GET", path: "/api/youtube/channel/{id}", price: 0.005, label: "Channel" },
  { service: "youtube", method: "GET", path: "/api/youtube/channel/{id}/live-streams", price: 0.005, label: "Channel live streams" },
  { service: "youtube", method: "GET", path: "/api/youtube/channel/{id}/shorts", price: 0.005, label: "Channel shorts" },
  { service: "youtube", method: "GET", path: "/api/youtube/channel/{id}/videos", price: 0.005, label: "Channel videos" },
  { service: "youtube", method: "GET", path: "/api/youtube/hashtag/{tag}", price: 0.005, label: "Hashtag" },
  { service: "youtube", method: "GET", path: "/api/youtube/playlist/{id}/videos", price: 0.005, label: "Playlist videos" },
  { service: "youtube", method: "GET", path: "/api/youtube/search/channel", price: 0.005, label: "Search channel" },
  { service: "youtube", method: "GET", path: "/api/youtube/search/playlist", price: 0.005, label: "Search playlist" },
  { service: "youtube", method: "GET", path: "/api/youtube/search/video", price: 0.005, label: "Search video" },
  { service: "youtube", method: "GET", path: "/api/youtube/shorts/{id}", price: 0.005, label: "Shorts" },
  { service: "youtube", method: "GET", path: "/api/youtube/trending", price: 0.005, label: "Trending" },
  { service: "youtube", method: "GET", path: "/api/youtube/video/{id}", price: 0.005, label: "Video" },
  { service: "youtube", method: "GET", path: "/api/youtube/video/{id}/comments", price: 0.005, label: "Video comments" },

  // TikTok
  { service: "tiktok", method: "GET", path: "/api/tiktok/hashtag/handle/{name}", price: 0.004, label: "Hashtag handle" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/hashtag/{id}/posts", price: 0.004, label: "Hashtag posts" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/location/{locationId}/posts", price: 0.004, label: "Location posts" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/music/{id}/posts", price: 0.004, label: "Music posts" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/post", price: 0.004, label: "Post" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/post/search", price: 0.004, label: "Post search" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/post/{id}", price: 0.004, label: "Post by id" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/post/{id}/comments", price: 0.004, label: "Post comments" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/post/{id}/comments/{commentId}/replies", price: 0.004, label: "Post comment replies" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/user/handle/{username}", price: 0.004, label: "User handle" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/user/{id}/followers", price: 0.004, label: "User followers" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/user/{id}/followings", price: 0.004, label: "User followings" },
  { service: "tiktok", method: "GET", path: "/api/tiktok/user/{id}/posts", price: 0.004, label: "User posts" },

  // Instagram
  { service: "instagram", method: "GET", path: "/api/instagram/audio/{id}/posts", price: 0.004, label: "Audio posts" },
  { service: "instagram", method: "GET", path: "/api/instagram/hashtag/{name}/posts", price: 0.004, label: "Hashtag posts" },
  { service: "instagram", method: "GET", path: "/api/instagram/hashtag/{name}/reels", price: 0.004, label: "Hashtag reels" },
  { service: "instagram", method: "GET", path: "/api/instagram/location/{id}/posts", price: 0.004, label: "Location posts" },
  { service: "instagram", method: "GET", path: "/api/instagram/post/code/{code}", price: 0.004, label: "Post by code" },
  { service: "instagram", method: "GET", path: "/api/instagram/post/{id}/comments", price: 0.004, label: "Post comments" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/handle/{handle}", price: 0.004, label: "User handle" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/search", price: 0.004, label: "User search" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}", price: 0.004, label: "User" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}/followers", price: 0.004, label: "User followers" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}/followings", price: 0.004, label: "User followings" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}/posts", price: 0.004, label: "User posts" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}/posts/tagged", price: 0.004, label: "User tagged posts" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}/reels", price: 0.004, label: "User reels" },
  { service: "instagram", method: "GET", path: "/api/instagram/user/{id}/stories", price: 0.004, label: "User stories" },
  { service: "instagram", method: "GET", path: "/api/instagram/userid/{handle}", price: 0.004, label: "User id by handle" },

  // Reddit
  { service: "reddit", method: "GET", path: "/api/reddit/post/{id}", price: 0.002, label: "Post" },
  { service: "reddit", method: "GET", path: "/api/reddit/post/{id}/comments", price: 0.002, label: "Post comments" },
  { service: "reddit", method: "GET", path: "/api/reddit/post/{id}/comments/{commentId}/replies", price: 0.002, label: "Post comment replies" },
  { service: "reddit", method: "GET", path: "/api/reddit/posts/best", price: 0.002, label: "Posts best" },
  { service: "reddit", method: "GET", path: "/api/reddit/posts/hot", price: 0.002, label: "Posts hot" },
  { service: "reddit", method: "GET", path: "/api/reddit/posts/new", price: 0.002, label: "Posts new" },
  { service: "reddit", method: "GET", path: "/api/reddit/posts/top", price: 0.002, label: "Posts top" },
  { service: "reddit", method: "GET", path: "/api/reddit/search/post", price: 0.002, label: "Search post" },
  { service: "reddit", method: "GET", path: "/api/reddit/search/subreddit", price: 0.002, label: "Search subreddit" },
  { service: "reddit", method: "GET", path: "/api/reddit/search/user", price: 0.002, label: "Search user" },
  { service: "reddit", method: "GET", path: "/api/reddit/subreddit/{name}", price: 0.002, label: "Subreddit" },
  { service: "reddit", method: "GET", path: "/api/reddit/subreddit/{name}/posts", price: 0.002, label: "Subreddit posts" },
  { service: "reddit", method: "GET", path: "/api/reddit/user/{username}", price: 0.002, label: "User" },
  { service: "reddit", method: "GET", path: "/api/reddit/user/{username}/comments", price: 0.002, label: "User comments" },
  { service: "reddit", method: "GET", path: "/api/reddit/user/{username}/posts", price: 0.002, label: "User posts" },

  // Google Search
  { service: "google", method: "GET", path: "/api/google/search", price: 0.005, label: "Search" },

  // Google Maps
  { service: "googleMaps", method: "GET", path: "/api/google-maps/place/search", price: 0.005, label: "Place search" },
  { service: "googleMaps", method: "GET", path: "/api/google-maps/place/{fid}", price: 0.005, label: "Place" },
  { service: "googleMaps", method: "GET", path: "/api/google-maps/place/{fid}/reviews", price: 0.005, label: "Place reviews" },
  { service: "googleMaps", method: "GET", path: "/api/google-maps/review/{id}", price: 0.005, label: "Review" },

  // Google News
  { service: "googleNews", method: "GET", path: "/api/google-news/business", price: 0.005, label: "Business" },
  { service: "googleNews", method: "GET", path: "/api/google-news/decode-article-url", price: 0.005, label: "Decode article URL" },
  { service: "googleNews", method: "GET", path: "/api/google-news/entertainment", price: 0.005, label: "Entertainment" },
  { service: "googleNews", method: "GET", path: "/api/google-news/health", price: 0.005, label: "Health" },
  { service: "googleNews", method: "GET", path: "/api/google-news/language-regions", price: 0.005, label: "Language regions" },
  { service: "googleNews", method: "GET", path: "/api/google-news/latest", price: 0.005, label: "Latest" },
  { service: "googleNews", method: "GET", path: "/api/google-news/science", price: 0.005, label: "Science" },
  { service: "googleNews", method: "GET", path: "/api/google-news/search", price: 0.005, label: "Search" },
  { service: "googleNews", method: "GET", path: "/api/google-news/sport", price: 0.005, label: "Sport" },
  { service: "googleNews", method: "GET", path: "/api/google-news/technology", price: 0.005, label: "Technology" },
  { service: "googleNews", method: "GET", path: "/api/google-news/topic/{topicId}", price: 0.005, label: "Topic" },
  { service: "googleNews", method: "GET", path: "/api/google-news/world", price: 0.005, label: "World" },

  // Google Play
  { service: "googlePlay", method: "GET", path: "/api/googleplay/apps", price: 0.003, label: "Apps search" },
  { service: "googlePlay", method: "GET", path: "/api/googleplay/apps/{appId}", price: 0.003, label: "App" },
  { service: "googlePlay", method: "GET", path: "/api/googleplay/apps/{appId}/datasafety", price: 0.003, label: "App data safety" },
  { service: "googlePlay", method: "GET", path: "/api/googleplay/apps/{appId}/permissions", price: 0.003, label: "App permissions" },
  { service: "googlePlay", method: "GET", path: "/api/googleplay/apps/{appId}/reviews", price: 0.003, label: "App reviews" },
  { service: "googlePlay", method: "GET", path: "/api/googleplay/apps/{appId}/similar", price: 0.003, label: "App similar" },
  { service: "googlePlay", method: "GET", path: "/api/googleplay/developers/{developerId}", price: 0.003, label: "Developer" },

  // App Store
  { service: "appStore", method: "GET", path: "/api/appstore/apps", price: 0.003, label: "Apps search" },
  { service: "appStore", method: "GET", path: "/api/appstore/apps/{appId}", price: 0.003, label: "App" },
  { service: "appStore", method: "GET", path: "/api/appstore/apps/{appId}/reviews", price: 0.003, label: "App reviews" },
  { service: "appStore", method: "GET", path: "/api/appstore/apps/{appId}/similar", price: 0.003, label: "App similar" },
  { service: "appStore", method: "GET", path: "/api/appstore/bundles", price: 0.003, label: "Bundles search" },
  { service: "appStore", method: "GET", path: "/api/appstore/bundles/{bundleId}", price: 0.003, label: "Bundle" },
  { service: "appStore", method: "GET", path: "/api/appstore/bundles/{bundleId}/reviews", price: 0.003, label: "Bundle reviews" },
  { service: "appStore", method: "GET", path: "/api/appstore/bundles/{bundleId}/similar", price: 0.003, label: "Bundle similar" },
  { service: "appStore", method: "GET", path: "/api/appstore/developers/{developerId}", price: 0.003, label: "Developer" },

  // Yelp
  { service: "yelp", method: "GET", path: "/api/yelp/place/handle/{handle}", price: 0.003, label: "Place handle" },
  { service: "yelp", method: "GET", path: "/api/yelp/place/{id}", price: 0.003, label: "Place" },
  { service: "yelp", method: "GET", path: "/api/yelp/place/{id}/reviews", price: 0.003, label: "Place reviews" },
  { service: "yelp", method: "GET", path: "/api/yelp/search", price: 0.003, label: "Search" },
];
