const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require("discord.js");
const { setGuildSetting } = require("../../utils/settingsStore");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription(t("commands.ayarla.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("welcome-channel")
        .setDescription(t("commands.ayarla.welcomeChannel.subcommandDescription"))
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(t("commands.ayarla.welcomeChannel.channelOptionDescription"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("leave-channel")
        .setDescription(t("commands.ayarla.leaveChannel.subcommandDescription"))
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(t("commands.ayarla.leaveChannel.channelOptionDescription"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel");

    if (subcommand === "welcome-channel") {
      setGuildSetting(interaction.guild.id, "welcomeChannelId", channel.id);
      await interaction.reply({
        content: t("commands.ayarla.welcomeChannel.success", { channel: `${channel}` }),
        flags: MessageFlags.Ephemeral,
      });
    } else if (subcommand === "leave-channel") {
      setGuildSetting(interaction.guild.id, "leaveChannelId", channel.id);
      await interaction.reply({
        content: t("commands.ayarla.leaveChannel.success", { channel: `${channel}` }),
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
