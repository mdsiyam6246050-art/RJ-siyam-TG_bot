"use strict";

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.cooldowns = new Map();
  }

  async handle(ctx) {
    if (!ctx.message || !ctx.text || !ctx.userId) return false;

    if (this.bot.config.features?.commands === false) return false;

    const prefix = this.bot.config.prefix || ",";
    const text = ctx.text.trim();

    const isPrefixCommand = text.startsWith(prefix);
    const isSlashCommand = text.startsWith("/");

    if (!isPrefixCommand && !isSlashCommand) return false;

    const body = text.slice(isSlashCommand ? 1 : prefix.length).trim();
    if (!body) return false;

    const parts = body.split(/\s+/);
    const commandName = parts.shift().toLowerCase().split("@")[0];
    const args = parts;

    const command = this.bot.commands.get(commandName);

    // এখনো কোনো কমান্ড যোগ করা না থাকলে নীরবে বাদ দেবে।
    if (!command) return false;

    if (!(await this.bot.permissions.canUse(ctx))) return true;

    const role = await this.bot.permissions.getRole(ctx);
    const adminOnly = this.bot.config.adminOnly || {};

    if (
      adminOnly.enabled &&
      !(adminOnly.ignoreCommands || []).includes(commandName) &&
      role < 2
    ) {
      await ctx.reply("এই কমান্ডটি শুধু অ্যাডমিন ব্যবহার করতে পারবে।");
      return true;
    }

    if (
      command.config?.role === "owner" &&
      role < 3
    ) {
      await ctx.reply("এই কমান্ডটি শুধু বটের মালিক ব্যবহার করতে পারবে।");
      return true;
    }

    if (
      command.config?.role === "admin" &&
      role < 2
    ) {
      await ctx.reply("এই কমান্ডটি শুধু অ্যাডমিন ব্যবহার করতে পারবে।");
      return true;
    }

    if (
      command.config?.role === "groupAdmin" &&
      role < 1
    ) {
      await ctx.reply("এই কমান্ডটি শুধু গ্রুপ অ্যাডমিন ব্যবহার করতে পারবে।");
      return true;
    }

    const cooldownSeconds = Number(
      command.config?.cooldown ??
      this.bot.config.cooldown?.defaultSeconds ??
      1
    );

    const cooldownEnabled =
      this.bot.config.cooldown?.enabled !== false;

    const cooldownKey = `${ctx.userId}:${commandName}`;
    const now = Date.now();
    const lastUsed = this.cooldowns.get(cooldownKey) || 0;
    const remaining = cooldownSeconds * 1000 - (now - lastUsed);

    if (cooldownEnabled && remaining > 0) {
      await ctx.reply(
        `অপেক্ষা করো। ${Math.ceil(remaining / 1000)} সেকেন্ড পর আবার চেষ্টা করো।`
      );
      return true;
    }

    this.cooldowns.set(cooldownKey, now);

    try {
      await command.onStart({
        ctx,
        bot: this.bot,
        args,
        commandName
      });
    } catch (error) {
      console.error(`[COMMAND ERROR] ${commandName}:`, error);
      await ctx.reply("কমান্ড চালাতে সমস্যা হয়েছে।");
    }

    return true;
  }
}

module.exports = CommandHandler;
