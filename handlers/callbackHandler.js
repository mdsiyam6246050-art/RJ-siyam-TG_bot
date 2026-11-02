
"use strict";

class TelegramCallbackHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async handle(update) {
        const callback = update.callback_query;

        if (!callback) return;

        try {
            await this.bot.api.answerCallbackQuery(callback.id);

            const ctx = this.bot.createContext(update);

            await this.bot.events.dispatch("onCallback", ctx);
        } catch (error) {
            console.error("[TELEGRAM CALLBACK ERROR]", error);
        }
    }
}

module.exports = TelegramCallbackHandler;
