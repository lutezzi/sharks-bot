const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed, fieldName } = require("../../utils/embeds");
const { replyError, replySuccess } = require("../../utils/embedReplies");
const { parseDuration } = require("../../utils/duration");
const { t } = require("../../utils/i18n");

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000; // Discord siniri: 28 gun

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription(t("commands.mute.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.mute.options.kullanici")).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("duration").setDescription(t("commands.mute.options.sure")).setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription(t("commands.mute.options.sebep")).setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targetUser = interaction.options.getUser("user", true);
    const durationInput = interaction.options.getString("duration") ?? "10m";
    const reason = interaction.options.getString("reason") ?? undefined;

    const duration = parseDuration(durationInput);

    if (!duration) {
      await replyError(interaction, t("commands.mute.invalidDuration"), { edit: true });
      return;
    }

    if (duration.ms > MAX_TIMEOUT_MS) {
      await replyError(interaction, t("commands.mute.durationTooLong"), { edit: true });
      return;
    }

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      await replyError(interaction, t("commands.mute.notFound"), { edit: true });
      return;
    }

    if (!targetMember.moderatable) {
      await replyError(interaction, t("commands.mute.notModeratable"), { edit: true });
      return;
    }

    await targetMember.timeout(duration.ms, reason);

    await interaction.channel.send({
      embeds: [
        moderationEmbed({
          action: t("commands.mute.actionName"),
          target: `${targetUser.tag} (${targetUser.id})`,
          moderator: interaction.user,
          reason,
          extra: { name: fieldName(t("embeds.moderation.durationField")), value: duration.label, inline: true },
        }),
      ],
    });

    await replySuccess(interaction, t("commands.mute.success"), { edit: true });
  },
};
