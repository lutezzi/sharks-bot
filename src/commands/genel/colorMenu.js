const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const colorRoles = require("../../config/colorRoles");
const { colorMenuEmbed } = require("../../utils/embeds");
const { buildExclusiveSelectRow } = require("../../utils/selectMenus");
const { syncColorRoles } = require("../../utils/syncColorRoles");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color-menu")
    .setDescription(t("commands.renkMenusu.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const missingRoleIds = colorRoles.filter((role) => role.roleId.endsWith("_ROL_ID"));

    if (missingRoleIds.length > 0) {
      await interaction.editReply({ content: t("commands.renkMenusu.missingRoleIds") });
      return;
    }

    await syncColorRoles(interaction.guild).catch(() => {});

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

    await interaction.editReply({ content: t("commands.renkMenusu.success") });
  },
};
