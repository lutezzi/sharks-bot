const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { t } = require("./i18n");

const REMOVE_VALUE = "__remove__";

/**
 * Tek secimlik (mutually exclusive) bir rol dropdown'u olusturur.
 * Listeye otomatik olarak secimi kaldirmaya yarayan "Kaldir" secenegini ekler.
 */
function buildExclusiveSelectRow({ customId, placeholder, roles }) {
  const options = roles.map((role) =>
    new StringSelectMenuOptionBuilder().setLabel(role.label).setValue(role.roleId).setEmoji(role.emoji)
  );

  options.push(
    new StringSelectMenuOptionBuilder()
      .setLabel(t("selectMenus.removeOption.label"))
      .setValue(REMOVE_VALUE)
      .setEmoji(t("selectMenus.removeOption.emoji"))
      .setDescription(t("selectMenus.removeOption.description"))
  );

  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .addOptions(options);

  return new ActionRowBuilder().addComponents(menu);
}

module.exports = { buildExclusiveSelectRow, REMOVE_VALUE };
