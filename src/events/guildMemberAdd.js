const { getGuildSettings } = require("../utils/settingsStore");
const { welcomeEmbed } = require("../utils/embeds");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);
    if (!settings.welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
    if (!channel?.isTextBased()) return;

    await channel.send({ embeds: [welcomeEmbed(member)] }).catch((error) => {
      console.error("Hosgeldin mesaji gonderilemedi:", error);
    });
  },
};
