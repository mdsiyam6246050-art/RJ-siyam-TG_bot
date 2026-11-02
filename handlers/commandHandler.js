"use strict";

class TelegramCommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.cooldowns = new Map();
    }

    async getRole(ctx) {
        return this.bot.permissions.getRole(ctx);
    }

    async handle(ctx) {
        if (!this.bot.config.features?.commands) return false;

        const text = String(ctx.text || "").trim();
        if (!text) return false;

        const prefix = this.bot.config.prefix || ",";
        let body = "";

        if (text.startsWith(prefix)) {
            body = text.slice(prefix.length).trim();
        } else if (text.startsWith("/")) {
            body = text.slice(1).trim();
        } else {
            return false;
        }

        if (!body) return false;

        const parts = body.split(/\s+/);
        let name = parts.shift().toLowerCase();

        if (name.includes("@")) {
            const [command, username] = name.split("@");
            if (
                username &&
                this.bot.me?.username &&
                username.toLowerCase() !== this.bot.me.username.toLowerCase()
            ) return false;
            name = command;
        }

        const args = parts;
        const actualName = this.bot.aliases.get(name) || name;
        const command = this.bot.commands.get(actualName);

        ctx.commandName = actualName;
        ctx.args = args;

        if (!command) {
            await ctx.reply(`🤷‍♂️ "${name}" 𝐂𝐌𝐃 𝐓 পাওয়া যায়নি। ${prefix}help লিখোbসব 𝐂𝐌𝐃 দেখতে ।`);
            return true;
        }

        if (ctx.isPrivate && !this.bot.config.permissions.allowPrivate) {
            return true;
        }

        if (ctx.isGroup && !this.bot.config.permissions.allowGroups) {
            return true;
        }

        if (ctx.isChannel && !this.bot.config.permissions.allowChannels) {
            return true;
        }

        const role = await this.getRole(ctx);
        const ownerIds = (this.bot.config.owner?.ids || []).map(String);
        const adminIds = (this.bot.config.admins || []).map(String);
        const userId = String(ctx.userId || "");

        const isOwner = ownerIds.includes(userId);
        const isAdmin = isOwner || adminIds.includes(userId);

        if (
            this.bot.config.adminOnly?.enabled &&
            !isAdmin &&
            !(this.bot.config.adminOnly.ignoreCommands || []).includes(actualName)
        ) {
            await ctx.reply("⛔ এই কমান্ডটি শুধু 𝐒𝐢𝐘𝐀𝐌 𝐁𝐎𝐎𝐒 ব্যবহার করতে পারবেন।");
            return true;
        }

        if (
            command.config?.role === "admin" &&
            !isAdmin &&
            role !== "admin" &&
            role !== "creator"
        ) {
            await ctx.reply("⛔ তুই আবাল 😜 𝐎𝐍𝐋𝐘 𝐌𝐘 𝐁𝐎𝐎𝐒 𝐒𝐈𝐘𝐀𝐌।");
            return true;
        }

        if (this.bot.config.whitelist?.enabled) {
            const allowed = (this.bot.config.whitelist.ids || []).map(String);
            if (!allowed.includes(userId) && !isAdmin) {
                await ctx.reply("⛔ তুমি এই Bot ব্যবহারের অনুমতি পাওনি।");
                return true;
            }
        }

        const seconds = Number(
            command.config?.cooldown ??
            this.bot.config.cooldown?.defaultSeconds ??
            1
        );

        const key = `${ctx.chatId}:${ctx.userId}:${actualName}`;
        const last = this.cooldowns.get(key) || 0;
        const remaining = seconds * 1000 - (Date.now() - last);

        if (
            this.bot.config.cooldown?.enabled &&
            remaining > 0
        ) {
            await ctx.reply(`⏳ ${Math.ceil(remaining / 1000)} সেকেন্ড অপেক্ষা করো।`);
            return true;
        }

        try {
            await command.onStart({
                bot: this.bot,
                api: this.bot.api,
                ctx,
                message: ctx,
                event: ctx.update,
                config: this.bot.config,
                args,
                commandName: actualName,
                userId: ctx.userId,
                chatId: ctx.chatId,
                reply: (message, options) => ctx.reply(message, options)
            });

            this.cooldowns.set(key, Date.now());

            if (this.bot.config.logging?.showCommands) {
                console.log(`[COMMAND] ${actualName} | User: ${userId}`);
            }
        } catch (error) {
            this.bot.errorHandler.handle(error, `COMMAND:${actualName}`);
            await ctx.reply("⚠️ কমান্ড চালাতে সমস্যা হয়েছে সিয়াম ভাই।");
        }

        return true;
    }
}

module.exports = TelegramCommandHandler;
