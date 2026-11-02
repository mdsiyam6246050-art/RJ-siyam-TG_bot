
"use strict";

class TelegramContext {
    constructor(bot, update) {
        this.bot = bot;
        this.api = bot.api;
        this.update = update;

        this.message =
            update.message ||
            update.edited_message ||
            update.channel_post ||
            null;

        this.callback = update.callback_query || null;

        this.chat = this.message?.chat || this.callback?.message?.chat || null;
        this.from = this.message?.from || this.callback?.from || null;

        this.text = this.message?.text || this.message?.caption || "";
        this.chatId = this.chat?.id;
        this.userId = this.from?.id;
        this.messageId = this.message?.message_id;

        this.isGroup = ["group", "supergroup"].includes(this.chat?.type);
        this.isPrivate = this.chat?.type === "private";
        this.isChannel = this.chat?.type === "channel";
        this.isCallback = Boolean(this.callback);

        this.args = [];
        this.commandName = "";
        this.prefix = bot.config.prefix || ",";
    }

    reply(text, options = {}) {
        if (!this.chatId) {
            throw new Error("Chat ID not available");
        }

        return this.api.sendMessage(this.chatId, text, {
            reply_to_message_id: this.messageId,
            ...options
        });
    }

    sendMessage(text, options = {}) {
        return this.api.sendMessage(this.chatId, text, options);
    }

    sendPhoto(photo, options = {}) {
        return this.api.sendPhoto(this.chatId, photo, options);
    }

    sendDocument(document, options = {}) {
        return this.api.sendDocument(this.chatId, document, options);
    }

    sendVideo(video, options = {}) {
        return this.api.sendVideo(this.chatId, video, options);
    }

    sendAudio(audio, options = {}) {
        return this.api.sendAudio(this.chatId, audio, options);
    }

    edit(text, options = {}) {
        return this.api.editMessageText(
            this.chatId,
            this.messageId,
            text,
            options
        );
    }

    delete() {
        return this.api.deleteMessage(this.chatId, this.messageId);
    }

    async getUserRole() {
        return this.bot.permissions.getRole(this);
    }

    get isReply() {
        return Boolean(this.message?.reply_to_message);
    }

    get replyMessage() {
        return this.message?.reply_to_message || null;
    }
}

module.exports = TelegramContext;
