const { SlashCommandBuilder } = require("discord.js");
const { stopMusic, setVolume, isPlaying } = require("../../utils/musicPlayer");
const { replyMusic, replyInfo } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription(t("commands.music.description"))
    .addSubcommand((sub) =>
      sub.setName("stop").setDescription(t("commands.music.stop.subcommandDescription"))
    )
    .addSubcommand((sub) =>
      sub
        .setName("volume")
        .setDescription(t("commands.music.volume.subcommandDescription"))
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription(t("commands.music.volume.levelOptionDescription"))
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("now-playing").setDescription(t("commands.music.nowPlaying.subcommandDescription"))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (subcommand === "stop") {
      stopMusic(guildId);
      await replyMusic(interaction, t("commands.music.stop.success"));
      return;
    }

    if (subcommand === "volume") {
      const level = interaction.options.getInteger("level");
      const normalized = level / 100;

      if (!isPlaying(guildId)) {
        await replyInfo(interaction, t("commands.music.volume.notPlaying"));
        return;
      }

      setVolume(guildId, normalized);
      await replyMusic(interaction, t("commands.music.volume.success", { level }));
      return;
    }

    if (subcommand === "now-playing") {
      const text = isPlaying(guildId)
        ? t("commands.music.nowPlaying.playing")
        : t("commands.music.nowPlaying.notPlaying");
      await replyMusic(interaction, text);
    }
  },
};
