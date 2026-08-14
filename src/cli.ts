import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Fetcher } from "./client.js";
import { FetcherError } from "./errors.js";
import { ENDPOINTS, SERVICES, API_KEY_ENV } from "./constants.js";
import type { QueryParams } from "./types.js";

const CONFIG_DIR = join(homedir(), ".fetcher-sh");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

interface ParsedArgs {
  _: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const _: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (key.includes("=")) {
        const [k, ...rest] = key.split("=");
        flags[k!] = rest.join("=");
      } else {
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith("--")) {
          flags[key] = next;
          i++;
        } else {
          flags[key] = true;
        }
      }
    } else {
      _.push(arg);
    }
  }
  return { _, flags };
}

function readConfig(): { token?: string } {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

function resolveToken(flags: Record<string, string | boolean>): string | undefined {
  const flagToken = flags.token ?? flags["api-key"];
  if (typeof flagToken === "string") return flagToken;
  if (process.env[API_KEY_ENV]) return process.env[API_KEY_ENV];
  return readConfig().token;
}

function makeClient(flags: Record<string, string | boolean>): Fetcher {
  return new Fetcher({
    apiKey: resolveToken(flags),
    baseUrl: typeof flags["base-url"] === "string" ? flags["base-url"] : undefined,
  });
}

/** Collect leftover `--key value` flags as query params (minus reserved ones). */
const RESERVED = new Set([
  "token",
  "api-key",
  "base-url",
  "json",
  "jsonl",
  "output",
  "debug",
  "rotate",
  "amount",
  "help",
]);

function collectParams(flags: Record<string, string | boolean>): QueryParams {
  const params: QueryParams = {};
  for (const [key, value] of Object.entries(flags)) {
    if (!RESERVED.has(key)) params[key] = value;
  }
  return params;
}

function output(data: unknown, flags: Record<string, string | boolean>): void {
  let text: string;
  if (flags.jsonl && Array.isArray(data)) {
    text = data.map((row) => JSON.stringify(row)).join("\n");
  } else if (flags.json) {
    text = JSON.stringify(data);
  } else {
    text = JSON.stringify(data, null, 2);
  }
  if (typeof flags.output === "string") {
    writeFileSync(flags.output, text);
    process.stderr.write(`Saved to ${flags.output}\n`);
  } else {
    process.stdout.write(text + "\n");
  }
}

interface Shortcut {
  path: string;
  /** Name of the path parameter, if the argument fills a `{param}`. */
  pathParam?: string;
  /** Query key the positional arg maps to. */
  queryKey?: string;
}

const SHORTCUTS: Record<string, Shortcut> = {
  "twitter-search": { path: "/api/twitter/search", queryKey: "query" },
  "x-search": { path: "/api/twitter/search", queryKey: "query" },
  "youtube-search": { path: "/api/youtube/search/video", queryKey: "query" },
  "tiktok-search": { path: "/api/tiktok/post/search", queryKey: "query" },
  "instagram-user": { path: "/api/instagram/user/handle/{handle}", pathParam: "handle" },
  "reddit-search": { path: "/api/reddit/search/post", queryKey: "query" },
  "google-search": { path: "/api/google/search", queryKey: "query" },
  "google-maps-search": { path: "/api/google-maps/place/search", queryKey: "query" },
  "google-news-search": { path: "/api/google-news/search", queryKey: "query" },
  "googleplay-apps": { path: "/api/googleplay/apps", queryKey: "query" },
  "appstore-apps": { path: "/api/appstore/apps", queryKey: "query" },
  "yelp-search": { path: "/api/yelp/search", queryKey: "query" },
};

const HELP = `fetcher — CLI for fetcher.sh (111 pay-per-call web-data endpoints)

USAGE
  fetcher <command> [args] [flags]

COMMANDS
  init                       Save an API key to ~/.fetcher-sh/config.json
  get <path>                 Call any endpoint by path (params via --key value)
  balance                    Show remaining prepaid credits
  topup --amount <usd>       Buy credits (requires an x402 wallet; see notes)
  endpoints [service]        List the endpoint catalog (optionally by service)
  services                   List the 11 services and their hosts

  Shortcuts (each takes one positional argument):
    twitter-search <query>        google-search <query>
    youtube-search <query>        google-maps-search <query>
    tiktok-search <query>         google-news-search <query>
    instagram-user <handle>       googleplay-apps <query>
    reddit-search <query>         appstore-apps <query>
                                  yelp-search <query>

FLAGS
  --token <key>       API key (bby_live_...); overrides env & config
  --base-url <url>    Override the API base URL
  --json              Compact JSON output
  --jsonl             One JSON object per line (arrays only)
  --output <file>     Write output to a file
  --<key> <value>     Any extra query parameter (e.g. --cursor abc --location NYC)

EXAMPLES
  export ${API_KEY_ENV}=bby_live_xxx
  fetcher twitter-search "x402" --json
  fetcher get /api/reddit/subreddit/programming/posts
  fetcher yelp-search "coffee" --location "San Francisco"
  fetcher balance

Get an API key at https://fetcher.sh/topup or pay per call with x402.`;

async function main(): Promise<void> {
  const { _, flags } = parseArgs(process.argv.slice(2));
  const command = _[0];

  if (!command || flags.help || command === "help") {
    process.stdout.write(HELP + "\n");
    return;
  }

  if (command === "init") {
    const token =
      typeof flags.token === "string"
        ? flags.token
        : typeof flags["api-key"] === "string"
          ? flags["api-key"]
          : undefined;
    if (!token) {
      process.stderr.write(
        `Provide a key: fetcher init --token bby_live_xxx\n` +
          `Get one at https://fetcher.sh/topup\n`,
      );
      process.exitCode = 1;
      return;
    }
    if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(CONFIG_PATH, JSON.stringify({ token }, null, 2));
    process.stdout.write(`Saved API key to ${CONFIG_PATH}\n`);
    return;
  }

  if (command === "services") {
    for (const s of Object.values(SERVICES)) {
      process.stdout.write(
        `${s.name.padEnd(16)} ${s.host.padEnd(34)} ${s.endpoints} endpoints\n`,
      );
    }
    return;
  }

  if (command === "endpoints") {
    const service = _[1];
    const rows = service
      ? ENDPOINTS.filter((e) => e.service.toLowerCase() === service.toLowerCase())
      : ENDPOINTS;
    if (rows.length === 0) {
      process.stderr.write(
        `Unknown service "${service}". Try one of: ${Object.keys(SERVICES).join(", ")}\n`,
      );
      process.exitCode = 1;
      return;
    }
    for (const e of rows) {
      process.stdout.write(`$${e.price.toFixed(3)}  ${e.method} ${e.path}\n`);
    }
    return;
  }

  const client = makeClient(flags);

  try {
    if (command === "balance") {
      const data = await client.credits.balance();
      output(data, flags);
      return;
    }

    if (command === "topup") {
      const amount = Number(flags.amount);
      if (!amount || amount < 1) {
        process.stderr.write(`Provide an amount of at least $1: fetcher topup --amount 5\n`);
        process.exitCode = 1;
        return;
      }
      process.stderr.write(
        `Note: top-up is x402-paid and needs a funded wallet. The plain CLI cannot\n` +
          `sign payments — use https://fetcher.sh/topup or a wallet-enabled client.\n`,
      );
      const data = await client.credits.topup(amount, { rotate: Boolean(flags.rotate) });
      output(data, flags);
      return;
    }

    if (command === "get") {
      const path = _[1];
      if (!path) {
        process.stderr.write(`Usage: fetcher get <path> [--key value ...]\n`);
        process.exitCode = 1;
        return;
      }
      const data = await client.get(path, { params: collectParams(flags) });
      output(data, flags);
      return;
    }

    const shortcut = SHORTCUTS[command];
    if (shortcut) {
      const arg = _[1];
      if (!arg) {
        process.stderr.write(`Usage: fetcher ${command} <argument> [flags]\n`);
        process.exitCode = 1;
        return;
      }
      let path = shortcut.path;
      const params = collectParams(flags);
      if (shortcut.pathParam) {
        path = path.replace(`{${shortcut.pathParam}}`, encodeURIComponent(arg));
      } else if (shortcut.queryKey) {
        params[shortcut.queryKey] = arg;
      }
      const data = await client.get(path, { params });
      output(data, flags);
      return;
    }

    process.stderr.write(`Unknown command: "${command}"\nRun "fetcher help" for usage.\n`);
    process.exitCode = 1;
  } catch (err) {
    if (err instanceof FetcherError) {
      process.stderr.write(`Error ${err.status}: ${err.message}\n`);
      if (err.isTopupRequired) {
        process.stderr.write(`Balance exhausted — top up at https://fetcher.sh/topup\n`);
      } else if (err.isUnauthorized) {
        process.stderr.write(`Unknown or rotated key. Set one with "fetcher init".\n`);
      }
      if (flags.debug && err.body) {
        process.stderr.write(JSON.stringify(err.body, null, 2) + "\n");
      }
    } else {
      process.stderr.write(`Error: ${(err as Error).message}\n`);
      if (flags.debug) process.stderr.write(String((err as Error).stack) + "\n");
    }
    process.exitCode = 1;
  }
}

main();
