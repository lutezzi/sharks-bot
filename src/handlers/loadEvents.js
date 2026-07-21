const fs = require("node:fs");
const path = require("node:path");

/**
 * src/events altindaki tum event dosyalarini okuyup client'a baglar.
 * Her event dosyasi { name, once?, execute } seklinde export etmelidir.
 */
function loadEvents(client) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    if (!event?.name || !event?.execute) {
      console.warn(`[UYARI] ${file} dosyasinda "name" veya "execute" eksik, atlaniyor.`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

module.exports = { loadEvents };
