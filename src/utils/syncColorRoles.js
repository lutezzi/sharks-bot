/**
 * Sunucu ayarlarindaki renk rollerinin hex degerlerini Discord ile senkronize eder.
 */
async function syncColorRoles(guild, colorRoles = []) {
  for (const colorRole of colorRoles) {
    if (!colorRole.hex || !colorRole.roleId) continue;

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

    await role.setColor(targetHex, "Renk kodu /setup color-menu ile senkronize edildi.").catch((error) => {
      console.warn(`[renk-senkron] "${colorRole.label}" rolu guncellenemedi:`, error.message);
    });
  }
}

module.exports = { syncColorRoles };
