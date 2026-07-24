const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed } = require("../../utils/embeds");
const { replyError, replySuccess } = require("../../utils/embedReplies");
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
      await replyError(interaction, t("commands.kick.notFound"), { edit: true });
      return;
    }

    if (!targetMember.kickable) {
      await replyError(interaction, t("commands.kick.notKickable"), { edit: true });
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

    await replySuccess(interaction, t("commands.kick.success"), { edit: true });
  },
};
