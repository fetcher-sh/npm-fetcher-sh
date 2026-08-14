import { describe, it, expect, vi } from "vitest";
import { Fetcher, FetcherError, HttpClient, ENDPOINTS, SERVICES } from "../src/index.js";
import type { FetchLike } from "../src/index.js";

/** Build a fake fetch that records calls and returns a canned envelope. */
function mockFetch(
  body: unknown,
  init: { status?: number; ok?: boolean } = {},
): { fetch: FetchLike; calls: string[] } {
  const calls: string[] = [];
  const status = init.status ?? 200;
  const fetch: FetchLike = vi.fn(async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
  });
  return { fetch, calls };
}

describe("HttpClient.buildPath", () => {
  it("substitutes and encodes path params", () => {
    expect(HttpClient.buildPath("/api/x/{a}/y/{b}", { a: "1 2", b: "3" })).toBe(
      "/api/x/1%202/y/3",
    );
  });

  it("throws on a missing param", () => {
    expect(() => HttpClient.buildPath("/api/x/{a}", { a: "" })).toThrow(
      /Missing required path parameter/,
    );
  });
});

describe("Fetcher client", () => {
  it("unwraps the data envelope by default", async () => {
    const { fetch } = mockFetch({ status: 200, message: "ok", data: [{ id: 1 }] });
    const f = new Fetcher({ apiKey: "bby_live_test", fetch });
    const data = await f.twitter.search({ query: "x402" });
    expect(data).toEqual([{ id: 1 }]);
  });

  it("returns the full envelope when asked", async () => {
    const { fetch } = mockFetch({ status: 200, message: "ok", data: 42 });
    const f = new Fetcher({ fetch });
    const env = await f.twitter.tweet("1", { fullResponse: true });
    expect(env).toEqual({ status: 200, message: "ok", data: 42 });
  });

  it("sends the Authorization header when an apiKey is set", async () => {
    const seen: Record<string, string> = {};
    const fetch: FetchLike = vi.fn(async (_url, init) => {
      Object.assign(seen, init?.headers);
      return new Response(JSON.stringify({ status: 200, message: "ok", data: null }));
    });
    const f = new Fetcher({ apiKey: "bby_live_abc", fetch });
    await f.credits.balance();
    expect(seen.Authorization).toBe("Bearer bby_live_abc");
  });

  it("builds the correct URL with query params", async () => {
    const { fetch, calls } = mockFetch({ status: 200, message: "ok", data: {} });
    const f = new Fetcher({ fetch });
    await f.yelp.search({ query: "coffee", location: "San Francisco" });
    const url = new URL(calls[0]!);
    expect(url.pathname).toBe("/api/yelp/search");
    expect(url.searchParams.get("query")).toBe("coffee");
    expect(url.searchParams.get("location")).toBe("San Francisco");
  });

  it("substitutes path params for templated endpoints", async () => {
    const { fetch, calls } = mockFetch({ status: 200, message: "ok", data: {} });
    const f = new Fetcher({ fetch });
    await f.instagram.userByHandle("nasa");
    expect(new URL(calls[0]!).pathname).toBe("/api/instagram/user/handle/nasa");
  });

  it("throws FetcherError on non-2xx and detects topup_required", async () => {
    const { fetch } = mockFetch(
      { status: 402, message: "topup_required", data: null },
      { status: 402 },
    );
    const f = new Fetcher({ apiKey: "bby_live_x", fetch });
    await expect(f.google.search({ query: "hi" })).rejects.toMatchObject({
      name: "FetcherError",
      status: 402,
    });
    try {
      await f.google.search({ query: "hi" });
    } catch (e) {
      expect(e).toBeInstanceOf(FetcherError);
      expect((e as FetcherError).isTopupRequired).toBe(true);
    }
  });

  it("uses a custom base URL", async () => {
    const { fetch, calls } = mockFetch({ status: 200, message: "ok", data: {} });
    const f = new Fetcher({ fetch, baseUrl: "https://twitter.fetcher.sh" });
    await f.twitter.trends();
    expect(calls[0]!.startsWith("https://twitter.fetcher.sh/api/twitter/trends")).toBe(
      true,
    );
  });
});

describe("catalog", () => {
  it("contains all 111 endpoints", () => {
    expect(ENDPOINTS).toHaveLength(111);
  });

  it("lists 11 services", () => {
    expect(Object.keys(SERVICES)).toHaveLength(11);
  });

  it("resolves a price for a templated path", () => {
    expect(Fetcher.priceOf("/api/twitter/tweet/12345")).toBe(0.002);
    expect(Fetcher.priceOf("/api/yelp/search?query=x")).toBe(0.003);
  });

  it("per-service endpoint counts match the service metadata", () => {
    for (const svc of Object.values(SERVICES)) {
      const count = ENDPOINTS.filter((e) => e.service === svc.key).length;
      expect(count, svc.key).toBe(svc.endpoints);
    }
  });
});

describe("custom fetch", () => {
  it("is used as-is, without rebinding (preserves x402 wrapper state)", async () => {
    let called = false;
    const custom: FetchLike = async () => {
      called = true;
      return new Response(JSON.stringify({ status: 200, message: "ok", data: 1 }));
    };
    (custom as any).marker = "x402";
    const f = new Fetcher({ fetch: custom });
    const data = await f.google.search({ query: "hi" });
    expect(called).toBe(true);
    expect(data).toBe(1);
  });
});
