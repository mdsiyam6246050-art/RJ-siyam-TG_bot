"use strict";

const fs = require("fs");
const path = require("path");

function loadCommands(bot) {
  const directory = path.join(__dirname, "..", "commands");

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  bot.commands.clear();

  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(directory, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const command = require(filePath);

      if (
        !command ||
        !command.config ||
        !command.config.name ||
        typeof command.onStart !== "function"
      ) {
        console.warn(`[COMMAND SKIPPED] ${file}`);
        continue;
      }

      const names = [
        command.config.name,
        ...(command.config.aliases || [])
      ];

      for (const name of names) {
        bot.commands.set(String(name).toLowerCase(), command);
      }

      console.log(`[COMMAND LOADED] ${command.config.name}`);
    } catch (error) {
      console.error(`[COMMAND LOAD ERROR] ${file}:`, error.message);
    }
  }

  console.log(`[COMMANDS] ${bot.commands.size} command names loaded.`);
}

module.exports = loadCommands;
