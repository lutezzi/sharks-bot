const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed } = require("../../utils/embeds");
const { replyError, replySuccess } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription(t("commands.ban.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.ban.options.kullanici")).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription(t("commands.ban.options.sebep")).setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("delete-days")
        .setDescription(t("commands.ban.options.mesajSilGun"))
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    ),

  async execute(interaction) {
    // Discord, bir etkilesime en fazla 3 saniye icinde yanit verilmesini
    // bekler. Bu komut birden fazla API cagrisi (uye getir, yasakla)
    // yaptigi icin once hemen "deferReply" ile etkilesimi onaylayip,
    // asil sonucu daha sonra "editReply" ile bildiriyoruz.
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const targetUser = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? undefined;
    const deleteDays = interaction.options.getInteger("delete-days") ?? 0;

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (targetMember && !targetMember.bannable) {
      await replyError(interaction, t("commands.ban.notBannable"), { edit: true });
      return;
    }

    await interaction.guild.members.ban(targetUser.id, {
      reason,
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
    });

    await interaction.channel.send({
      embeds: [
        moderationEmbed({
          action: t("commands.ban.actionName"),
          target: `${targetUser.tag} (${targetUser.id})`,
          moderator: interaction.user,
          reason,
        }),
      ],
    });

    await replySuccess(interaction, t("commands.ban.success"), { edit: true });
  },
};
