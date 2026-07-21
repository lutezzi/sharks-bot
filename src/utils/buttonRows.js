const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const STYLE_MAP = {
  Primary: ButtonStyle.Primary,
  Secondary: ButtonStyle.Secondary,
  Success: ButtonStyle.Success,
  Danger: ButtonStyle.Danger,
};

const MAX_BUTTONS_PER_ROW = 5;

/**
 * Verilen buton listesini (label/emoji/roleId/style) Discord'un izin verdigi
 * sekilde en fazla 5 satir x 5 buton olacak sekilde ActionRow'lara boler.
 */
function chunkIntoRows(buttons) {
  const rows = [];
  for (let i = 0; i < buttons.length; i += MAX_BUTTONS_PER_ROW) {
    rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + MAX_BUTTONS_PER_ROW)));
  }
  return rows;
}

function buildReactionRoleRows(reactionRoles) {
  const buttons = reactionRoles.map((role) =>
    new ButtonBuilder()
      .setCustomId(`pick-role:${role.roleId}`)
      .setLabel(role.label)
      .setEmoji(role.emoji)
      .setStyle(STYLE_MAP[role.style] ?? ButtonStyle.Secondary)
  );
  return chunkIntoRows(buttons);
}

module.exports = { buildReactionRoleRows };
