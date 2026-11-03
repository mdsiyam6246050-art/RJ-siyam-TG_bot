"use strict";

class TelegramContext {
  constructor(bot, update) {
    this.bot = bot;
    this.update = update;

    this.message =
      update.message ||
      update.edited_message ||
      update.channel_post ||
      null;

    this.callbackQuery = update.callback_query || null;

    this.chat = this.message
      ? this.message.chat
      : this.callbackQuery?.message?.chat || null;

    this.from = this.message
      ? this.message.from
      : this.callbackQuery?.from || null;

    this.text = this.message?.text || this.message?.caption || "";

    this.chatId = this.chat?.id || null;
    this.userId = this.from?.id || null;
    this.messageId = this.message?.message_id || null;

    this.isGroup = ["group", "supergroup"].includes(this.chat?.type);
    this.isPrivate = this.chat?.type === "private";
    this.isChannel = this.chat?.type === "channel";
    this.isCallback = Boolean(this.callbackQuery);
  }

  async reply(text, options = {}) {
    if (!this.chatId) return null;

    return this.bot.api.sendMessage(
      this.chatId,
      String(text),
      {
        reply_to_message_id: this.messageId || undefined,
        ...options
      }
    );
  }

  async send(text, options = {}) {
    return this.reply(text, options);
  }

  async answerCallback(text = "") {
    if (!this.callbackQuery) return null;

    return this.bot.api.answerCallbackQuery(
      this.callbackQuery.id,
      text
    );
  }
}

module.exports = TelegramContext;
