import { handleBuild } from "./quartz/cli/handlers.js";
import { readdirSync, writeFileSync, readFileSync, watch } from "fs";
import { join } from "path";

const timelineDir = join(process.cwd(), "content/timeline");
const indexPath = join(process.cwd(), "content/index.md");

function updateLatestLink() {
  try {
    const files = readdirSync(timelineDir)
      .filter(f => f.endsWith(".md"))
      .sort()
      .reverse();
    
    if (files.length > 0) {
      const latest = files[0].replace(".md", "");
      let content = readFileSync(indexPath, "utf-8");
      const newLink = `**→ [Latest: ${latest}](/timeline/${latest})**`;
      const updated = content.replace(
        /\*\*→ \[Latest: [^\]]+\]\([^)]+\)\*\*/,
        newLink
      );
      if (updated !== content) {
        writeFileSync(indexPath, updated);
        console.log(`Updated latest link to ${latest}`);
      }
    }
  } catch (e) {
    console.log("Could not update latest link:", e.message);
  }
}

// initial update
updateLatestLink();

// watch for changes
watch(timelineDir, (eventType, filename) => {
  if (filename?.endsWith(".md")) {
    updateLatestLink();
  }
});

await handleBuild({
  directory: "content",
  output: "public",
  serve: true,
  watch: true,
  port: 9999,
  wsPort: 9998,
  baseDir: "",
  remoteDevHost: "",
  bundleInfo: false,
  verbose: false,
});
