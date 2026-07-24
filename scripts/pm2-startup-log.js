const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const LOG_CANDIDATES = [
  path.join(__dirname, "..", "logs", "out-0.log"),
  path.join(__dirname, "..", "logs", "out.log"),
];

function readLogFile() {
  for (const file of LOG_CANDIDATES) {
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, "utf8");
    }
  }
  return null;
}

function stripLogPrefix(line) {
  return line.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+:\s*/, "");
}

function isBannerStart(lines, index) {
  const text = stripLogPrefix(lines[index]);
  if (!text.includes("🦈")) return false;
  return text.includes("Bot Ready") || text.includes("Bot Hazır");
}

function findBannerStart(lines, sharkIndex) {
  for (let i = sharkIndex; i >= Math.max(0, sharkIndex - 2); i--) {
    if (stripLogPrefix(lines[i]).includes("────────────────")) {
      return i;
    }
  }
  return sharkIndex;
}

function isBannerEnd(line) {
  const text = stripLogPrefix(line);
  return text.includes("Gateway (websocket) gecikmesi:");
}

function extractLastStartupBlock(content) {
  const lines = content.split("\n");
  const blocks = [];
  let startIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (isBannerStart(lines, i)) {
      startIdx = findBannerStart(lines, i);
      continue;
    }

    if (startIdx >= 0 && isBannerEnd(lines[i])) {
      blocks.push(lines.slice(startIdx, i + 1).map(stripLogPrefix).join("\n").trimEnd());
      startIdx = -1;
    }
  }

  if (startIdx >= 0) {
    blocks.push(lines.slice(startIdx).map(stripLogPrefix).join("\n").trimEnd());
  }

  return blocks.at(-1) ?? null;
}

function tailLiveLogs() {
  console.log("\nCanli log (Ctrl+C ile cik):\n");
  const child = spawn("pm2", ["logs", "sharks-bot", "--out", "--raw", "--lines", "0"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}

const live = process.argv.includes("--live");
const content = readLogFile();

if (!content) {
  console.error("Log dosyasi bulunamadi (logs/out.log). Bot pm2 ile calisiyor mu?");
  process.exit(1);
}

const block = extractLastStartupBlock(content);

if (!block) {
  console.error("Startup banner bulunamadi. Once: pm2 restart sharks-bot");
  process.exit(1);
}

console.log(block);

if (live) {
  tailLiveLogs();
}
