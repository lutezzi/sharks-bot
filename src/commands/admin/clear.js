const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { replySuccess, replyWarning } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(t("commands.clear.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(t("commands.clear.options.miktar"))
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const amount = interaction.options.getInteger("amount", true);

    const deletedMessages = await interaction.channel.bulkDelete(amount, true);

    if (deletedMessages.size === 0) {
      await replyWarning(interaction, t("commands.clear.noneDeleted"), { edit: true });
      return;
    }

    await replySuccess(interaction, t("commands.clear.success", { count: deletedMessages.size }), { edit: true });
  },
};
