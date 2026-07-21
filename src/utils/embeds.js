const { EmbedBuilder } = require("discord.js");
const { t } = require("./i18n");

// Genel komutlarda (kurallar, renk/cinsiyet/rol menuleri, userinfo, serverinfo,
// avatar, yardim) kullanilan renkler, sunucunun pastel temasiyla uyumlu olmasi
// icin daha yumusak (soft) tonlarda secildi.
const COLORS = {
  primary: 0xc9b6e4,
  success: 0x57f287,
  danger: 0xed4245,
  warning: 0xfee75c,
};

function welcomeEmbed(member) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(t("embeds.welcome.title"))
    .setDescription(t("embeds.welcome.description", { member: `${member}` }))
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields({
      name: t("embeds.welcome.memberCountField"),
      value: `${member.guild.memberCount}`,
      inline: true,
    })
    .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() ?? undefined })
    .setTimestamp();
}

function leaveEmbed(member) {
  return new EmbedBuilder()
    .setColor(COLORS.danger)
    .setTitle(t("embeds.leave.title"))
    .setDescription(t("embeds.leave.description", { userTag: member.user.tag }))
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields({
      name: t("embeds.leave.memberCountField"),
      value: `${member.guild.memberCount}`,
      inline: true,
    })
    .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() ?? undefined })
    .setTimestamp();
}

function rulesEmbed(rulesConfig) {
  const description = rulesConfig.rules
    .map((rule, index) => `**${index + 1}.** ${rule}`)
    .join("\n\n");

  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(rulesConfig.title)
    .setDescription(`${rulesConfig.description}\n\n${description}`)
    .setFooter({ text: rulesConfig.footer })
    .setTimestamp();
}

function colorMenuEmbed() {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(t("embeds.colorMenu.title"))
    .setDescription(t("embeds.colorMenu.description"));
}

function genderMenuEmbed() {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(t("embeds.genderMenu.title"))
    .setDescription(t("embeds.genderMenu.description"));
}

function roleMenuEmbed() {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(t("embeds.roleMenu.title"))
    .setDescription(t("embeds.roleMenu.description"));
}

function moderationEmbed({ action, target, moderator, reason, extra }) {
  return new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(t("embeds.moderation.titleTemplate", { action }))
    .addFields(
      { name: t("embeds.moderation.userField"), value: `${target}`, inline: true },
      { name: t("embeds.moderation.moderatorField"), value: `${moderator}`, inline: true },
      { name: t("embeds.moderation.reasonField"), value: reason || t("embeds.moderation.noReason") },
      ...(extra ? [extra] : [])
    )
    .setTimestamp();
}

module.exports = {
  COLORS,
  welcomeEmbed,
  leaveEmbed,
  rulesEmbed,
  colorMenuEmbed,
  genderMenuEmbed,
  roleMenuEmbed,
  moderationEmbed,
};
