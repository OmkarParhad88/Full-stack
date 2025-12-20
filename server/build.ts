import Bun from "bun";
import { cp } from "node:fs/promises";
import { existsSync, rmSync } from "node:fs";

if (existsSync("./dist")) {
  rmSync("./dist", { recursive: true });
}

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
});

if (!result.success) {
  console.error("Build failed", result.logs);
  process.exit(1);
}

try {
  await cp("./src/views", "./dist/views", { recursive: true });
  console.log("✅ Successfully bundled and copied views to ./dist");
} catch (err) {
  console.error("❌ Failed to copy views:", err);
}