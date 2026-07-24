const { Routes } = require("discord.js");
const { syncColorRoles } = require("../utils/syncColorRoles");
const { getColorRoles } = require("../utils/guildConfig");
const { startActivityRotation } = require("../utils/activityRotator");
const { printStartupBanner } = require("../utils/startupBanner");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    printStartupBanner(client);

    startActivityRotation(client, 10_000);

    const warmupStart = Date.now();
    try {
      await client.rest.get(Routes.gateway());
      console.log(`REST baglantisi hazirlandi (${Date.now() - warmupStart}ms).`);
    } catch (error) {
      console.warn("REST baglantisi hazirlanirken hata olustu:", error.message);
    }

    for (const guild of client.guilds.cache.values()) {
      const colorRoles = getColorRoles(guild.id);
      if (colorRoles.length === 0) continue;

      await syncColorRoles(guild, colorRoles).catch((error) => {
        console.warn(`"${guild.name}" sunucusunda renk rolleri senkronize edilemedi:`, error.message);
      });
    }

    setTimeout(() => {
      console.log(`Gateway (websocket) gecikmesi: ${client.ws.ping}ms`);
    }, 5000);
  },
};
