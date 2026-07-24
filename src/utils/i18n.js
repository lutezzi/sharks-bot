const fs = require("node:fs");
const path = require("node:path");
const { AsyncLocalStorage } = require("node:async_hooks");

const DEFAULT_LOCALE = (process.env.LOCALE || "en").toLowerCase();
const LOCALES_DIR = path.join(__dirname, "..", "locales");
const localeStorage = new AsyncLocalStorage();

function loadLocaleFile(code) {
  const filePath = path.join(LOCALES_DIR, `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadAllLocales() {
  const locales = {};

  for (const file of fs.readdirSync(LOCALES_DIR)) {
    if (!file.endsWith(".json")) continue;
    const code = file.slice(0, -5).toLowerCase();
    locales[code] = loadLocaleFile(code);
  }

  if (!locales[DEFAULT_LOCALE]) {
    throw new Error(
      `Locale dosyasi bulunamadi: src/locales/${DEFAULT_LOCALE}.json (varsayilan dil dosyasi zorunlu).`
    );
  }

  return locales;
}

const locales = loadAllLocales();

function resolvePath(obj, keyPath) {
  return keyPath.split(".").reduce((value, key) => (value == null ? undefined : value[key]), obj);
}

function interpolate(template, vars) {
  if (typeof template !== "string" || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

function normalizeLocale(code) {
  return typeof code === "string" ? code.toLowerCase() : "";
}

function isSupportedLocale(code) {
  return Boolean(locales[normalizeLocale(code)]);
}

function getActiveLocale() {
  return localeStorage.getStore()?.locale ?? DEFAULT_LOCALE;
}

function getStrings(locale) {
  return locales[locale] ?? locales[DEFAULT_LOCALE];
}

/**
 * `src/locales/<LOCALE>.json` icinden metin getirir.
 * Etkilesim sirasinda kullanicinin dili AsyncLocalStorage uzerinden uygulanir.
 */
function t(keyPath, vars) {
  const locale = getActiveLocale();
  const value = resolvePath(getStrings(locale), keyPath);

  if (value === undefined) {
    console.warn(`[i18n] Eksik metin anahtari: "${keyPath}" (locale: ${locale})`);
    return keyPath;
  }

  return interpolate(value, vars);
}

function runWithLocale(locale, fn) {
  const code = normalizeLocale(locale);
  const resolved = isSupportedLocale(code) ? code : DEFAULT_LOCALE;
  return localeStorage.run({ locale: resolved }, fn);
}

function getLocaleForUser(userId) {
  const { getUserSettings } = require("./settingsStore");
  const stored = normalizeLocale(getUserSettings(userId).locale);
  return isSupportedLocale(stored) ? stored : DEFAULT_LOCALE;
}

function runWithUserLocale(userId, fn) {
  return runWithLocale(getLocaleForUser(userId), fn);
}

function setUserLocale(userId, locale) {
  const code = normalizeLocale(locale);
  if (!isSupportedLocale(code)) return false;

  const { setUserSetting } = require("./settingsStore");
  setUserSetting(userId, "locale", code);
  return true;
}

function getSupportedLocales() {
  return Object.keys(locales);
}

module.exports = {
  t,
  locale: DEFAULT_LOCALE,
  runWithLocale,
  runWithUserLocale,
  getLocaleForUser,
  setUserLocale,
  getSupportedLocales,
  isSupportedLocale,
};
