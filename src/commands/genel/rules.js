const { SlashCommandBuilder } = require("discord.js");
const rulesConfig = require("../../config/rules");
const { rulesEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription(t("commands.kurallar.description")),

  async execute(interaction) {
    await interaction.reply({ embeds: [rulesEmbed(rulesConfig)] });
  },
};
