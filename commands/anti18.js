"use strict";

/**
 * Name: Anti-18+
 * Version: 2.0
 * Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
 * Platform: Telegram
 * Converted from: Messenger scripts/cmds/18+.js
 */

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
    config: {
        name: "anti18",
        aliases: ["18+"],
        version: "2.0",
        author: LOCKED_AUTHOR,
        role: "admin",
        cooldown: 2,
        description: {
            en: "Auto-detects 18+ words and sends a warning (toggleable)",
            bn: "অশালীন শব্দ শনাক্ত করে সতর্কবার্তা পাঠায়"
        },
        category: "protection",
        guide: {
            en: ",anti18 on / off — Toggle detection\n,anti18 — Check status",
            bn: ",anti18 on / off — শনাক্তকরণ চালু বা বন্ধ\n,anti18 — বর্তমান অবস্থা দেখুন"
        }
    },

    onStart: async function ({ ctx, args, bot }) {
        if (module.exports.config.author !== LOCKED_AUTHOR) {
            module.exports.config.author = LOCKED_AUTHOR;
        }

        const key = "anti18_enabled";
        const subCmd = args[0]?.toLowerCase();

        const current = bot.database.get("global", key);

        if (!subCmd) {
            const status = current === true ? "🟢 ON" : "🔴 OFF";
            return ctx.reply(`🔐 Anti-18+ Mode is currently: ${status}`);
        }

        if (!["on", "off"].includes(subCmd)) {
            return ctx.reply(
                "⚠️ Invalid usage.\nUse: ,anti18 on / off"
            );
        }

        const enabled = subCmd === "on";

        await bot.database.set("global", key, enabled);

        return ctx.reply(
            enabled
                ? "✅ Anti-18+ detection is now ON."
                : "❌ Anti-18+ detection is now OFF."
        );
    }
};
