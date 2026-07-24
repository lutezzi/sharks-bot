const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { replyVoice, replyError } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("join").setDescription(t("commands.join.description")),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;

    if (!voiceChannel) {
      await replyError(interaction, t("commands.join.notInVoice"));
      return;
    }

    if (!voiceChannel.joinable) {
      await replyError(interaction, t("commands.join.cannotJoin"));
      return;
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    await replyVoice(interaction, t("commands.join.success", { channel: `${voiceChannel}` }), {
      ephemeral: false,
    });
  },
};
