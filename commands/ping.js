
"use strict";

module.exports = {
    config: {
        name: "ping",
        aliases: ["p"],
        description: "Check Telegram bot response",
        role: 0,
        countDown: 1
    },

    onStart: async function ({ ctx, reply }) {
        const start = Date.now();

        await reply("🏓 Pong!");

        const latency = Date.now() - start;

        console.log(`[TELEGRAM] Ping latency: ${latency}ms`);
    }
};
