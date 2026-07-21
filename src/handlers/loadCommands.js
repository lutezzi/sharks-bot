const fs = require("node:fs");
const path = require("node:path");
const { Collection } = require("discord.js");

/**
 * src/commands altindaki (alt klasorler dahil) tum komut dosyalarini okuyup
 * client.commands koleksiyonuna ekler. Her komut dosyasi { data, execute }
 * seklinde export etmelidir.
 */
function loadCommands(client) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");
  const categoryFolders = fs.readdirSync(commandsPath);

  const commandsJSON = [];

  for (const category of categoryFolders) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const commandFiles = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join(categoryPath, file));

      if (!command?.data || !command?.execute) {
        console.warn(`[UYARI] ${file} dosyasinda "data" veya "execute" eksik, atlaniyor.`);
        continue;
      }

      // Klasor adini kategori olarak isaretle (orn. "/yardim" komutunun
      // komutlari kategorilere ayirarak listeleyebilmesi icin).
      command.category = category;

      client.commands.set(command.data.name, command);
      commandsJSON.push(command.data.toJSON());
    }
  }

  return commandsJSON;
}

module.exports = { loadCommands };
