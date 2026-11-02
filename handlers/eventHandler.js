
"use strict";

class TelegramEventHandler {
    constructor(bot) {
        this.bot = bot;
        this.events = new Map();
    }

    register(eventName, command) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName).push(command);
    }

    async dispatch(eventName, ctx) {
        if (!this.bot.config.features?.[eventName] &&
            eventName !== "onAnyEvent") {
            return;
        }

        const commands = this.events.get(eventName) || [];

        for (const command of commands) {
            try {
                const handler = command[eventName];

                if (typeof handler !== "function") continue;

                await handler({
                    bot: this.bot,
                    api: this.bot.api,
                    ctx,
                    event: ctx.update,
                    message: ctx,
                    config: this.bot.config,
                    userId: ctx.userId,
                    chatId: ctx.chatId,
                    args: ctx.args || [],
                    commandName: command.config.name,
                    reply: (text, options) => ctx.reply(text, options)
                });
            } catch (error) {
                console.error(
                    `[TELEGRAM EVENT ERROR] ${command.config.name}`,
                    error
                );
            }
        }
    }
}

module.exports = TelegramEventHandler;
