const { Routes } = require("discord.js");
const { syncColorRoles } = require("../utils/syncColorRoles");
const { startActivityRotation } = require("../utils/activityRotator");
const { printStartupBanner } = require("../utils/startupBanner");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    printStartupBanner(client);

    // Durumu "idle" yapar ve src/config/activities.js icindeki yazilari
    // 10 saniyede bir sirayla activity olarak gosterir.
    startActivityRotation(client, 10_000);

    // Yavas/kisitli aglarda ilk REST istegi (TLS baglantisi) birkac saniye
    // surebiliyor; bu da ilk slash komutunda Discord'un 3 saniyelik
    // yanit suresini asip "Unknown interaction" hatasina yol aciyor.
    // Baglantiyi burada erkenden "isitarak" ilk gercek komuttan once hazir
    // hale getiriyoruz.
    const warmupStart = Date.now();
    try {
      await client.rest.get(Routes.gateway());
      console.log(`REST baglantisi hazirlandi (${Date.now() - warmupStart}ms).`);
    } catch (error) {
      console.warn("REST baglantisi hazirlanirken hata olustu:", error.message);
    }

    for (const guild of client.guilds.cache.values()) {
      await syncColorRoles(guild).catch((error) => {
        console.warn(`"${guild.name}" sunucusunda renk rolleri senkronize edilemedi:`, error.message);
      });
    }

    // Ilk heartbeat'ten sonra gateway (websocket) gecikmesini logla.
    // Bu deger surekli yuksekse (>500ms), REST baglantisindan bagimsiz
    // olarak gateway tarafinda da bir ag sorunu oldugunu gosterir.
    setTimeout(() => {
      console.log(`Gateway (websocket) gecikmesi: ${client.ws.ping}ms`);
    }, 5000);
  },
};
