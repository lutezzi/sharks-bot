const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { getGenderRoles } = require("../../utils/guildConfig");
const { genderMenuEmbed } = require("../../utils/embeds");
const { buildExclusiveSelectRow } = require("../../utils/selectMenus");
const { replyRoles } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gender-menu")
    .setDescription(t("commands.cinsiyetMenusu.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const genderRoles = getGenderRoles(interaction.guild.id);

    if (genderRoles.length === 0) {
      await replyRoles(interaction, t("commands.cinsiyetMenusu.missingRoleIds"), "warning", { edit: true });
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

    await replyRoles(interaction, t("commands.cinsiyetMenusu.success"), "success", { edit: true });
  },
};
