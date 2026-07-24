const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { stopMusic } = require("../../utils/musicPlayer");
const { replyVoice, replyInfo } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("leave").setDescription(t("commands.leave.description")),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await replyInfo(interaction, t("commands.leave.notConnected"));
      return;
    }

    stopMusic(interaction.guild.id);
    await replyVoice(interaction, t("commands.leave.success"), { ephemeral: false });
  },
};
