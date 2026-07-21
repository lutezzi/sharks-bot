const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const reactionRoles = require("../../config/reactionRoles");
const { roleMenuEmbed } = require("../../utils/embeds");
const { buildReactionRoleRows } = require("../../utils/buttonRows");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-menu")
    .setDescription(t("commands.rolMenusu.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const missingRoleIds = reactionRoles.filter((role) => role.roleId.endsWith("_ROL_ID"));

    if (missingRoleIds.length > 0) {
      await interaction.editReply({ content: t("commands.rolMenusu.missingRoleIds") });
      return;
    }

    await interaction.channel.send({
      embeds: [roleMenuEmbed()],
      components: buildReactionRoleRows(reactionRoles),
    });

    await interaction.editReply({ content: t("commands.rolMenusu.success") });
  },
};
