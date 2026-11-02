
"use strict";

class TelegramReactionHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async handle(update) {
        const reaction = update.message_reaction;

        if (!reaction) return;

        const ctx = this.bot.createContext(update);

        await this.bot.events.dispatch("onReaction", ctx);
    }
}

module.exports = TelegramReactionHandler;
