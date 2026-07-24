const { SlashCommandBuilder } = require("discord.js");
const { serverinfoEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("serverinfo").setDescription(t("commands.serverinfo.description")),

  async execute(interaction) {
    const owner = await interaction.guild.fetchOwner().catch(() => null);

    await interaction.reply({
      embeds: [serverinfoEmbed({ guild: interaction.guild, owner })],
    });
  },
};
