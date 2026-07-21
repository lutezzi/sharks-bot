require("dotenv").config();
require("./utils/network");
const { REST, Routes } = require("discord.js");
const { loadCommands } = require("./handlers/loadCommands");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, DEPLOY_MODE } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Hata: .env dosyasinda DISCORD_TOKEN ve CLIENT_ID tanimli olmali.");
  process.exit(1);
}

// Gercek bir client olusturmadan komut listesini toplamak icin sahte bir obje yeterli.
const fakeClient = {};
const commandsJSON = loadCommands(fakeClient);

const rest = new REST().setToken(DISCORD_TOKEN);

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

    console.log("Slash komutlari basariyla kaydedildi.");
  } catch (error) {
    console.error("Komutlar kaydedilirken hata olustu:", error);
  }
})();
