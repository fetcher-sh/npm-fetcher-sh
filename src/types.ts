/**
 * Query parameters accepted by any endpoint. Values are serialized into the
 * query string; `undefined` and `null` values are dropped.
 */
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * The stable envelope every fetcher.sh endpoint returns. The HTTP status code
 * mirrors the `status` field; errors carry a descriptive `message`.
 */
export interface FetcherEnvelope<T = unknown> {
  status: number;
  message: string;
  data: T;
}

/** Options accepted by every request. */
export interface RequestOptions {
  /**
   * When `true`, return the full `{ status, message, data }` envelope instead
   * of just the `data` field.
   */
  fullResponse?: boolean;
  /** Per-request timeout in milliseconds. Overrides the client default. */
  timeout?: number;
  /** Extra query parameters merged into the request. */
  params?: QueryParams;
  /** An `AbortSignal` to cancel the request. */
  signal?: AbortSignal;
}

/** A `fetch`-compatible function. */
export type FetchLike = (
  input: string | URL,
  init?: RequestInit,
) => Promise<Response>;

/** Configuration for a {@link Fetcher} client. */
export interface FetcherOptions {
  /**
   * A prepaid-credits API key (`bby_live_...`). Sent as
   * `Authorization: Bearer <apiKey>` on every call. Optional — omit it to pay
   * per call with x402 by supplying a payment-wrapped `fetch`.
   */
  apiKey?: string;
  /** Base URL for the API. Defaults to `https://fetcher.sh`. */
  baseUrl?: string;
  /**
   * A custom `fetch` implementation. Pass a payment-wrapped fetch (for example
   * from `@x402/fetch`) to pay per call with x402 instead of credits.
   */
  fetch?: FetchLike;
  /** Default request timeout in milliseconds. Defaults to `30000`. */
  timeout?: number;
  /** Extra headers sent on every request. */
  headers?: Record<string, string>;
}

/** Balance information returned by `GET /api/credits/balance`. */
export interface CreditsBalance {
  wallet: string;
  balance_micro: number;
  balance_usd: number;
  key_last4: string;
}

/** Result of a credits top-up. `key` is only present on the first top-up. */
export interface TopupResult {
  key?: string;
  [k: string]: unknown;
}
