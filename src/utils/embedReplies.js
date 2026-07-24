const { MessageFlags } = require("discord.js");
const {
  successEmbed,
  errorEmbed,
  warningEmbed,
  infoEmbed,
  musicEmbed,
  voiceEmbed,
  setupEmbed,
  rolesEmbed,
  messageEmbed,
} = require("./embeds");

function payload(embed, ephemeral) {
  return {
    embeds: [embed],
    ...(ephemeral ? { flags: MessageFlags.Ephemeral } : {}),
  };
}

async function sendEmbed(interaction, embed, { ephemeral = true, edit = false, defer = false } = {}) {
  const data = payload(embed, ephemeral);

  if (defer && !interaction.deferred && !interaction.replied) {
    await interaction.deferReply(data);
    return;
  }
  if (edit || interaction.deferred || interaction.replied) {
    await interaction.editReply(data);
    return;
  }
  await interaction.reply(data);
}

async function replyText(interaction, text, variant, options = {}) {
  return sendEmbed(interaction, messageEmbed(text, variant), options);
}

async function replySuccess(interaction, text, options = {}) {
  return replyText(interaction, text, "success", options);
}

async function replyError(interaction, text, options = {}) {
  return replyText(interaction, text, "error", options);
}

async function replyWarning(interaction, text, options = {}) {
  return replyText(interaction, text, "warning", options);
}

async function replyInfo(interaction, text, options = {}) {
  return replyText(interaction, text, "info", options);
}

async function replyMusic(interaction, text, options = {}) {
  return replyText(interaction, text, "music", options);
}

async function replyVoice(interaction, text, options = {}) {
  return replyText(interaction, text, "voice", options);
}

async function replySetup(interaction, text, variant = "success", options = {}) {
  const clean = text.replace(/^[^\w]*\s*/, "");
  return sendEmbed(interaction, setupEmbed({ description: clean, variant }), options);
}

async function replyRoles(interaction, text, variant = "success", options = {}) {
  const clean = text.replace(/^[^\w]*\s*/, "");
  return sendEmbed(interaction, rolesEmbed({ description: clean, variant }), options);
}

module.exports = {
  sendEmbed,
  replyText,
  replySuccess,
  replyError,
  replyWarning,
  replyInfo,
  replyMusic,
  replyVoice,
  replySetup,
  replyRoles,
};
