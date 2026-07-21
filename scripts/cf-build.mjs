import { spawnSync } from "node:child_process";

// Always emit Cloudflare Worker output (.output/server), even on Windows shells.
process.env.NITRO_PRESET = "cloudflare_module";

const build = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const patch = spawnSync("node", ["scripts/patch-wrangler-config.mjs"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(patch.status ?? 1);
