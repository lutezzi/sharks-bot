const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
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

    // Ikinci parametre (true) 14 gunden eski mesajlari otomatik olarak
    // filtreler, aksi halde Discord API hata doner.
    const deletedMessages = await interaction.channel.bulkDelete(amount, true);

    if (deletedMessages.size === 0) {
      await interaction.editReply({ content: t("commands.clear.noneDeleted") });
      return;
    }

    await interaction.editReply({
      content: t("commands.clear.success", { count: deletedMessages.size }),
    });
  },
};
