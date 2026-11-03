
"use strict";

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

class TelegramAPI {
  constructor(token) {
    if (!token) throw new Error("Telegram bot token is missing");

    this.token = token;
    this.baseURL = `https://api.telegram.org/bot${token}`;
  }

  async request(method, params = {}, signal = null) {
    const hasUpload = Object.values(params).some(value =>
      Buffer.isBuffer(value) ||
      value instanceof fs.ReadStream ||
      (value && typeof value.pipe === "function")
    );

    let response;

    if (hasUpload) {
      const form = new FormData();

      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;

        if (
          Buffer.isBuffer(value) ||
          (value && typeof value.pipe === "function")
        ) {
          form.append(key, value, {
            filename: `${key}.bin`
          });
        } else if (typeof value === "object") {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, String(value));
        }
      }

      response = await axios.post(
        `${this.baseURL}/${method}`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 70000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          signal
        }
      );
    } else {
      response = await axios.post(
        `${this.baseURL}/${method}`,
        params,
        {
          timeout: 70000,
          signal
        }
      );
    }

    const data = response.data;

    if (!data?.ok) {
      throw new Error(
        `Telegram API Error: ${data?.description || "Unknown error"}`
      );
    }

    return data.result;
  }

  getMe() {
    return this.request("getMe");
  }

  getFile(fileId) {
    return this.request("getFile", {
      file_id: fileId
    });
  }

  getUserProfilePhotos(userId, options = {}) {
    return this.request("getUserProfilePhotos", {
      user_id: userId,
      ...options
    });
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
          "my_chat_member",
          "message_reaction"
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
