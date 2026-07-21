const { MessageFlags } = require("discord.js");
const colorRoles = require("../config/colorRoles");
const genderRoles = require("../config/genderRoles");
const { REMOVE_VALUE } = require("../utils/selectMenus");
const { t } = require("../utils/i18n");

async function handleSlashCommand(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`Bilinmeyen komut calistirilmaya calisildi: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`"${interaction.commandName}" komutunda hata:`, error);

    const errorMessage = { content: t("interactions.genericCommandError"), flags: MessageFlags.Ephemeral };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage).catch(() => {});
    } else {
      await interaction.reply(errorMessage).catch(() => {});
    }
  }
}

/**
 * Tek secimlik (mutually exclusive) rol dropdown'lari icin ortak mantik.
 * Kullanici listeden bir secenek sectiginde, ayni listedeki diger tum
 * roller kaldirilir ve sadece secilen rol eklenir. "Kaldir" secilirse
 * listedeki tum roller kullanicidan sokulur.
 */
async function handleExclusiveRoleSelect(interaction, roleList, labelKey) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const member = interaction.member;
  const selectedValue = interaction.values[0];
  const allRoleIds = roleList.map((role) => role.roleId);
  const label = t(labelKey);

  const rolesToRemove = allRoleIds.filter((id) => member.roles.cache.has(id) && id !== selectedValue);
  if (rolesToRemove.length > 0) {
    await member.roles.remove(rolesToRemove).catch(() => {});
  }

  if (selectedValue === REMOVE_VALUE) {
    await interaction.editReply({ content: t("interactions.exclusiveRoleRemoved", { label }) });
    return;
  }

  await member.roles.add(selectedValue);
  await interaction.editReply({ content: t("interactions.exclusiveRoleSet", { label }) });
}

/**
 * Rol menusu: roller birbirini DISLAMAZ, her buton kendi rolunu
 * acar/kapatir (toggle).
 */
async function handleReactionRoleButton(interaction, roleId) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const member = interaction.member;
  const alreadyHasRole = member.roles.cache.has(roleId);

  if (alreadyHasRole) {
    await member.roles.remove(roleId);
    await interaction.editReply({ content: t("interactions.reactionRoleRemoved") });
  } else {
    await member.roles.add(roleId);
    await interaction.editReply({ content: t("interactions.reactionRoleAdded") });
  }
}

async function handleButton(interaction) {
  const [type, roleId] = interaction.customId.split(":");

  try {
    if (type === "pick-role") {
      await handleReactionRoleButton(interaction, roleId);
    }
  } catch (error) {
    console.error("Buton etkilesiminde hata:", error);
    const reply = { content: t("interactions.genericComponentError"), flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
}

async function handleSelectMenu(interaction) {
  try {
    if (interaction.customId === "color-select") {
      await handleExclusiveRoleSelect(interaction, colorRoles, "interactions.colorRoleLabel");
    } else if (interaction.customId === "gender-select") {
      await handleExclusiveRoleSelect(interaction, genderRoles, "interactions.genderRoleLabel");
    }
  } catch (error) {
    console.error("Menu etkilesiminde hata:", error);
    const reply = { content: t("interactions.genericComponentError"), flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
}

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    // Tanı amacli: etkilesim Discord'da olusturuldugundan beri ne kadar
    // sure gectigini ve o anki gateway (websocket) gecikmesini logla.
    // Bu deger 2500ms'e yaklasiyor/asiyorsa sorun REST tarafinda degil,
    // etkilesimin gateway uzerinden bize GEC ulasmasindadir (ag/ISS
    // kaynakli gecikme) ve deferReply() ne kadar hizli calisirsa
    // calissin "Unknown interaction" hatasini onleyemez.
    const eventAge = Date.now() - interaction.createdTimestamp;
    if (eventAge > 1000) {
      console.warn(
        `[tani] Etkilesim ${eventAge}ms gecikmeyle ulasti (gateway ping: ${interaction.client.ws.ping}ms).`
      );
    }

    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    }
  },
};
