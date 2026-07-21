const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("join").setDescription(t("commands.join.description")),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;

    if (!voiceChannel) {
      await interaction.reply({ content: t("commands.join.notInVoice"), flags: MessageFlags.Ephemeral });
      return;
    }

    if (!voiceChannel.joinable) {
      await interaction.reply({ content: t("commands.join.cannotJoin"), flags: MessageFlags.Ephemeral });
      return;
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    await interaction.reply({ content: t("commands.join.success", { channel: `${voiceChannel}` }) });
  },
};
