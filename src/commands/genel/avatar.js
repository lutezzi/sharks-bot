const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { COLORS } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription(t("commands.avatar.description"))
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.avatar.options.kullanici")).setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") ?? interaction.user;

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(t("commands.avatar.embedTitle", { tag: targetUser.tag }))
      .setImage(targetUser.displayAvatarURL({ size: 1024 }))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
