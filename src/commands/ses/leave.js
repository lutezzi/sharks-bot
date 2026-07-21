const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("leave").setDescription(t("commands.leave.description")),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply({ content: t("commands.leave.notConnected"), flags: MessageFlags.Ephemeral });
      return;
    }

    connection.destroy();
    await interaction.reply({ content: t("commands.leave.success") });
  },
};
