const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_LOCALE = "en";
const LOCALES_DIR = path.join(__dirname, "..", "locales");

function loadLocaleFile(code) {
  const filePath = path.join(LOCALES_DIR, `${code}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const requestedLocale = (process.env.LOCALE || DEFAULT_LOCALE).toLowerCase();
const strings = loadLocaleFile(requestedLocale) ?? loadLocaleFile(DEFAULT_LOCALE);

if (!strings) {
  throw new Error(
    `Locale dosyasi bulunamadi: src/locales/${requestedLocale}.json (varsayilan "${DEFAULT_LOCALE}" de bulunamadi).`
  );
}

if (requestedLocale !== DEFAULT_LOCALE && !loadLocaleFile(requestedLocale)) {
  console.warn(
    `[i18n] "${requestedLocale}" locale dosyasi bulunamadi, "${DEFAULT_LOCALE}" kullaniliyor.`
  );
}

function resolvePath(obj, keyPath) {
  return keyPath.split(".").reduce((value, key) => (value == null ? undefined : value[key]), obj);
}

function interpolate(template, vars) {
  if (typeof template !== "string" || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

/**
 * `src/locales/<LOCALE>.json` icinden nokta-yolu (orn. "commands.ban.success")
 * ile bir metin getirir ve `{degisken}` bicimindeki yer tutuculari doldurur.
 *
 * Yeni bir dil eklemek icin `src/locales/<kod>.json` dosyasini olusturup
 * .env icinde `LOCALE=<kod>` yazmaniz yeterlidir.
 */
function t(keyPath, vars) {
  const value = resolvePath(strings, keyPath);

  if (value === undefined) {
    console.warn(`[i18n] Eksik metin anahtari: "${keyPath}" (locale: ${requestedLocale})`);
    return keyPath;
  }

  return interpolate(value, vars);
}

module.exports = { t, locale: requestedLocale };
