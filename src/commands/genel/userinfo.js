const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { COLORS } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription(t("commands.userinfo.description"))
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.userinfo.options.kullanici")).setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") ?? interaction.user;
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(
        targetMember?.displayHexColor && targetMember.displayHexColor !== "#000000"
          ? targetMember.displayHexColor
          : COLORS.primary
      )
      .setTitle(t("commands.userinfo.embedTitle", { tag: targetUser.tag }))
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: t("commands.userinfo.idField"), value: targetUser.id, inline: true },
        {
          name: t("commands.userinfo.accountCreatedField"),
          value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`,
          inline: true,
        }
      )
      .setTimestamp();

    if (targetMember) {
      const roles = targetMember.roles.cache
        .filter((role) => role.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position)
        .map((role) => `${role}`);

      embed.addFields(
        {
          name: t("commands.userinfo.joinedField"),
          value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: t("commands.userinfo.rolesField", { count: roles.length }),
          value: roles.length > 0 ? roles.join(", ") : t("commands.userinfo.noRoles"),
        }
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
