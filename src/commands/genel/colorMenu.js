const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { getColorRoles } = require("../../utils/guildConfig");
const { colorMenuEmbed } = require("../../utils/embeds");
const { buildExclusiveSelectRow } = require("../../utils/selectMenus");
const { syncColorRoles } = require("../../utils/syncColorRoles");
const { replyRoles } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color-menu")
    .setDescription(t("commands.renkMenusu.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const colorRoles = getColorRoles(interaction.guild.id);

    if (colorRoles.length === 0) {
      await replyRoles(interaction, t("commands.renkMenusu.missingRoleIds"), "warning", { edit: true });
      return;
    }

    await syncColorRoles(interaction.guild, colorRoles).catch(() => {});

    await interaction.channel.send({
      embeds: [colorMenuEmbed()],
      components: [
        buildExclusiveSelectRow({
          customId: "color-select",
          placeholder: t("selectMenus.colorPlaceholder"),
          roles: colorRoles,
        }),
      ],
    });

    await replyRoles(interaction, t("commands.renkMenusu.success"), "success", { edit: true });
  },
};
