
"use strict";

class TelegramCooldown {
    constructor() {
        this.data = new Map();
    }

    check(commandName, userId, seconds = 1) {
        const key = `${commandName}:${userId}`;
        const now = Date.now();
        const last = this.data.get(key) || 0;
        const wait = seconds * 1000 - (now - last);

        if (wait > 0) {
            return {
                allowed: false,
                remaining: Math.ceil(wait / 1000)
            };
        }

        return { allowed: true };
    }

    set(commandName, userId) {
        this.data.set(
            `${commandName}:${userId}`,
            Date.now()
        );
    }

    clear() {
        this.data.clear();
    }
}

module.exports = TelegramCooldown;
