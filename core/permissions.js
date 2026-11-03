"use strict";

class Permissions {
  constructor(bot) {
    this.bot = bot;
    this.config = bot.config;
  }

  ids(list = []) {
    return list.map(String);
  }

  isOwner(userId) {
    const owners = this.config.owner?.ids || [];
    return this.ids(owners).includes(String(userId));
  }

  isAdmin(userId) {
    const admins = this.config.admins || [];

    return (
      this.isOwner(userId) ||
      this.ids(admins).includes(String(userId))
    );
  }

  isWhitelisted(userId) {
    const whitelist = this.config.whitelist || {};

    if (!whitelist.enabled) return true;

    return (
      this.isOwner(userId) ||
      this.ids(whitelist.ids || []).includes(String(userId))
    );
  }

  async getRole(ctx) {
    if (this.isOwner(ctx.userId)) return 3;
    if (this.isAdmin(ctx.userId)) return 2;

    if (ctx.isGroup && ctx.userId) {
      try {
        const member = await this.bot.api.getChatMember(
          ctx.chatId,
          ctx.userId
        );

        if (
          member.status === "creator" ||
          member.status === "administrator"
        ) {
          return 1;
        }
      } catch (_) {}
    }

    return 0;
  }

  async canUse(ctx) {
    const permissions = this.config.permissions || {};

    if (ctx.isPrivate && permissions.allowPrivate === false) {
      return false;
    }

    if (ctx.isGroup && permissions.allowGroups === false) {
      return false;
    }

    if (ctx.isChannel && permissions.allowChannels !== true) {
      return false;
    }

    if (
      ctx.from?.is_bot &&
      permissions.allowBotCommands !== true
    ) {
      return false;
    }

    return true;
  }
}

module.exports = Permissions;
