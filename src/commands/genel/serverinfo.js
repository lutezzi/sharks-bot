const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { COLORS } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("serverinfo").setDescription(t("commands.serverinfo.description")),

  async execute(interaction) {
    const { guild } = interaction;
    const owner = await guild.fetchOwner().catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(t("commands.serverinfo.embedTitle", { name: guild.name }))
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: t("commands.serverinfo.idField"), value: guild.id, inline: true },
        { name: t("commands.serverinfo.ownerField"), value: owner ? `${owner.user.tag}` : "—", inline: true },
        {
          name: t("commands.serverinfo.createdField"),
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        { name: t("commands.serverinfo.memberCountField"), value: `${guild.memberCount}`, inline: true },
        { name: t("commands.serverinfo.roleCountField"), value: `${guild.roles.cache.size}`, inline: true },
        { name: t("commands.serverinfo.channelCountField"), value: `${guild.channels.cache.size}`, inline: true },
        {
          name: t("commands.serverinfo.boostField"),
          value: t("commands.serverinfo.boostValue", {
            tier: guild.premiumTier,
            count: guild.premiumSubscriptionCount ?? 0,
          }),
          inline: true,
        }
      )
      .setFooter({ text: guild.name, iconURL: guild.iconURL() ?? undefined })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
