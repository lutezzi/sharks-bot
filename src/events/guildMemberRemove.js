const { getGuildSettings } = require("../utils/settingsStore");
const { leaveEmbed } = require("../utils/embeds");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);
    if (!settings.leaveChannelId) return;

    const channel = member.guild.channels.cache.get(settings.leaveChannelId);
    if (!channel?.isTextBased()) return;

    await channel.send({ embeds: [leaveEmbed(member)] }).catch((error) => {
      console.error("Ayrilma mesaji gonderilemedi:", error);
    });
  },
};
