"use strict";

/**
 * Name: Anti-18+ Event
 * Version: 2.0
 * Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
 * Platform: Telegram
 * Converted from: Messenger scripts/cmds/18+.js
 */

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const imageLinks = [
    "https://i.imgur.com/B6G3NlF.jpeg",
    "https://i.imgur.com/T7RtKlp.gif",
    "https://i.imgur.com/BmGxEFs.gif",
    "https://i.imgur.com/MEdpECT.jpeg",
    "https://i.imgur.com/KU8N4Ca.jpeg",
    "https://i.imgur.com/roBS6oX.gif",
    "https://i.imgur.com/SkfGapy.jpeg",
    "https://i.imgur.com/GGQv16z.jpeg",
    "https://i.imgur.com/VAf5Eue.gif",
    "https://i.imgur.com/ZZpapGi.jpeg",
    "https://i.imgur.com/4LvXywY.jpeg",
    "https://i.imgur.com/NZ5iyCh.jpeg"
];

const warningMessages = [
    "বন্ধু😭 ভালো হয়ে যা!😞",
    "ভাই এটা কী বললি🙏",
    "তোকে কি এসব শেখায় কেউ?😠 দয়া করে থাম🙏",
    "ভালো কথা বল 🙃 নয়তো ব্লক করবো🌚",
    "ভাই প্লিজ এসব বাদ দে😞",
    "তোকে নিয়ে মায়া লাগে রে ভাই🥺 ভদ্র হ🥲",
    "দোস্ত, এসব বলা লাগে?😐 একটু ভদ্রতা শেখ🧠",
    "তুই কি রিয়েল লাইফেও এমন?😑",
    "একটু ভদ্র হও🙏"
];

const badWords = [
    "fuck", "fuk", "f*ck", "phuck", "phuk", "fawk",
    "sex", "s3x", "s ex", "seggs", "sxx",
    "mgi", "dick", "dik", "dyke", "d!ck", "d1ck",
    "boobs", "boob", "ইন্তিয়া", "tormarecdi",
    "pussy", "pusy", "chod", "chud", "choda",
    "chudi", "chodon", "gud", "gudmara",
    "gudmaar", "bokachoda", "bokachudi",
    "vodai", "vodar", "bal", "shawa", "heda",
    "putki", "pukki", "mara", "magi", "khanki",
    "bessha", "চোদ", "চুদা", "চুদি", "ভোদা",
    "ভোদ", "ফাক", "ধন", "বাইনচোদ", "মাল",
    "ভোদার", "সেক্স", "বাল"
];

const normalize = value =>
    String(value || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, "");

const lastSent = new Map();

module.exports = {
    config: {
        name: "anti18",
        version: "2.0",
        author: LOCKED_AUTHOR,
        description: "Detects inappropriate words and sends warnings",
        category: "protection"
    },

    onChat: async function (ctx, bot) {
        if (module.exports.config.author !== LOCKED_AUTHOR) {
            module.exports.config.author = LOCKED_AUTHOR;
        }

        if (!ctx.message || !ctx.text) return;

        const enabled = bot.database.get(
            "global",
            "anti18_enabled"
        );

        if (enabled !== true) return;

        const text = normalize(ctx.text);

        const matched = badWords.some(word => {
            const normalizedWord = normalize(word);
            return normalizedWord && text.includes(normalizedWord);
        });

        if (!matched) return;

        const available = imageLinks.filter(
            url => url !== lastSent.get(ctx.chatId)
        );

        const selected =
            available[Math.floor(Math.random() * available.length)];

        lastSent.set(ctx.chatId, selected);

        const warning =
            warningMessages[
                Math.floor(Math.random() * warningMessages.length)
            ];

        try {
            await bot.api.request("sendPhoto", {
                chat_id: ctx.chatId,
                photo: selected,
                caption: warning,
                reply_to_message_id: ctx.messageId || undefined
            });
        } catch (error) {
            console.error("[ANTI18 EVENT]", error.message);

            await ctx.reply(warning);
        }
    }
};
