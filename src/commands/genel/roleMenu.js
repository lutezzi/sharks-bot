const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { getReactionRoles } = require("../../utils/guildConfig");
const { roleMenuEmbed } = require("../../utils/embeds");
const { buildReactionRoleRows } = require("../../utils/buttonRows");
const { replyRoles } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-menu")
    .setDescription(t("commands.rolMenusu.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const reactionRoles = getReactionRoles(interaction.guild.id);

    if (reactionRoles.length === 0) {
      await replyRoles(interaction, t("commands.rolMenusu.missingRoleIds"), "warning", { edit: true });
      return;
    }

    await interaction.channel.send({
      embeds: [roleMenuEmbed()],
      components: buildReactionRoleRows(reactionRoles),
    });

    await replyRoles(interaction, t("commands.rolMenusu.success"), "success", { edit: true });
  },
};
