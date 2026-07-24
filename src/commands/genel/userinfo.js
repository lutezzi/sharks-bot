const { SlashCommandBuilder } = require("discord.js");
const { userinfoEmbed } = require("../../utils/embeds");
const { t } = require("../../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription(t("commands.userinfo.description"))
    .addUserOption((option) =>
      option.setName("user").setDescription(t("commands.userinfo.options.kullanici")).setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") ?? interaction.user;
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    await interaction.reply({
      embeds: [
        userinfoEmbed({
          user: targetUser,
          member: targetMember,
          guild: interaction.guild,
        }),
      ],
    });
  },
};
