
"use strict";

class TelegramReply {
    constructor() {
        this.sessions = new Map();
    }

    set(messageId, data) {
        this.sessions.set(String(messageId), {
            ...data,
            createdAt: Date.now()
        });
    }

    get(messageId) {
        return this.sessions.get(String(messageId)) || null;
    }

    delete(messageId) {
        return this.sessions.delete(String(messageId));
    }

    clear() {
        this.sessions.clear();
    }
}

module.exports = TelegramReply;
