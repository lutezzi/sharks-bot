const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed } = require("../../utils/embeds");
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
      await interaction.editReply({ content: t("commands.mute.invalidDuration") });
      return;
    }

    if (duration.ms > MAX_TIMEOUT_MS) {
      await interaction.editReply({ content: t("commands.mute.durationTooLong") });
      return;
    }

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      await interaction.editReply({ content: t("commands.mute.notFound") });
      return;
    }

    if (!targetMember.moderatable) {
      await interaction.editReply({ content: t("commands.mute.notModeratable") });
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
          extra: { name: t("embeds.moderation.durationField"), value: duration.label, inline: true },
        }),
      ],
    });

    await interaction.editReply({ content: t("commands.mute.success") });
  },
};
