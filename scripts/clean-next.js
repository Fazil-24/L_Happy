const fs = require("node:fs");
const path = require("node:path");

const nextDir = path.join(process.cwd(), ".next");

try {
  fs.rmSync(nextDir, { recursive: true, force: true });
} catch (error) {
  console.warn("Warning: unable to remove .next before starting Next.js", error?.message || error);
}
