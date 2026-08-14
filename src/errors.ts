import type { FetcherEnvelope } from "./types.js";

/**
 * Thrown for any non-2xx response from fetcher.sh. Carries the HTTP status,
 * the parsed envelope (when available), and the raw response body.
 */
export class FetcherError extends Error {
  readonly status: number;
  readonly envelope?: FetcherEnvelope;
  readonly body?: unknown;
  readonly url: string;

  constructor(
    message: string,
    opts: {
      status: number;
      url: string;
      envelope?: FetcherEnvelope;
      body?: unknown;
    },
  ) {
    super(message);
    this.name = "FetcherError";
    this.status = opts.status;
    this.url = opts.url;
    this.envelope = opts.envelope;
    this.body = opts.body;
  }

  /** `true` when the balance could not cover the call (402 `topup_required`). */
  get isTopupRequired(): boolean {
    return (
      this.status === 402 &&
      this.envelope?.message?.toLowerCase().includes("topup_required") === true
    );
  }

  /** `true` when the server issued an x402 payment challenge. */
  get isPaymentRequired(): boolean {
    return this.status === 402 && !this.isTopupRequired;
  }

  /** `true` for an unknown or rotated API key. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}
