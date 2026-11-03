"use strict";

const TelegramContext = require("../core/context");

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async handle(update) {
    const ctx = new TelegramContext(this.bot, update);

    if (ctx.from?.is_bot && this.bot.config.security?.blockBots !== false) {
      return;
    }

    if (ctx.message) {
      if (this.bot.config.features?.onAnyEvent !== false) {
        await this.bot.eventHandler.dispatch("onAnyEvent", ctx);
      }

      if (this.bot.config.features?.onChat !== false) {
        await this.bot.eventHandler.dispatch("onChat", ctx);
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
