import { FetcherError } from "./errors.js";
import type {
  FetchLike,
  FetcherEnvelope,
  QueryParams,
  RequestOptions,
} from "./types.js";
import { API_KEY_ENV, DEFAULT_BASE_URL } from "./constants.js";

export interface HttpClientConfig {
  apiKey?: string;
  baseUrl?: string;
  fetch?: FetchLike;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Low-level HTTP client. Handles URL building, the API-key header, timeouts,
 * envelope parsing, and error mapping. Every service shares one instance.
 */
export class HttpClient {
  readonly baseUrl: string;
  readonly apiKey?: string;
  readonly timeout: number;
  private readonly fetchImpl: FetchLike;
  private readonly extraHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.apiKey =
      config.apiKey ??
      (typeof process !== "undefined"
        ? process.env?.[API_KEY_ENV]
        : undefined);
    this.timeout = config.timeout ?? 30_000;
    this.extraHeaders = config.headers ?? {};

    if (config.fetch) {
      // Use a caller-supplied fetch as-is (e.g. an x402 payment-wrapped fetch).
      // Rebinding it would drop wrapper state and any attached properties.
      this.fetchImpl = config.fetch;
    } else if (globalThis.fetch) {
      // The global fetch must be called with `this` bound to globalThis or it
      // throws "Illegal invocation" in some runtimes.
      this.fetchImpl = globalThis.fetch.bind(globalThis) as FetchLike;
    } else {
      throw new Error(
        "No fetch implementation available. Use Node 18+ or pass a `fetch` in the options.",
      );
    }
  }

  /** Fill `{param}` placeholders in a path with encoded values. */
  static buildPath(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => {
      const value = params[key];
      if (value === undefined || value === null || value === "") {
        throw new Error(`Missing required path parameter: "${key}"`);
      }
      return encodeURIComponent(String(value));
    });
  }

  private buildUrl(path: string, params?: QueryParams): string {
    const url = new URL(
      path.startsWith("http") ? path : `${this.baseUrl}${path}`,
    );
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  async request<T = unknown>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T | FetcherEnvelope<T>> {
    const url = this.buildUrl(path, options.params);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...this.extraHeaders,
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutMs = options.timeout ?? this.timeout;
    const timer =
      timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

    if (options.signal) {
      options.signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers,
        signal: controller.signal,
      });
    } catch (err) {
      if (timer) clearTimeout(timer);
      if ((err as Error).name === "AbortError") {
        throw new FetcherError(`Request timed out after ${timeoutMs}ms`, {
          status: 0,
          url,
        });
      }
      throw new FetcherError(
        `Network error: ${(err as Error).message}`,
        { status: 0, url },
      );
    } finally {
      if (timer) clearTimeout(timer);
    }

    const raw = await response.text();
    let parsed: unknown;
    try {
      parsed = raw ? JSON.parse(raw) : undefined;
    } catch {
      parsed = raw;
    }

    const envelope = isEnvelope(parsed) ? parsed : undefined;

    if (!response.ok) {
      const fallback = `Request failed with status ${response.status}`;
      // Only surface a raw string body as the message when it's short and not
      // an HTML error page (some hosts return a full HTML 404 document).
      const rawMessage =
        typeof parsed === "string" &&
        parsed.trim() &&
        parsed.length <= 200 &&
        !/^\s*</.test(parsed)
          ? parsed.trim()
          : undefined;
      const message = envelope?.message ?? rawMessage ?? fallback;
      throw new FetcherError(message, {
        status: response.status,
        url,
        envelope,
        body: parsed,
      });
    }

    if (options.fullResponse) {
      return (envelope ?? { status: response.status, message: "ok", data: parsed }) as FetcherEnvelope<T>;
    }
    return (envelope ? envelope.data : parsed) as T;
  }

  get<T = unknown>(path: string, options?: RequestOptions) {
    return this.request<T>("GET", path, options);
  }

  post<T = unknown>(path: string, options?: RequestOptions) {
    return this.request<T>("POST", path, options);
  }
}

function isEnvelope(value: unknown): value is FetcherEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "data" in value
  );
}
