const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription(t("commands.unmute.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.unmute.options.kullanici")).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription(t("commands.unmute.options.sebep")).setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targetUser = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? undefined;

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      await interaction.editReply({ content: t("commands.unmute.notFound") });
      return;
    }

    if (!targetMember.communicationDisabledUntil) {
      await interaction.editReply({ content: t("commands.unmute.notMuted") });
      return;
    }

    await targetMember.timeout(null, reason);

    await interaction.channel.send({
      embeds: [
        moderationEmbed({
          action: t("commands.unmute.actionName"),
          target: `${targetUser.tag} (${targetUser.id})`,
          moderator: interaction.user,
          reason,
        }),
      ],
    });

    await interaction.editReply({ content: t("commands.unmute.success") });
  },
};
