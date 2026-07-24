require("dotenv").config();
require("./utils/network");
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const { loadCommands } = require("./handlers/loadCommands");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, DEPLOY_MODE } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Hata: .env dosyasinda DISCORD_TOKEN ve CLIENT_ID tanimli olmali.");
  process.exit(1);
}

const fakeClient = {};
const commandsJSON = loadCommands(fakeClient);
const rest = new REST().setToken(DISCORD_TOKEN);

async function clearGuildCommands(guildIds) {
  for (const guildId of guildIds) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: [] });
    console.log(`Guild komutlari temizlendi: ${guildId}`);
  }
}

async function getBotGuildIds() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  await client.login(DISCORD_TOKEN);
  const guildIds = [...client.guilds.cache.keys()];
  await client.destroy();
  return guildIds;
}

(async () => {
  try {
    const useGuild = (DEPLOY_MODE ?? "guild").toLowerCase() !== "global";

    if (useGuild && !GUILD_ID) {
      console.error("Hata: DEPLOY_MODE=guild icin .env dosyasinda GUILD_ID tanimli olmali.");
      process.exit(1);
    }

    console.log(`${commandsJSON.length} slash komutu kaydediliyor (${useGuild ? "guild" : "global"})...`);

    const route = useGuild
      ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
      : Routes.applicationCommands(CLIENT_ID);

    await rest.put(route, { body: commandsJSON });

    if (!useGuild) {
      const guildIds = await getBotGuildIds();
      if (guildIds.length > 0) {
        console.log("Eski guild komutlari temizleniyor (orn. test /hey)...");
        await clearGuildCommands(guildIds);
      }
    }

    console.log("Slash komutlari basariyla kaydedildi.");
  } catch (error) {
    console.error("Komutlar kaydedilirken hata olustu:", error);
    process.exit(1);
  }
})();
