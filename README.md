# @fetcher-sh/api

The developer-friendly client for [**fetcher.sh**](https://fetcher.sh) — **111 pay-per-call web-data endpoints** across Twitter/X, YouTube, TikTok, Instagram, Reddit, Google Search, Google Maps, Google News, Google Play, the App Store, and Yelp. Use it as an NPM **library** or a **CLI**.

Every endpoint is a plain `GET` returning a stable `{ status, message, data }` envelope. Pay per call in USDC via [x402](https://fetcher.sh), or top up once and spend a single prepaid balance across all 11 services — the same `bby_live_` key works everywhere.

## Prerequisites

- **Node.js 18+** (uses the built-in `fetch`).
- **One of:**
  - A prepaid **API key** (`bby_live_...`) — get one at [fetcher.sh/topup](https://fetcher.sh/topup), or
  - A **wallet** holding a few cents of USDC on Base, Polygon, Arbitrum, Monad, or Solana, for pay-per-call x402 (no key needed).

## Installation

```bash
npm install @fetcher-sh/api
```

## Quick start (library)

```ts
// ESM
import { Fetcher } from "@fetcher-sh/api";

// CommonJS
const { Fetcher } = require("@fetcher-sh/api");

const fetcher = new Fetcher({ apiKey: process.env.FETCHER_API_KEY });

// Search tweets
const tweets = await fetcher.twitter.search({ query: "x402" });

// Look up an Instagram profile by handle
const profile = await fetcher.instagram.userByHandle("nasa");

// Clean Google web-search results
const serp = await fetcher.google.search({ query: "climate change" });

console.log(tweets, profile, serp);
```

By default every method returns just the `data` field. Pass `{ fullResponse: true }` to get the whole `{ status, message, data }` envelope.

```ts
const env = await fetcher.reddit.searchPosts(
  { query: "bitcoin" },
  { fullResponse: true },
);
console.log(env.status, env.message, env.data);
```

If the `apiKey` is omitted it falls back to the `FETCHER_API_KEY` environment variable.

## Services & methods

One balance, eleven services. Each namespace maps 1:1 to the endpoints in the [live catalog](https://fetcher.sh/llms.txt).

| Namespace | Access via | Highlights |
| --- | --- | --- |
| Twitter / X | `fetcher.twitter` / `fetcher.x` | `search`, `handle`, `user`, `userTweets`, `userFollowers`, `tweet`, `tweetReplies`, `trends`, `listTweets` |
| YouTube | `fetcher.youtube` | `searchVideo`, `video`, `videoComments`, `channel`, `channelVideos`, `trending`, `playlistVideos` |
| TikTok | `fetcher.tiktok` | `searchPosts`, `postByUrl`, `userByHandle`, `userPosts`, `hashtagPosts`, `musicPosts` |
| Instagram | `fetcher.instagram` | `userByHandle`, `user`, `userPosts`, `userReels`, `userStories`, `hashtagPosts`, `postByCode` |
| Reddit | `fetcher.reddit` | `searchPosts`, `subredditPosts`, `post`, `postComments`, `postsHot`, `user`, `userComments` |
| Google Search | `fetcher.google` | `search` |
| Google Maps | `fetcher.googleMaps` | `searchPlaces`, `place`, `placeReviews`, `review` |
| Google News | `fetcher.googleNews` | `search`, `latest`, `world`, `business`, `technology`, `topic`, `decodeArticleUrl` |
| Google Play | `fetcher.googlePlay` | `searchApps`, `app`, `appReviews`, `appPermissions`, `appDataSafety`, `developer` |
| App Store | `fetcher.appStore` | `searchApps`, `app`, `appReviews`, `appSimilar`, `bundle`, `developer` |
| Yelp | `fetcher.yelp` | `search`, `place`, `placeByHandle`, `placeReviews` |

### The generic escape hatch

Any endpoint — even ones without a named helper — is reachable with `get`:

```ts
await fetcher.get("/api/twitter/search", { params: { query: "x402" } });
await fetcher.get("/api/reddit/subreddit/programming/posts");
```

### Pagination

Paginated endpoints return an opaque `cursor`. Pass it back to fetch the next page:

```ts
let cursor: string | undefined;
do {
  const page = await fetcher.twitter.userFollowers("44196397", {
    fullResponse: true,
    params: { cursor },
  });
  // ...process page.data...
  cursor = (page.data as any)?.cursor;
} while (cursor);
```

## Paying per call with x402 (no key)

Skip the API key and pass a payment-wrapped `fetch` instead. The client stays dependency-free — you bring the wallet:

```ts
import { Fetcher } from "@fetcher-sh/api";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: ["eip155:8453", "eip155:137", "eip155:42161", "eip155:143"].map(
    (network) => ({ network, client: new ExactEvmScheme(account) }),
  ),
});

const fetcher = new Fetcher({ fetch: fetchWithPayment });
const tweets = await fetcher.twitter.search({ query: "x402" }); // 402 → sign → retry, automatically
```

Gas is sponsored, so the wallet needs no native token — just USDC on any supported chain.

## Credits

```ts
// Read the shared balance (needs an API key)
const balance = await fetcher.credits.balance();
console.log(balance.balance_usd);

// Top up (x402-paid; requires a payment-wrapped fetch). The first top-up
// returns the bby_live_ key EXACTLY ONCE — store it, it cannot be recovered.
const result = await fetcher.credits.topup(5);
console.log(result.key);
```

## Error handling

Every non-2xx response throws a `FetcherError` carrying the status, parsed envelope, and helpers:

```ts
import { FetcherError } from "@fetcher-sh/api";

try {
  await fetcher.twitter.search({ query: "x402" });
} catch (err) {
  if (err instanceof FetcherError) {
    if (err.isTopupRequired) console.error("Out of credits — top up.");
    else if (err.isUnauthorized) console.error("Bad or rotated API key.");
    else if (err.isPaymentRequired) console.error("x402 payment required.");
    else console.error(err.status, err.message);
  }
}
```

## CLI

Install globally to use from the command line:

```bash
npm install -g @fetcher-sh/api
```

### Setup

```bash
# Store your API key (saved to ~/.fetcher-sh/config.json)
fetcher init --token bby_live_xxx

# Or set it as an environment variable
export FETCHER_API_KEY=bby_live_xxx

# Or pass it per command
fetcher balance --token bby_live_xxx
```

### Commands

```bash
# Shortcuts for each service's hero endpoint
fetcher twitter-search "x402"
fetcher youtube-search "lofi hip hop"
fetcher tiktok-search "cats"
fetcher instagram-user nasa
fetcher reddit-search "bitcoin"
fetcher google-search "climate change"
fetcher google-maps-search "coffee near me"
fetcher google-news-search "artificial intelligence"
fetcher googleplay-apps "notes"
fetcher appstore-apps "notes"
fetcher yelp-search "coffee" --location "San Francisco"

# Call ANY endpoint by path; extra --flags become query params
fetcher get /api/twitter/user/44196397/tweets --cursor abc123
fetcher get /api/reddit/subreddit/programming/posts

# Credits
fetcher balance
fetcher topup --amount 5          # needs an x402 wallet — see notes

# Explore the catalog
fetcher services
fetcher endpoints twitter
```

### Output options

```bash
fetcher twitter-search "x402"              # pretty JSON (default)
fetcher twitter-search "x402" --json       # compact JSON
fetcher twitter-search "x402" --jsonl      # one object per line (arrays)
fetcher twitter-search "x402" --output out.json
fetcher get /api/x/y --debug               # show raw error bodies
```

### Global flags

| Flag | Description |
| --- | --- |
| `--token <key>` | API key (`bby_live_...`); overrides env & config |
| `--base-url <url>` | Override the API base URL |
| `--json` | Compact JSON output |
| `--jsonl` | One JSON object per line (arrays only) |
| `--output <file>` | Write output to a file |
| `--<key> <value>` | Any extra query parameter (e.g. `--cursor`, `--location`) |

## API reference

### `new Fetcher(options?)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | `FETCHER_API_KEY` env | Prepaid-credits key (`bby_live_...`) |
| `baseUrl` | `string` | `https://fetcher.sh` | API base URL |
| `fetch` | `FetchLike` | global `fetch` | Custom fetch (e.g. x402 payment-wrapped) |
| `timeout` | `number` | `30000` | Default request timeout in ms |
| `headers` | `object` | `{}` | Extra headers on every request |

### Request options (per call)

| Option | Type | Description |
| --- | --- | --- |
| `fullResponse` | `boolean` | Return `{ status, message, data }` instead of just `data` |
| `params` | `object` | Extra query parameters |
| `timeout` | `number` | Per-request timeout in ms |
| `signal` | `AbortSignal` | Cancel the request |

### Statics

- `Fetcher.endpoints()` — the full catalog of 111 priced endpoints.
- `Fetcher.services()` — per-service metadata (host, count, summary).
- `Fetcher.priceOf(path)` — USD price for a path (templated paths supported).

## Notes

- **Read-only by design.** Every endpoint is a `GET` — no writes, follows, or posts.
- **No rate limits.** Your balance (or wallet) is the natural backpressure.
- **No refunds on upstream failure.** Settlement precedes delivery.
- This is an **unofficial** client for fetcher.sh, which itself is an independent proxy with no affiliation to X, TikTok, Meta, Google, Yelp, or Apple.

## License

MIT
