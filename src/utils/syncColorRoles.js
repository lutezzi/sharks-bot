const colorRoles = require("../config/colorRoles");

/**
 * config/colorRoles.js icindeki "hex" degerlerini, sunucudaki gercek
 * rollerin rengiyle karsilastirir ve farkli olanlari gunceller.
 *
 * Boylece renk kodlarini sadece config dosyasindan yonetebilirsiniz;
 * Discord'da role sag tiklayip elle renk secmenize gerek kalmaz.
 */
async function syncColorRoles(guild) {
  for (const colorRole of colorRoles) {
    if (!colorRole.hex || colorRole.roleId.endsWith("_ROL_ID")) continue;

    const role = guild.roles.cache.get(colorRole.roleId);
    if (!role) continue;

    const targetHex = colorRole.hex.toUpperCase();
    if (role.hexColor.toUpperCase() === targetHex) continue;

    if (!role.editable) {
      console.warn(
        `[renk-senkron] "${colorRole.label}" rolunun rengi degistirilemedi: botun rolu bu rolden ust siralarda degil.`
      );
      continue;
    }

    await role.setColor(targetHex, "Renk kodu config/colorRoles.js ile senkronize edildi.").catch((error) => {
      console.warn(`[renk-senkron] "${colorRole.label}" rolu guncellenemedi:`, error.message);
    });
  }
}

module.exports = { syncColorRoles };
