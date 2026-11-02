
"use strict";

class TelegramAPI {
    constructor(token) {
        this.token = token;
        this.baseURL = `https://api.telegram.org/bot${token}`;
        this.fileURL = `https://api.telegram.org/file/bot${token}`;
    }

    async request(method, data = {}) {
        const response = await fetch(`${this.baseURL}/${method}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(60000)
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            throw new Error(
                result.description || `Telegram API error: ${method}`
            );
        }

        return result.result;
    }

    getMe() {
        return this.request("getMe");
    }

    getUpdates(offset, timeout = 30, allowedUpdates) {
        return this.request("getUpdates", {
            offset,
            timeout,
            allowed_updates: allowedUpdates || [
                "message",
                "edited_message",
                "callback_query",
                "my_chat_member",
                "chat_member",
                "message_reaction"
            ]
        });
    }

    sendMessage(chatId, text, options = {}) {
        return this.request("sendMessage", {
            chat_id: chatId,
            text: String(text),
            ...options
        });
    }

    editMessageText(chatId, messageId, text, options = {}) {
        return this.request("editMessageText", {
            chat_id: chatId,
            message_id: messageId,
            text: String(text),
            ...options
        });
    }

    deleteMessage(chatId, messageId) {
        return this.request("deleteMessage", {
            chat_id: chatId,
            message_id: messageId
        });
    }

    sendPhoto(chatId, photo, options = {}) {
        return this.request("sendPhoto", {
            chat_id: chatId,
            photo,
            ...options
        });
    }

    sendDocument(chatId, document, options = {}) {
        return this.request("sendDocument", {
            chat_id: chatId,
            document,
            ...options
        });
    }

    sendVideo(chatId, video, options = {}) {
        return this.request("sendVideo", {
            chat_id: chatId,
            video,
            ...options
        });
    }

    sendAudio(chatId, audio, options = {}) {
        return this.request("sendAudio", {
            chat_id: chatId,
            audio,
            ...options
        });
    }

    sendAnimation(chatId, animation, options = {}) {
        return this.request("sendAnimation", {
            chat_id: chatId,
            animation,
            ...options
        });
    }

    getChat(chatId) {
        return this.request("getChat", {
            chat_id: chatId
        });
    }

    getChatMember(chatId, userId) {
        return this.request("getChatMember", {
            chat_id: chatId,
            user_id: userId
        });
    }

    getFile(fileId) {
        return this.request("getFile", {
            file_id: fileId
        });
    }

    answerCallbackQuery(id, text = "") {
        return this.request("answerCallbackQuery", {
            callback_query_id: id,
            text
        });
    }

    setMyCommands(commands) {
        return this.request("setMyCommands", {
            commands
        });
    }

    leaveChat(chatId) {
        return this.request("leaveChat", {
            chat_id: chatId
        });
    }

    async getFileUrl(fileId) {
        const file = await this.getFile(fileId);
        return `${this.fileURL}/${file.file_path}`;
    }
}

module.exports = TelegramAPI;
  
