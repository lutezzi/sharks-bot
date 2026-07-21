const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription(t("commands.kick.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.kick.options.kullanici")).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription(t("commands.kick.options.sebep")).setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targetUser = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? undefined;

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      await interaction.editReply({ content: t("commands.kick.notFound") });
      return;
    }

    if (!targetMember.kickable) {
      await interaction.editReply({ content: t("commands.kick.notKickable") });
      return;
    }

    await targetMember.kick(reason);

    await interaction.channel.send({
      embeds: [
        moderationEmbed({
          action: t("commands.kick.actionName"),
          target: `${targetUser.tag} (${targetUser.id})`,
          moderator: interaction.user,
          reason,
        }),
      ],
    });

    await interaction.editReply({ content: t("commands.kick.success") });
  },
};
