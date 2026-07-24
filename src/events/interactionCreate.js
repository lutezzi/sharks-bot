const { MessageFlags } = require("discord.js");
const { REMOVE_VALUE } = require("../utils/selectMenus");
const { getColorRoles, getGenderRoles } = require("../utils/guildConfig");
const { replyError, replyRoles } = require("../utils/embedReplies");
const { t, runWithUserLocale } = require("../utils/i18n");

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

    const options = { ephemeral: true, edit: interaction.deferred || interaction.replied };
    await replyError(interaction, t("interactions.genericCommandError"), options).catch(() => {});
  }
}

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
    await replyRoles(interaction, t("interactions.exclusiveRoleRemoved", { label }), "info", { edit: true });
    return;
  }

  await member.roles.add(selectedValue);
  await replyRoles(interaction, t("interactions.exclusiveRoleSet", { label }), "success", { edit: true });
}

async function handleReactionRoleButton(interaction, roleId) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const member = interaction.member;
  const alreadyHasRole = member.roles.cache.has(roleId);

  if (alreadyHasRole) {
    await member.roles.remove(roleId);
    await replyRoles(interaction, t("interactions.reactionRoleRemoved"), "info", { edit: true });
  } else {
    await member.roles.add(roleId);
    await replyRoles(interaction, t("interactions.reactionRoleAdded"), "success", { edit: true });
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
    const options = { ephemeral: true, edit: interaction.deferred || interaction.replied };
    await replyError(interaction, t("interactions.genericComponentError"), options).catch(() => {});
  }
}

async function handleSelectMenu(interaction) {
  try {
    if (interaction.customId === "color-select") {
      const colorRoles = getColorRoles(interaction.guild.id);
      await handleExclusiveRoleSelect(interaction, colorRoles, "interactions.colorRoleLabel");
    } else if (interaction.customId === "gender-select") {
      const genderRoles = getGenderRoles(interaction.guild.id);
      await handleExclusiveRoleSelect(interaction, genderRoles, "interactions.genderRoleLabel");
    }
  } catch (error) {
    console.error("Menu etkilesiminde hata:", error);
    const options = { ephemeral: true, edit: interaction.deferred || interaction.replied };
    await replyError(interaction, t("interactions.genericComponentError"), options).catch(() => {});
  }
}

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const userId = interaction.user?.id;
    if (!userId) return;

    if (interaction.isChatInputCommand()) {
      await runWithUserLocale(userId, () => handleSlashCommand(interaction));
    } else if (interaction.isStringSelectMenu()) {
      await runWithUserLocale(userId, () => handleSelectMenu(interaction));
    } else if (interaction.isButton()) {
      await runWithUserLocale(userId, () => handleButton(interaction));
    }
  },
};
