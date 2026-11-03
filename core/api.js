"use strict";

class TelegramAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = `https://api.telegram.org/bot${token}`;
  }

  async request(method, params = {}, signal = null) {
    const timeoutSignal = AbortSignal.timeout(65000);

    const finalSignal = signal
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal;

    const response = await fetch(
      `${this.baseURL}/${method}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params),
        signal: finalSignal
      }
    );

    const data = await response.json();

    if (!data.ok) {
      throw new Error(
        `Telegram API Error: ${data.description || "Unknown error"}`
      );
    }

    return data.result;
  }

  getMe() {
    return this.request("getMe");
  }

  deleteWebhook(dropPendingUpdates = false) {
    return this.request("deleteWebhook", {
      drop_pending_updates: dropPendingUpdates
    });
  }

  getUpdates(offset, timeout, signal) {
    return this.request(
      "getUpdates",
      {
        offset,
        timeout,
        allowed_updates: [
          "message",
          "edited_message",
          "channel_post",
          "callback_query",
          "my_chat_member"
        ]
      },
      signal
    );
  }

  sendMessage(chatId, text, options = {}) {
    return this.request("sendMessage", {
      chat_id: chatId,
      text,
      ...options
    });
  }

  answerCallbackQuery(callbackQueryId, text = "") {
    return this.request("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      text
    });
  }

  getChatMember(chatId, userId) {
    return this.request("getChatMember", {
      chat_id: chatId,
      user_id: userId
    });
  }

  getChat(chatId) {
    return this.request("getChat", {
      chat_id: chatId
    });
  }
}

module.exports = TelegramAPI;
