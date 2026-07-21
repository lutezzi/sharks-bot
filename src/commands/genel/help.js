const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { COLORS } = require("../../utils/embeds");
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

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(t("commands.yardim.embedTitle"))
      .setDescription(t("commands.yardim.embedDescription"))
      .setTimestamp();

    for (const [category, commands] of [...commandsByCategory].sort(([a], [b]) => a.localeCompare(b))) {
      const categoryLabel = t(`commands.yardim.categoryNames.${category}`);
      const commandList = commands
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map((command) => `**/${command.data.name}** — ${command.data.description}`)
        .join("\n");

      embed.addFields({ name: categoryLabel, value: commandList });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
