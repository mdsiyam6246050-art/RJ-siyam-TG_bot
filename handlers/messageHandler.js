
"use strict";

class TelegramMessageHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async handle(ctx) {
        if (!ctx.message) return;

        if (ctx.from?.is_bot && this.bot.config.security?.blockBots) {
            return;
        }

        if (ctx.userId) {
            await this.bot.database.createUser(ctx);
        }

        if (ctx.isGroup) {
            await this.bot.database.createGroup(ctx);
        }

        await this.bot.events.dispatch("onAnyEvent", ctx);

        const handled = await this.bot.commandHandler.handle(ctx);

        if (!handled) {
            await this.bot.events.dispatch("onChat", ctx);
        }
    }
}

module.exports = TelegramMessageHandler;
