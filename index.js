
"use strict";

const fs = require("fs");
const path = require("path");
const TelegramBot = require("./core/bot");

let bot = null;

function readConfig() {
    const file = path.join(__dirname, "config.json");

    if (!fs.existsSync(file)) {
        throw new Error("telegram/config.json not found");
    }

    const config = JSON.parse(fs.readFileSync(file, "utf8"));

    if (!config.enabled) {
        throw new Error("Telegram bot is disabled in config.json");
    }

    if (!config.botToken || config.botToken.includes("PASTE_YOUR")) {
        throw new Error("Please set botToken in telegram/config.json");
    }

    return config;
}

async function startTelegram() {
    if (bot) return bot;

    const config = readConfig();
    bot = new TelegramBot(config);

    try {
        await bot.start();
        console.log("[TELEGRAM] Bot started successfully");
        return bot;
    } catch (error) {
        bot = null;
        console.error("[TELEGRAM] Startup failed:", error);
        throw error;
    }
}

async function stopTelegram() {
    if (!bot) return;

    const currentBot = bot;
    bot = null;

    await currentBot.stop();
    console.log("[TELEGRAM] Bot stopped");
}

module.exports = {
    startTelegram,
    stopTelegram
};
        
