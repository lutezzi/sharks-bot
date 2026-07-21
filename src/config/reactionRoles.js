/**
 * Rol secim menusunde gosterilecek roller (bildirim/ilgi alani rolleri vb.).
 *
 * roleId alanina, sunucunuzda ONCEDEN OLUSTURULMUS rollerin ID'lerini yazin.
 * Renk menusunden farkli olarak buradaki roller birbirini DISLAMAZ,
 * kullanici istedigi kadar rolu ayni anda secebilir (toggle: acar/kapatir).
 */
module.exports = [
  { label: "Oyun Bildirimleri", emoji: "🎮", roleId: "OYUN_ROL_ID", style: "Secondary" },
  { label: "Etkinlik Bildirimleri", emoji: "📅", roleId: "ETKINLIK_ROL_ID", style: "Secondary" },
  { label: "Duyuru Bildirimleri", emoji: "📢", roleId: "DUYURU_ROL_ID", style: "Secondary" },
  { label: "Muzik", emoji: "🎵", roleId: "MUZIK_ROL_ID", style: "Secondary" },
];
