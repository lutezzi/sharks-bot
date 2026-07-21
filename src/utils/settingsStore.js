const fs = require("node:fs");
const path = require("node:path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SETTINGS_PATH)) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({}, null, 2));
  }
}

function readAll() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

function getGuildSettings(guildId) {
  const all = readAll();
  return all[guildId] ?? {};
}

function setGuildSetting(guildId, key, value) {
  const all = readAll();
  all[guildId] = { ...(all[guildId] ?? {}), [key]: value };
  writeAll(all);
  return all[guildId];
}

module.exports = { getGuildSettings, setGuildSetting };
