
"use strict";

const TelegramContext = require("../core/context");

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async handle(update) {
    if (update.message_reaction) {
      const ctx = new TelegramContext(this.bot, update);

      if (this.bot.config.features?.onReaction !== false) {
        await this.bot.eventHandler.dispatch("onReaction", ctx);
      }
      return;
    }

    const ctx = new TelegramContext(this.bot, update);

    if (
      ctx.from?.is_bot &&
      this.bot.config.security?.blockBots !== false
    ) {
      return;
    }

    if (ctx.message) {
      if (this.bot.config.features?.onAnyEvent !== false) {
        await this.bot.eventHandler.dispatch("onAnyEvent", ctx);
      }

      if (this.bot.config.features?.onChat !== false) {
        await this.bot.eventHandler.dispatch("onChat", ctx);
      }

      if (ctx.message.new_chat_members || ctx.message.left_chat_member) {
        if (this.bot.config.features?.onEvent !== false) {
          await this.bot.eventHandler.dispatch("onEvent", ctx);
        }
      }

      await this.bot.commandHandler.handle(ctx);
      return;
    }

    if (ctx.callbackQuery) {
      if (this.bot.config.features?.callbacks !== false) {
        await this.bot.eventHandler.dispatch("onCallback", ctx);
        await ctx.answerCallback();
      }
    }
  }
}

module.exports = MessageHandler;
