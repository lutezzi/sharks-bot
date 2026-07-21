const UNITS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

const UNIT_LABELS = {
  s: "saniye",
  m: "dakika",
  h: "saat",
  d: "gun",
  w: "hafta",
};

/**
 * "10m", "2h", "1d" gibi kisa sureleri milisaniyeye cevirir.
 * Gecersiz girdide null doner.
 */
function parseDuration(input) {
  if (!input) return null;
  const match = /^([0-9]+)\s*(s|m|h|d|w)$/i.exec(input.trim());
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const ms = amount * UNITS[unit];

  return { ms, label: `${amount} ${UNIT_LABELS[unit]}` };
}

module.exports = { parseDuration };
