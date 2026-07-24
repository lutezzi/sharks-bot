const { EmbedBuilder } = require("discord.js");
const { t } = require("./i18n");

const COLORS = {
  primary: 0xc9b6e4,
  accent: 0xa8c69f,
  success: 0x8fcca8,
  danger: 0xe8a0a0,
  warning: 0xe8d5a3,
  info: 0xb6d4e8,
  music: 0x9b8fd4,
  voice: 0xb6b8e8,
  moderation: 0xe8c896,
  setup: 0xc9b6e4,
  roles: 0xa8c69f,
};

const SHARK_DIVIDER = "▰▱▰▱▰▱▰▰▰▱▰▱▰▱▱";

function frameTitle(icon, label) {
  return `┊ ${icon} ${label} ┊`;
}

function fieldName(label) {
  return `${t("embeds.fieldPrefix")} ${label}`;
}

function kickerText(key) {
  const label = t(`embeds.kickers.${key}`);
  return `✦ ${label.toUpperCase()}`;
}

function buildDescription({ kicker, body }) {
  const parts = [];
  if (kicker) parts.push(kickerText(kicker), SHARK_DIVIDER, "");
  if (body) parts.push(body);
  return parts.join("\n").trim();
}

function applyBrand(embed, { footer, footerIcon, timestamp = true, author = true } = {}) {
  if (author) {
    embed.setAuthor({ name: t("embeds.brand.author") });
  }
  embed.setFooter({
    text: footer ?? t("embeds.brand.footer"),
    iconURL: footerIcon ?? undefined,
  });
  if (timestamp) embed.setTimestamp();
  return embed;
}

function createSharkEmbed({
  color = COLORS.primary,
  kicker,
  title,
  description,
  fields = [],
  thumbnail,
  image,
  footer,
  footerIcon,
  timestamp = true,
  author = true,
}) {
  const embed = new EmbedBuilder().setColor(color);

  if (title) embed.setTitle(title);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);

  const body = buildDescription({ kicker, body: description });
  if (body) embed.setDescription(body);

  if (fields.length > 0) embed.addFields(fields);

  return applyBrand(embed, { footer, footerIcon, timestamp, author });
}

function successEmbed({ title, description, fields, footer, kicker = "success" }) {
  return createSharkEmbed({
    color: COLORS.success,
    kicker,
    title,
    description,
    fields,
    footer,
  });
}

function errorEmbed({ title, description, fields, footer, kicker = "error" }) {
  return createSharkEmbed({
    color: COLORS.danger,
    kicker,
    title,
    description,
    fields,
    footer,
  });
}

function warningEmbed({ title, description, fields, footer, kicker = "warning" }) {
  return createSharkEmbed({
    color: COLORS.warning,
    kicker,
    title,
    description,
    fields,
    footer,
  });
}

function infoEmbed({ title, description, fields, footer, kicker = "info" }) {
  return createSharkEmbed({
    color: COLORS.info,
    kicker,
    title,
    description,
    fields,
    footer,
  });
}

function musicEmbed({ title, description, fields, footer }) {
  return createSharkEmbed({
    color: COLORS.music,
    kicker: "music",
    title,
    description,
    fields,
    footer,
  });
}

function voiceEmbed({ title, description, fields, footer }) {
  return createSharkEmbed({
    color: COLORS.voice,
    kicker: "voice",
    title,
    description,
    fields,
    footer,
  });
}

function setupEmbed({ title, description, fields, footer, variant = "success" }) {
  const colorMap = { success: COLORS.success, error: COLORS.danger, warning: COLORS.warning, info: COLORS.info };
  return createSharkEmbed({
    color: colorMap[variant] ?? COLORS.setup,
    kicker: "setup",
    title,
    description,
    fields,
    footer,
  });
}

function rolesEmbed({ title, description, fields, footer, variant = "success" }) {
  const colorMap = { success: COLORS.roles, error: COLORS.danger, warning: COLORS.warning, info: COLORS.info };
  return createSharkEmbed({
    color: colorMap[variant] ?? COLORS.roles,
    kicker: "roles",
    title,
    description,
    fields,
    footer,
  });
}

function welcomeEmbed(member) {
  return createSharkEmbed({
    color: COLORS.success,
    kicker: "welcome",
    title: frameTitle("👋", t("embeds.welcome.title")),
    description: t("embeds.welcome.description", { member: `${member}` }),
    thumbnail: member.user.displayAvatarURL({ size: 256 }),
    fields: [
      {
        name: fieldName(t("embeds.welcome.memberCountField")),
        value: `\`${member.guild.memberCount}\``,
        inline: true,
      },
    ],
    footer: member.guild.name,
    footerIcon: member.guild.iconURL() ?? undefined,
  });
}

function leaveEmbed(member) {
  return createSharkEmbed({
    color: COLORS.danger,
    kicker: "leave",
    title: frameTitle("🌊", t("embeds.leave.title")),
    description: t("embeds.leave.description", { userTag: member.user.tag }),
    thumbnail: member.user.displayAvatarURL({ size: 256 }),
    fields: [
      {
        name: fieldName(t("embeds.leave.memberCountField")),
        value: `\`${member.guild.memberCount}\``,
        inline: true,
      },
    ],
    footer: member.guild.name,
    footerIcon: member.guild.iconURL() ?? undefined,
  });
}

function rulesEmbed(rulesConfig) {
  const rulesList = rulesConfig.rules
    .map((rule, index) => `\`${String(index + 1).padStart(2, "0")}\` ‣ ${rule}`)
    .join("\n");

  return createSharkEmbed({
    color: COLORS.primary,
    kicker: "rules",
    title: frameTitle("📜", rulesConfig.title.replace(/^📜\s*/, "")),
    description: `${rulesConfig.description}\n\n${rulesList}`,
    footer: rulesConfig.footer,
    author: true,
  });
}

function colorMenuEmbed() {
  return createSharkEmbed({
    color: COLORS.accent,
    kicker: "roles",
    title: frameTitle("🎨", t("embeds.colorMenu.title").replace(/^🎨\s*/, "")),
    description: t("embeds.colorMenu.description"),
    footer: t("embeds.menuFooter"),
  });
}

function genderMenuEmbed() {
  return createSharkEmbed({
    color: COLORS.primary,
    kicker: "roles",
    title: frameTitle("🚻", t("embeds.genderMenu.title").replace(/^🚻\s*/, "")),
    description: t("embeds.genderMenu.description"),
    footer: t("embeds.menuFooter"),
  });
}

function roleMenuEmbed() {
  return createSharkEmbed({
    color: COLORS.roles,
    kicker: "roles",
    title: frameTitle("🏷️", t("embeds.roleMenu.title").replace(/^🏷️\s*/, "")),
    description: t("embeds.roleMenu.description"),
    footer: t("embeds.menuFooter"),
  });
}

function moderationEmbed({ action, target, moderator, reason, extra }) {
  return createSharkEmbed({
    color: COLORS.moderation,
    kicker: "moderation",
    title: frameTitle("🔨", action),
    fields: [
      { name: fieldName(t("embeds.moderation.userField")), value: `${target}`, inline: true },
      { name: fieldName(t("embeds.moderation.moderatorField")), value: `${moderator}`, inline: true },
      {
        name: fieldName(t("embeds.moderation.reasonField")),
        value: reason || t("embeds.moderation.noReason"),
      },
      ...(extra ? [extra] : []),
    ],
  });
}

function userinfoEmbed({ user, member, guild }) {
  const color =
    member?.displayHexColor && member.displayHexColor !== "#000000"
      ? parseInt(member.displayHexColor.replace("#", ""), 16)
      : COLORS.primary;

  const embed = createSharkEmbed({
    color,
    kicker: "profile",
    title: frameTitle("👤", user.tag),
    thumbnail: user.displayAvatarURL({ size: 256 }),
    fields: [
      { name: fieldName(t("commands.userinfo.idField")), value: `\`${user.id}\``, inline: true },
      {
        name: fieldName(t("commands.userinfo.accountCreatedField")),
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    ],
    footer: guild.name,
    footerIcon: guild.iconURL() ?? undefined,
  });

  if (member) {
    const roles = member.roles.cache
      .filter((role) => role.id !== guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => `${role}`);

    embed.addFields(
      {
        name: fieldName(t("commands.userinfo.joinedField")),
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true,
      },
      {
        name: fieldName(t("commands.userinfo.rolesField", { count: roles.length })),
        value: roles.length > 0 ? roles.join(", ") : t("commands.userinfo.noRoles"),
      }
    );
  }

  return embed;
}

function serverinfoEmbed({ guild, owner }) {
  return createSharkEmbed({
    color: COLORS.primary,
    kicker: "server",
    title: frameTitle("🏰", guild.name),
    thumbnail: guild.iconURL({ size: 256 }) ?? undefined,
    fields: [
      { name: fieldName(t("commands.serverinfo.idField")), value: `\`${guild.id}\``, inline: true },
      {
        name: fieldName(t("commands.serverinfo.ownerField")),
        value: owner ? `${owner.user}` : "—",
        inline: true,
      },
      {
        name: fieldName(t("commands.serverinfo.createdField")),
        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
      {
        name: fieldName(t("commands.serverinfo.memberCountField")),
        value: `\`${guild.memberCount}\``,
        inline: true,
      },
      {
        name: fieldName(t("commands.serverinfo.roleCountField")),
        value: `\`${guild.roles.cache.size}\``,
        inline: true,
      },
      {
        name: fieldName(t("commands.serverinfo.channelCountField")),
        value: `\`${guild.channels.cache.size}\``,
        inline: true,
      },
      {
        name: fieldName(t("commands.serverinfo.boostField")),
        value: t("commands.serverinfo.boostValue", {
          tier: guild.premiumTier,
          count: guild.premiumSubscriptionCount ?? 0,
        }),
        inline: true,
      },
    ],
    footer: guild.name,
    footerIcon: guild.iconURL() ?? undefined,
  });
}

function avatarEmbed(user) {
  return createSharkEmbed({
    color: COLORS.primary,
    kicker: "profile",
    title: frameTitle("🖼️", user.tag),
    description: t("embeds.avatarHint"),
    image: user.displayAvatarURL({ size: 1024 }),
  });
}

function helpEmbed(commandsByCategory) {
  const embed = createSharkEmbed({
    color: COLORS.primary,
    kicker: "help",
    title: frameTitle("📖", t("commands.yardim.embedTitle").replace(/^📖\s*/, "")),
    description: t("commands.yardim.embedDescription"),
  });

  for (const [category, commands] of [...commandsByCategory].sort(([a], [b]) => a.localeCompare(b))) {
    const categoryLabel = t(`commands.yardim.categoryNames.${category}`);
    const commandList = commands
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map((command) => `${t("embeds.commandBullet")} \`/${command.data.name}\` — ${command.data.description}`)
      .join("\n");

    embed.addFields({ name: categoryLabel, value: commandList });
  }

  return embed;
}

function messageEmbed(text, variant = "info") {
  const builders = { success: successEmbed, error: errorEmbed, warning: warningEmbed, info: infoEmbed, music: musicEmbed, voice: voiceEmbed };
  const build = builders[variant] ?? infoEmbed;
  const clean = text.replace(/^[^\w]*\s*/, "");
  return build({ description: clean });
}

module.exports = {
  COLORS,
  SHARK_DIVIDER,
  frameTitle,
  fieldName,
  createSharkEmbed,
  successEmbed,
  errorEmbed,
  warningEmbed,
  infoEmbed,
  musicEmbed,
  voiceEmbed,
  setupEmbed,
  rolesEmbed,
  messageEmbed,
  welcomeEmbed,
  leaveEmbed,
  rulesEmbed,
  colorMenuEmbed,
  genderMenuEmbed,
  roleMenuEmbed,
  moderationEmbed,
  userinfoEmbed,
  serverinfoEmbed,
  avatarEmbed,
  helpEmbed,
};
