"use strict";

const fs = require("fs");
const path = require("path");
const TelegramBot = require("./core/bot");

let botInstance = null;

function readConfig() {
  const configPath = path.join(__dirname, "config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("config.json file not found!");
  }

  const config = JSON.parse(
    fs.readFileSync(configPath, "utf8")
  );

  if (config.enabled !== true) {
    throw new Error("Telegram bot is disabled in config.json");
  }

  if (
    !config.botToken ||
    config.botToken.includes("PASTE_YOUR") ||
    config.botToken.includes("YOUR_TELEGRAM")
  ) {
    throw new Error("Please add your Telegram bot token in config.json");
  }

  return config;
}

async function startTelegram() {
  if (botInstance) return botInstance;

  const config = readConfig();
  const bot = new TelegramBot(config);

  try {
    await bot.start();
    botInstance = bot;
    return bot;
  } catch (error) {
    botInstance = null;
    throw error;
  }
}

async function stopTelegram() {
  if (!botInstance) return;

  const bot = botInstance;
  botInstance = null;

  await bot.stop();
}

module.exports = {
  startTelegram,
  stopTelegram
};
