import { HttpClient } from "./http.js";
import { ENDPOINTS, SERVICES } from "./constants.js";
import type {
  EndpointInfo,
  ServiceInfo,
} from "./constants.js";
import type { FetcherOptions, RequestOptions } from "./types.js";
import { TwitterService } from "./services/twitter.js";
import { YouTubeService } from "./services/youtube.js";
import { TikTokService } from "./services/tiktok.js";
import { InstagramService } from "./services/instagram.js";
import { RedditService } from "./services/reddit.js";
import { GoogleService } from "./services/google.js";
import { GoogleMapsService } from "./services/google-maps.js";
import { GoogleNewsService } from "./services/google-news.js";
import { GooglePlayService } from "./services/google-play.js";
import { AppStoreService } from "./services/app-store.js";
import { YelpService } from "./services/yelp.js";
import { CreditsService } from "./services/credits.js";

/**
 * The fetcher.sh client — one balance, every service.
 *
 * ```ts
 * import { Fetcher } from "fetcher-sh";
 *
 * const fetcher = new Fetcher({ apiKey: process.env.FETCHER_API_KEY });
 * const results = await fetcher.twitter.search({ query: "x402" });
 * ```
 *
 * Omit `apiKey` and pass a payment-wrapped `fetch` (e.g. from `@x402/fetch`)
 * to pay per call with x402 instead of prepaid credits.
 */
export class Fetcher {
  private readonly http: HttpClient;

  readonly twitter: TwitterService;
  /** Alias of {@link twitter}. */
  readonly x: TwitterService;
  readonly youtube: YouTubeService;
  readonly tiktok: TikTokService;
  readonly instagram: InstagramService;
  readonly reddit: RedditService;
  readonly google: GoogleService;
  readonly googleMaps: GoogleMapsService;
  readonly googleNews: GoogleNewsService;
  readonly googlePlay: GooglePlayService;
  readonly appStore: AppStoreService;
  readonly yelp: YelpService;
  readonly credits: CreditsService;

  constructor(options: FetcherOptions = {}) {
    this.http = new HttpClient(options);

    this.twitter = new TwitterService(this.http);
    this.x = this.twitter;
    this.youtube = new YouTubeService(this.http);
    this.tiktok = new TikTokService(this.http);
    this.instagram = new InstagramService(this.http);
    this.reddit = new RedditService(this.http);
    this.google = new GoogleService(this.http);
    this.googleMaps = new GoogleMapsService(this.http);
    this.googleNews = new GoogleNewsService(this.http);
    this.googlePlay = new GooglePlayService(this.http);
    this.appStore = new AppStoreService(this.http);
    this.yelp = new YelpService(this.http);
    this.credits = new CreditsService(this.http);
  }

  /** The resolved base URL. */
  get baseUrl(): string {
    return this.http.baseUrl;
  }

  /**
   * Call any endpoint by path — the escape hatch for endpoints without a typed
   * helper. Path parameters must already be substituted.
   *
   * ```ts
   * await fetcher.get("/api/twitter/search", { params: { query: "x402" } });
   * ```
   */
  get<T = any>(path: string, options?: RequestOptions) {
    return this.http.get<T>(path, options);
  }

  /** The full catalog of priced endpoints. */
  static endpoints(): EndpointInfo[] {
    return ENDPOINTS;
  }

  /** Per-service metadata (host, endpoint count, summary). */
  static services(): Record<string, ServiceInfo> {
    return SERVICES;
  }

  /** Look up the USD price of an endpoint path, or `undefined` if unknown. */
  static priceOf(path: string): number | undefined {
    const normalized = path.split("?")[0];
    const match = ENDPOINTS.find(
      (e) => e.path === normalized || matchesTemplate(e.path, normalized ?? ""),
    );
    return match?.price;
  }
}

function matchesTemplate(template: string, path: string): boolean {
  const regex = new RegExp(
    "^" + template.replace(/\{[^}]+\}/g, "[^/]+").replace(/\//g, "\\/") + "$",
  );
  return regex.test(path);
}
