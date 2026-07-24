const { SlashCommandBuilder } = require("discord.js");
const { playLofi } = require("../../utils/musicPlayer");
const { replyMusic, replyError } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lofi")
    .setDescription(t("commands.lofi.description")),

  async execute(interaction) {
    await interaction.deferReply();

    const voiceChannel = interaction.member.voice?.channel;

    if (!voiceChannel) {
      await replyError(interaction, t("commands.lofi.notInVoice"), { edit: true, ephemeral: false });
      return;
    }

    if (!voiceChannel.joinable) {
      await replyError(interaction, t("commands.lofi.cannotJoin"), { edit: true, ephemeral: false });
      return;
    }

    try {
      await playLofi(voiceChannel);
      await replyMusic(interaction, t("commands.lofi.success", { channel: `${voiceChannel}` }), {
        edit: true,
        ephemeral: false,
      });
    } catch (error) {
      console.error("[lofi] Calma hatasi:", error);
      await replyError(interaction, t("commands.lofi.playbackError"), { edit: true, ephemeral: false });
    }
  },
};
