const { SlashCommandBuilder } = require("discord.js");
const { getRulesConfig } = require("../../utils/guildConfig");
const { rulesEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription(t("commands.kurallar.description")),

  async execute(interaction) {
    const rulesConfig = getRulesConfig(interaction.guild.id);
    await interaction.reply({ embeds: [rulesEmbed(rulesConfig)] });
  },
};
