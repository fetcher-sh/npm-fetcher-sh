import { BaseService } from "./base.js";
import type {
  CreditsBalance,
  FetcherEnvelope,
  RequestOptions,
  TopupResult,
} from "../types.js";

export interface TopupOptions extends RequestOptions {
  /** Mint a fresh API key, invalidating the old one immediately. */
  rotate?: boolean;
}

/**
 * Credits — top up and read the prepaid balance shared across every service.
 *
 * `topup` is an x402-paid `POST`; it only succeeds when the client is
 * configured with a payment-wrapped `fetch`. The first top-up returns the
 * `bby_live_` key exactly once — store it, it cannot be recovered.
 */
export class CreditsService extends BaseService {
  /** Read the current balance. `GET /api/credits/balance` (Bearer-only) */
  balance(options?: RequestOptions) {
    return this.getPath<CreditsBalance>("/api/credits/balance", options) as Promise<
      CreditsBalance | FetcherEnvelope<CreditsBalance>
    >;
  }

  /**
   * Buy credits (minimum $1). `POST /api/credits/topup?amount=`
   * Requires a payment-wrapped `fetch`; without an `Authorization` header a new
   * key is minted, with one the paying credit goes to that key's account.
   */
  topup(amount: number, options: TopupOptions = {}) {
    const { rotate, ...rest } = options;
    const params: Record<string, string | number | boolean> = { amount };
    if (rotate) params.rotate = 1;
    return this.http.post<TopupResult>("/api/credits/topup", {
      ...rest,
      params: { ...params, ...rest.params },
    });
  }
}
