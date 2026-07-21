const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { moderationEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription(t("commands.unban.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option
        .setName("user-id")
        .setDescription(t("commands.unban.options.kullaniciId"))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription(t("commands.unban.options.sebep")).setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const userId = interaction.options.getString("user-id", true).trim();
    const reason = interaction.options.getString("reason") ?? undefined;

    const bans = await interaction.guild.bans.fetch();
    const bannedUser = bans.get(userId)?.user;

    if (!bannedUser) {
      await interaction.editReply({ content: t("commands.unban.notFound") });
      return;
    }

    await interaction.guild.members.unban(userId, reason);

    await interaction.channel.send({
      embeds: [
        moderationEmbed({
          action: t("commands.unban.actionName"),
          target: `${bannedUser.tag} (${bannedUser.id})`,
          moderator: interaction.user,
          reason,
        }),
      ],
    });

    await interaction.editReply({ content: t("commands.unban.success") });
  },
};
