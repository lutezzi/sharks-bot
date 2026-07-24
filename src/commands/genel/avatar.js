const { SlashCommandBuilder } = require("discord.js");
const { avatarEmbed } = require("../../utils/embeds");
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
    await interaction.reply({ embeds: [avatarEmbed(targetUser)] });
  },
};
