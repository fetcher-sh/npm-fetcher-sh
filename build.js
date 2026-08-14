import { build } from "esbuild";
import { chmodSync } from "node:fs";

const shared = {
  bundle: true,
  platform: "node",
  target: "node18",
  sourcemap: true,
  logLevel: "info",
};

// Library: ESM + CJS
await build({
  ...shared,
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "esm",
});

await build({
  ...shared,
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.cjs",
  format: "cjs",
});

// CLI (ESM with shebang)
await build({
  ...shared,
  entryPoints: ["src/cli.ts"],
  outfile: "dist/cli.js",
  format: "esm",
  banner: { js: "#!/usr/bin/env node" },
});

chmodSync("dist/cli.js", 0o755);

console.log("Build complete.");
