const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const {
  addGuildArrayEntry,
  removeGuildArrayEntry,
  setGuildSetting,
} = require("../../utils/settingsStore");
const {
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
} = require("../../utils/guildConfig");
const { syncColorRoles } = require("../../utils/syncColorRoles");
const { replySetup } = require("../../utils/embedReplies");
const { t } = require("../../utils/i18n");

const BUTTON_STYLES = ["Primary", "Secondary", "Success", "Danger"];

function buildSetupCommand() {
  return new SlashCommandBuilder()
    .setName("setup")
    .setDescription(t("commands.ayarla.description"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("welcome-channel")
        .setDescription(t("commands.ayarla.welcomeChannel.subcommandDescription"))
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(t("commands.ayarla.welcomeChannel.channelOptionDescription"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("leave-channel")
        .setDescription(t("commands.ayarla.leaveChannel.subcommandDescription"))
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(t("commands.ayarla.leaveChannel.channelOptionDescription"))
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("color-menu")
        .setDescription(t("commands.ayarla.colorMenu.groupDescription"))
        .addSubcommand((sub) =>
          sub
            .setName("add")
            .setDescription(t("commands.ayarla.colorMenu.add.subcommandDescription"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands.ayarla.colorMenu.add.roleOptionDescription"))
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("label")
                .setDescription(t("commands.ayarla.colorMenu.add.labelOptionDescription"))
                .setRequired(true)
                .setMaxLength(100)
            )
            .addStringOption((option) =>
              option
                .setName("hex")
                .setDescription(t("commands.ayarla.colorMenu.add.hexOptionDescription"))
                .setRequired(true)
                .setMinLength(4)
                .setMaxLength(7)
            )
            .addStringOption((option) =>
              option
                .setName("emoji")
                .setDescription(t("commands.ayarla.colorMenu.add.emojiOptionDescription"))
                .setRequired(false)
                .setMaxLength(32)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("remove")
            .setDescription(t("commands.ayarla.colorMenu.remove.subcommandDescription"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands.ayarla.colorMenu.remove.roleOptionDescription"))
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub.setName("list").setDescription(t("commands.ayarla.colorMenu.list.subcommandDescription"))
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("gender-menu")
        .setDescription(t("commands.ayarla.genderMenu.groupDescription"))
        .addSubcommand((sub) =>
          sub
            .setName("add")
            .setDescription(t("commands.ayarla.genderMenu.add.subcommandDescription"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands.ayarla.genderMenu.add.roleOptionDescription"))
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("label")
                .setDescription(t("commands.ayarla.genderMenu.add.labelOptionDescription"))
                .setRequired(true)
                .setMaxLength(100)
            )
            .addStringOption((option) =>
              option
                .setName("emoji")
                .setDescription(t("commands.ayarla.genderMenu.add.emojiOptionDescription"))
                .setRequired(false)
                .setMaxLength(32)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("remove")
            .setDescription(t("commands.ayarla.genderMenu.remove.subcommandDescription"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands.ayarla.genderMenu.remove.roleOptionDescription"))
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub.setName("list").setDescription(t("commands.ayarla.genderMenu.list.subcommandDescription"))
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("role-menu")
        .setDescription(t("commands.ayarla.roleMenu.groupDescription"))
        .addSubcommand((sub) =>
          sub
            .setName("add")
            .setDescription(t("commands.ayarla.roleMenu.add.subcommandDescription"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands.ayarla.roleMenu.add.roleOptionDescription"))
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("label")
                .setDescription(t("commands.ayarla.roleMenu.add.labelOptionDescription"))
                .setRequired(true)
                .setMaxLength(80)
            )
            .addStringOption((option) =>
              option
                .setName("emoji")
                .setDescription(t("commands.ayarla.roleMenu.add.emojiOptionDescription"))
                .setRequired(false)
                .setMaxLength(32)
            )
            .addStringOption((option) =>
              option
                .setName("style")
                .setDescription(t("commands.ayarla.roleMenu.add.styleOptionDescription"))
                .setRequired(false)
                .addChoices(
                  { name: "Primary", value: "Primary" },
                  { name: "Secondary", value: "Secondary" },
                  { name: "Success", value: "Success" },
                  { name: "Danger", value: "Danger" }
                )
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("remove")
            .setDescription(t("commands.ayarla.roleMenu.remove.subcommandDescription"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands.ayarla.roleMenu.remove.roleOptionDescription"))
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub.setName("list").setDescription(t("commands.ayarla.roleMenu.list.subcommandDescription"))
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("rules")
        .setDescription(t("commands.ayarla.rules.groupDescription"))
        .addSubcommand((sub) =>
          sub
            .setName("set-title")
            .setDescription(t("commands.ayarla.rules.setTitle.subcommandDescription"))
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription(t("commands.ayarla.rules.setTitle.titleOptionDescription"))
                .setRequired(true)
                .setMaxLength(256)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("set-description")
            .setDescription(t("commands.ayarla.rules.setDescription.subcommandDescription"))
            .addStringOption((option) =>
              option
                .setName("description")
                .setDescription(t("commands.ayarla.rules.setDescription.descriptionOptionDescription"))
                .setRequired(true)
                .setMaxLength(1000)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("add")
            .setDescription(t("commands.ayarla.rules.add.subcommandDescription"))
            .addStringOption((option) =>
              option
                .setName("rule")
                .setDescription(t("commands.ayarla.rules.add.ruleOptionDescription"))
                .setRequired(true)
                .setMaxLength(500)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("remove")
            .setDescription(t("commands.ayarla.rules.remove.subcommandDescription"))
            .addIntegerOption((option) =>
              option
                .setName("index")
                .setDescription(t("commands.ayarla.rules.remove.indexOptionDescription"))
                .setRequired(true)
                .setMinValue(1)
            )
        )
        .addSubcommand((sub) =>
          sub.setName("list").setDescription(t("commands.ayarla.rules.list.subcommandDescription"))
        )
        .addSubcommand((sub) =>
          sub.setName("reset").setDescription(t("commands.ayarla.rules.reset.subcommandDescription"))
        )
    );
}

function normalizeHex(hex) {
  const value = hex.trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

async function setupReply(interaction, text, variant = "success") {
  await replySetup(interaction, text, variant);
}

async function handleChannelSetup(interaction, key, successKey) {
  const channel = interaction.options.getChannel("channel");
  setGuildSetting(interaction.guild.id, key, channel.id);
  await setupReply(interaction, t(successKey, { channel: `${channel}` }));
}

async function handleColorMenuSetup(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guild.id;

  if (subcommand === "list") {
    await setupReply(
      interaction,
      t("commands.ayarla.colorMenu.list.success", {
        list: formatRoleList(getColorRoles(guildId)),
      }),
      "info"
    );
    return;
  }

  if (subcommand === "remove") {
    const role = interaction.options.getRole("role");
    const result = removeGuildArrayEntry(guildId, "colorRoles", role.id);
    if (!result.ok) {
      await setupReply(interaction, t("commands.ayarla.colorMenu.remove.notFound"), "warning");
      return;
    }
    await setupReply(interaction, t("commands.ayarla.colorMenu.remove.success", { role: `${role}` }));
    return;
  }

  const role = interaction.options.getRole("role");
  const label = interaction.options.getString("label");
  const emoji = interaction.options.getString("emoji") ?? "🎨";
  const hex = normalizeHex(interaction.options.getString("hex"));

  if (!isValidHex(hex)) {
    await setupReply(interaction, t("commands.ayarla.colorMenu.add.invalidHex"), "error");
    return;
  }

  const roleError = validateRoleAssignable(interaction.guild, role);
  if (roleError) {
    await setupReply(interaction, t(`commands.ayarla.roleErrors.${roleError}`), "error");
    return;
  }

  const result = addGuildArrayEntry(
    guildId,
    "colorRoles",
    { label, emoji, roleId: role.id, hex },
    MAX_SELECT_ROLES
  );

  if (!result.ok) {
    await setupReply(
      interaction,
      t(`commands.ayarla.arrayErrors.${result.reason}`, { max: result.max ?? MAX_SELECT_ROLES }),
      "error"
    );
    return;
  }

  await syncColorRoles(interaction.guild, result.list).catch(() => {});

  await setupReply(interaction, t("commands.ayarla.colorMenu.add.success", { role: `${role}`, hex }));
}

async function handleGenderMenuSetup(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guild.id;

  if (subcommand === "list") {
    await setupReply(
      interaction,
      t("commands.ayarla.genderMenu.list.success", {
        list: formatRoleList(getGenderRoles(guildId)),
      }),
      "info"
    );
    return;
  }

  if (subcommand === "remove") {
    const role = interaction.options.getRole("role");
    const result = removeGuildArrayEntry(guildId, "genderRoles", role.id);
    if (!result.ok) {
      await setupReply(interaction, t("commands.ayarla.genderMenu.remove.notFound"), "warning");
      return;
    }
    await setupReply(interaction, t("commands.ayarla.genderMenu.remove.success", { role: `${role}` }));
    return;
  }

  const role = interaction.options.getRole("role");
  const label = interaction.options.getString("label");
  const emoji = interaction.options.getString("emoji") ?? "🚻";

  const roleError = validateRoleAssignable(interaction.guild, role);
  if (roleError) {
    await setupReply(interaction, t(`commands.ayarla.roleErrors.${roleError}`), "error");
    return;
  }

  const result = addGuildArrayEntry(
    guildId,
    "genderRoles",
    { label, emoji, roleId: role.id },
    MAX_SELECT_ROLES
  );

  if (!result.ok) {
    await setupReply(
      interaction,
      t(`commands.ayarla.arrayErrors.${result.reason}`, { max: result.max ?? MAX_SELECT_ROLES }),
      "error"
    );
    return;
  }

  await setupReply(interaction, t("commands.ayarla.genderMenu.add.success", { role: `${role}` }));
}

async function handleRoleMenuSetup(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guild.id;

  if (subcommand === "list") {
    await setupReply(
      interaction,
      t("commands.ayarla.roleMenu.list.success", {
        list: formatRoleList(getReactionRoles(guildId)),
      }),
      "info"
    );
    return;
  }

  if (subcommand === "remove") {
    const role = interaction.options.getRole("role");
    const result = removeGuildArrayEntry(guildId, "reactionRoles", role.id);
    if (!result.ok) {
      await setupReply(interaction, t("commands.ayarla.roleMenu.remove.notFound"), "warning");
      return;
    }
    await setupReply(interaction, t("commands.ayarla.roleMenu.remove.success", { role: `${role}` }));
    return;
  }

  const role = interaction.options.getRole("role");
  const label = interaction.options.getString("label");
  const emoji = interaction.options.getString("emoji") ?? "🏷️";
  const style = interaction.options.getString("style") ?? "Secondary";

  if (!BUTTON_STYLES.includes(style)) {
    await setupReply(interaction, t("commands.ayarla.roleMenu.add.invalidStyle"), "error");
    return;
  }

  const roleError = validateRoleAssignable(interaction.guild, role);
  if (roleError) {
    await setupReply(interaction, t(`commands.ayarla.roleErrors.${roleError}`), "error");
    return;
  }

  const result = addGuildArrayEntry(
    guildId,
    "reactionRoles",
    { label, emoji, roleId: role.id, style },
    MAX_BUTTON_ROLES
  );

  if (!result.ok) {
    await setupReply(
      interaction,
      t(`commands.ayarla.arrayErrors.${result.reason}`, { max: result.max ?? MAX_BUTTON_ROLES }),
      "error"
    );
    return;
  }

  await setupReply(interaction, t("commands.ayarla.roleMenu.add.success", { role: `${role}` }));
}

async function handleRulesSetup(interaction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guild.id;

  if (subcommand === "list") {
    const rules = getRulesConfig(guildId);
    const numbered = rules.rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n");
    await setupReply(
      interaction,
      t("commands.ayarla.rules.list.success", {
        title: rules.title,
        description: rules.description,
        rules: numbered || "—",
      }),
      "info"
    );
    return;
  }

  if (subcommand === "reset") {
    resetRulesConfig(guildId);
    await setupReply(interaction, t("commands.ayarla.rules.reset.success"));
    return;
  }

  if (subcommand === "set-title") {
    const title = interaction.options.getString("title");
    setRulesConfig(guildId, { title });
    await setupReply(interaction, t("commands.ayarla.rules.setTitle.success", { title }));
    return;
  }

  if (subcommand === "set-description") {
    const description = interaction.options.getString("description");
    setRulesConfig(guildId, { description });
    await setupReply(interaction, t("commands.ayarla.rules.setDescription.success"));
    return;
  }

  if (subcommand === "add") {
    const rule = interaction.options.getString("rule");
    const rules = getRulesConfig(guildId);
    const nextRules = [...rules.rules, rule];
    setRulesConfig(guildId, { rules: nextRules });
    await setupReply(interaction, t("commands.ayarla.rules.add.success", { index: nextRules.length }));
    return;
  }

  if (subcommand === "remove") {
    const index = interaction.options.getInteger("index");
    const rules = getRulesConfig(guildId);
    if (index < 1 || index > rules.rules.length) {
      await setupReply(interaction, t("commands.ayarla.rules.remove.notFound"), "warning");
      return;
    }
    const nextRules = rules.rules.filter((_, i) => i !== index - 1);
    setRulesConfig(guildId, { rules: nextRules });
    await setupReply(interaction, t("commands.ayarla.rules.remove.success", { index }));
  }
}

module.exports = {
  data: buildSetupCommand(),

  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand();

    if (!group) {
      if (subcommand === "welcome-channel") {
        await handleChannelSetup(
          interaction,
          "welcomeChannelId",
          "commands.ayarla.welcomeChannel.success"
        );
        return;
      }
      if (subcommand === "leave-channel") {
        await handleChannelSetup(
          interaction,
          "leaveChannelId",
          "commands.ayarla.leaveChannel.success"
        );
      }
      return;
    }

    if (group === "color-menu") {
      await handleColorMenuSetup(interaction);
      return;
    }
    if (group === "gender-menu") {
      await handleGenderMenuSetup(interaction);
      return;
    }
    if (group === "role-menu") {
      await handleRoleMenuSetup(interaction);
      return;
    }
    if (group === "rules") {
      await handleRulesSetup(interaction);
    }
  },
};
