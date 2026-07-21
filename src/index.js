require("dotenv").config();
require("./utils/network");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { loadCommands } = require("./handlers/loadCommands");
const { loadEvents } = require("./handlers/loadEvents");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    // /join komutunun, komutu kullanan kisinin hangi sesli kanalda oldugunu
    // gorebilmesi icin gerekli.
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.GuildMember, Partials.User],
});

loadCommands(client);
loadEvents(client);

client.login(process.env.DISCORD_TOKEN);

process.on("unhandledRejection", (error) => {
  console.error("Yakalanmamis Promise hatasi:", error);
});
