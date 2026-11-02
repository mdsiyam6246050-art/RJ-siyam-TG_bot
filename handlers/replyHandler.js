
"use strict";

class TelegramReplyHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async handle(ctx) {
        const repliedMessage = ctx.replyMessage;

        if (!repliedMessage) return false;

        const session = this.bot.reply.get(repliedMessage.message_id);

        if (!session) return false;

        if (
            session.userId &&
            String(session.userId) !== String(ctx.userId)
        ) {
            return false;
        }

        const command = this.bot.commands.get(session.commandName);

        if (!command || typeof command.onReply !== "function") {
            this.bot.reply.delete(repliedMessage.message_id);
            return false;
        }

        await command.onReply({
            bot: this.bot,
            api: this.bot.api,
            ctx,
            event: ctx.message,
            message: ctx,
            args: ctx.text.split(/\s+/),
            commandName: session.commandName,
            Reply: session,
            reply: (text, options) => ctx.reply(text, options)
        });

        return true;
    }
}

module.exports = TelegramReplyHandler;
