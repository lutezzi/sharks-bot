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

function getGuildArraySetting(guildId, key) {
  const value = getGuildSettings(guildId)[key];
  return Array.isArray(value) ? value : [];
}

function setGuildArraySetting(guildId, key, value) {
  return setGuildSetting(guildId, key, value);
}

function addGuildArrayEntry(guildId, key, entry, maxEntries) {
  const list = getGuildArraySetting(guildId, key);
  if (list.some((item) => item.roleId === entry.roleId)) {
    return { ok: false, reason: "duplicate" };
  }
  if (list.length >= maxEntries) {
    return { ok: false, reason: "max", max: maxEntries };
  }
  const next = [...list, entry];
  setGuildArraySetting(guildId, key, next);
  return { ok: true, list: next };
}

function removeGuildArrayEntry(guildId, key, roleId) {
  const list = getGuildArraySetting(guildId, key);
  const next = list.filter((item) => item.roleId !== roleId);
  if (next.length === list.length) {
    return { ok: false, reason: "notFound" };
  }
  setGuildArraySetting(guildId, key, next);
  return { ok: true, list: next };
}

const USERS_KEY = "_users";

function getUserSettings(userId) {
  const all = readAll();
  return all[USERS_KEY]?.[userId] ?? {};
}

function setUserSetting(userId, key, value) {
  const all = readAll();
  if (!all[USERS_KEY]) all[USERS_KEY] = {};
  all[USERS_KEY][userId] = { ...(all[USERS_KEY][userId] ?? {}), [key]: value };
  writeAll(all);
  return all[USERS_KEY][userId];
}

module.exports = {
  getGuildSettings,
  setGuildSetting,
  getGuildArraySetting,
  setGuildArraySetting,
  addGuildArrayEntry,
  removeGuildArrayEntry,
  getUserSettings,
  setUserSetting,
};
