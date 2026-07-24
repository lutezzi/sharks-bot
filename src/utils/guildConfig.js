const defaultRules = require("../config/rules");
const {
  getGuildSettings,
  getGuildArraySetting,
  setGuildSetting,
} = require("./settingsStore");

const MAX_SELECT_ROLES = 24;
const MAX_BUTTON_ROLES = 25;

function getColorRoles(guildId) {
  return getGuildArraySetting(guildId, "colorRoles");
}

function getGenderRoles(guildId) {
  return getGuildArraySetting(guildId, "genderRoles");
}

function getReactionRoles(guildId) {
  return getGuildArraySetting(guildId, "reactionRoles");
}

function getRulesConfig(guildId) {
  const settings = getGuildSettings(guildId);
  if (settings.rules && Array.isArray(settings.rules.rules) && settings.rules.rules.length > 0) {
    return {
      title: settings.rules.title || defaultRules.title,
      description: settings.rules.description || defaultRules.description,
      rules: settings.rules.rules,
      footer: settings.rules.footer || defaultRules.footer,
    };
  }
  return defaultRules;
}

function setRulesConfig(guildId, patch) {
  const current = getGuildSettings(guildId).rules ?? {};
  return setGuildSetting(guildId, "rules", { ...current, ...patch });
}

function resetRulesConfig(guildId) {
  return setGuildSetting(guildId, "rules", { ...defaultRules });
}

function validateRoleAssignable(guild, role) {
  if (!role) return "missing";
  if (role.managed) return "managed";
  const botMember = guild.members.me;
  if (!botMember || botMember.roles.highest.position <= role.position) return "hierarchy";
  return null;
}

function formatRoleList(roles) {
  if (roles.length === 0) return "—";
  return roles.map((role) => `• ${role.emoji ? `${role.emoji} ` : ""}**${role.label}** (\`${role.roleId}\`)`).join("\n");
}

module.exports = {
  MAX_SELECT_ROLES,
  MAX_BUTTON_ROLES,
  getColorRoles,
  getGenderRoles,
  getReactionRoles,
  getRulesConfig,
  setRulesConfig,
  resetRulesConfig,
  validateRoleAssignable,
  formatRoleList,
};
