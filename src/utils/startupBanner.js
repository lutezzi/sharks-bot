const { t } = require("./i18n");

// Raw ANSI color codes — no extra dependency. Works in PowerShell,
// Windows Terminal, SSH, and `pm2 logs` output.
const COLOR = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
};

function paint(color, text) {
  return `${COLOR[color]}${text}${COLOR.reset}`;
}

function categoryLabel(category) {
  const label = t(`commands.yardim.categoryNames.${category}`);
  return label.startsWith("commands.yardim.categoryNames.") ? category : label;
}

/**
 * Prints a formatted startup banner with bot tag, guild count/names,
 * and a categorized list of loaded commands.
 */
function printStartupBanner(client) {
  const guilds = [...client.guilds.cache.values()].sort((a, b) => b.memberCount - a.memberCount);
  const totalMembers = guilds.reduce((sum, guild) => sum + (guild.memberCount ?? 0), 0);

  const commandsByCategory = new Map();
  for (const command of client.commands.values()) {
    const category = command.category ?? "genel";
    if (!commandsByCategory.has(category)) commandsByCategory.set(category, []);
    commandsByCategory.get(category).push(command.data.name);
  }

  const width = 58;
  const line = "─".repeat(width);

  console.log(`\n${paint("cyan", line)}`);
  console.log(paint("bold", paint("cyan", `  🦈  ${client.user.tag} — ${t("startup.readyTitle")}`)));
  console.log(paint("cyan", line));

  console.log(
    `${paint("yellow", `🌐 ${t("startup.guildCount")}`)} ${guilds.length}   ${paint("yellow", `👥 ${t("startup.totalMembers")}`)} ${totalMembers}`
  );

  if (guilds.length > 0) {
    console.log(paint("yellow", `\n📋 ${t("startup.guildList")}`));
    for (const guild of guilds) {
      console.log(
        `   • ${guild.name} ${paint("dim", `(${t("startup.guildMemberCount", { count: guild.memberCount ?? "?" })})`)}`
      );
    }
  }

  console.log(paint("yellow", `\n📜 ${t("startup.loadedCommands", { count: client.commands.size })}`));
  for (const [category, names] of [...commandsByCategory].sort(([a], [b]) => a.localeCompare(b))) {
    const commandList = names.sort().map((name) => `/${name}`).join(", ");
    console.log(`   ${paint("magenta", categoryLabel(category))}: ${commandList}`);
  }

  console.log(`${paint("cyan", line)}`);
  console.log(paint("green", `✅ ${t("startup.readyMessage")}\n`));
}

module.exports = { printStartupBanner };
