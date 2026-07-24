// Rotating status messages shown in the bot's activity bar.
//
// Edit this list freely: add, change, or remove lines — no code changes
// needed elsewhere. The bot reads from here on startup/restart.
//
// "type" options: "Playing", "Watching", "Listening", "Competing", "Custom"
//
// Placeholders you can use in "text":
//   {guildCount}   -> Total number of guilds the bot is in
//   {memberCount}  -> Approximate total member count across all guilds
module.exports = [
  { text: "/help", type: "Watching" },
  { text: "{guildCount} guilds, {memberCount} members.", type: "Watching" },
  { text: "made by lutezzi", type: "Watching" },
];
