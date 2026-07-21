const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const genderRoles = require("../../config/genderRoles");
const { genderMenuEmbed } = require("../../utils/embeds");
const { buildExclusiveSelectRow } = require("../../utils/selectMenus");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gender-menu")
    .setDescription(t("commands.cinsiyetMenusu.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const missingRoleIds = genderRoles.filter((role) => role.roleId.endsWith("_ROL_ID"));

    if (missingRoleIds.length > 0) {
      await interaction.editReply({ content: t("commands.cinsiyetMenusu.missingRoleIds") });
      return;
    }

    await interaction.channel.send({
      embeds: [genderMenuEmbed()],
      components: [
        buildExclusiveSelectRow({
          customId: "gender-select",
          placeholder: t("selectMenus.genderPlaceholder"),
          roles: genderRoles,
        }),
      ],
    });

    await interaction.editReply({ content: t("commands.cinsiyetMenusu.success") });
  },
};
