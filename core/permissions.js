
"use strict";

class TelegramPermissions {
    constructor(bot) {
        this.bot = bot;
        this.config = bot.config;
    }

    includes(list, id) {
        return (list || []).map(String).includes(String(id));
    }

    isOwner(userId) {
        return this.includes(this.config.owner?.ids, userId);
    }

    isAdmin(userId) {
        return this.isOwner(userId) ||
            this.includes(this.config.admins, userId);
    }

    isWhitelisted(userId) {
        return this.includes(this.config.whitelist?.ids, userId);
    }

    async isGroupAdmin(chatId, userId) {
        try {
            const member = await this.bot.api.getChatMember(chatId, userId);

            return ["creator", "administrator"].includes(member.status);
        } catch {
            return false;
        }
    }

    async getRole(ctx) {
        if (this.isOwner(ctx.userId)) return 3;
        if (this.isAdmin(ctx.userId)) return 2;

        if (ctx.isGroup && await this.isGroupAdmin(ctx.chatId, ctx.userId)) {
            return 1;
        }

        return 0;
    }

    async check(ctx, command) {
        const config = this.config;
        const name = command.config.name;
        const role = await this.getRole(ctx);

        if (config.security?.blockBots && ctx.from?.is_bot) {
            return { allowed: false, reason: "bot" };
        }

        if (ctx.isPrivate && !config.permissions?.allowPrivate) {
            return { allowed: false, reason: "private" };
        }

        if (ctx.isGroup && !config.permissions?.allowGroups) {
            return { allowed: false, reason: "group" };
        }

        if (ctx.isChannel && !config.permissions?.allowChannels) {
            return { allowed: false, reason: "channel" };
        }

        if (
            config.whitelist?.enabled &&
            !this.isWhitelisted(ctx.userId) &&
            !this.isAdmin(ctx.userId)
        ) {
            return { allowed: false, reason: "whitelist" };
        }

        const roleConfig = command.config.role ?? 0;
        const requiredRole =
            typeof roleConfig === "number"
                ? roleConfig
                : roleConfig.onStart ?? 0;

        if (role < requiredRole) {
            return { allowed: false, reason: "role" };
        }

        const adminOnly = config.adminOnly || {};

        if (
            adminOnly.enabled &&
            !this.isAdmin(ctx.userId) &&
            !(adminOnly.ignoreCommands || []).includes(name)
        ) {
            return { allowed: false, reason: "adminOnly" };
        }

        return {
            allowed: true,
            role,
            isOwner: this.isOwner(ctx.userId),
            isAdmin: this.isAdmin(ctx.userId)
        };
    }
}

module.exports = TelegramPermissions;
      
