const { SlashCommandBuilder } = require("discord.js");
const { t, setUserLocale, runWithLocale, isSupportedLocale } = require("../../utils/i18n");
const { replyError, replySuccess } = require("../../utils/embedReplies");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("language")
    .setDescription(t("commands.language.description"))
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription(t("commands.language.options.code"))
        .setRequired(true)
        .addChoices(
          { name: "Türkçe", value: "tr" },
          { name: "English", value: "en" }
        )
    ),

  async execute(interaction) {
    const code = interaction.options.getString("code", true);

    if (!isSupportedLocale(code)) {
      await replyError(interaction, t("commands.language.invalid"));
      return;
    }

    setUserLocale(interaction.user.id, code);

    await runWithLocale(code, async () => {
      await replySuccess(
        interaction,
        t("commands.language.success", { language: t(`commands.language.names.${code}`) })
      );
    });
  },
};
