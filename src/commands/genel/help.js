const { SlashCommandBuilder } = require("discord.js");
const { helpEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription(t("commands.yardim.description")),

  async execute(interaction) {
    const commandsByCategory = new Map();

    for (const command of interaction.client.commands.values()) {
      const category = command.category ?? "genel";
      if (!commandsByCategory.has(category)) commandsByCategory.set(category, []);
      commandsByCategory.get(category).push(command);
    }

    await interaction.reply({ embeds: [helpEmbed(commandsByCategory)] });
  },
};
