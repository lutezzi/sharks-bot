const { ActivityType } = require("discord.js");
const activities = require("../config/activities");

const ACTIVITY_TYPE_MAP = {
  Playing: ActivityType.Playing,
  Watching: ActivityType.Watching,
  Listening: ActivityType.Listening,
  Competing: ActivityType.Competing,
  Custom: ActivityType.Custom,
};

function interpolate(text, client) {
  const memberCount = client.guilds.cache.reduce((sum, guild) => sum + (guild.memberCount ?? 0), 0);

  return text
    .replace(/\{guildCount\}/g, `${client.guilds.cache.size}`)
    .replace(/\{memberCount\}/g, `${memberCount}`)
    .replace(/\{sunucuSayisi\}/g, `${client.guilds.cache.size}`)
    .replace(/\{uyeSayisi\}/g, `${memberCount}`);
}

/**
 * src/config/activities.js icindeki yazilari sirayla belirli araliklarla
 * bot durumuna (activity) yansitir ve bot durumunu "idle" yapar.
 * Donen setInterval referansini geri dondurur (istenirse durdurulabilir).
 */
function startActivityRotation(client, intervalMs = 10_000) {
  if (!activities.length) return null;

  let index = 0;

  const applyNextActivity = () => {
    const activity = activities[index % activities.length];
    index += 1;

    client.user.setPresence({
      status: "idle",
      activities: [
        {
          name: interpolate(activity.text, client),
          type: ACTIVITY_TYPE_MAP[activity.type] ?? ActivityType.Watching,
        },
      ],
    });
  };

  applyNextActivity();
  return setInterval(applyNextActivity, intervalMs);
}

module.exports = { startActivityRotation };
