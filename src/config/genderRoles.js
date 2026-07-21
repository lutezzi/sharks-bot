/**
 * Cinsiyet secim menusunde gosterilecek roller.
 *
 * roleId alanina, sunucunuzda ONCEDEN OLUSTURULMUS rollerin ID'lerini
 * yazin (rol ID'sini almak icin Discord'da Gelistirici Modu'nu acip
 * role sag tiklayip "ID'yi Kopyala" secin).
 *
 * Bu menu tek secimlidir: kullanici baska bir secenek sectiginde
 * onceki cinsiyet rolu otomatik kaldirilir.
 */
module.exports = [
  { label: "ℎ𝑒/ℎ𝑖𝑚", emoji: "♂️", roleId: "1523653804460085315" },
  { label: "𝑠ℎ𝑒/ℎ𝑒𝑟", emoji: "♀️", roleId: "1523653758217748480" },
  { label: "𝑡ℎ𝑒𝑦/𝑡ℎ𝑒𝑚", emoji: "🌈", roleId: "1523656522637381783" },
];
