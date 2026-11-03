"use strict";

const fs = require("fs");
const path = require("path");

function loadEvents(bot) {
  const directory = path.join(__dirname, "..", "events");

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  bot.eventHandler.events = [];

  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(directory, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const event = require(filePath);

      if (!event || !event.config || !event.config.name) {
        console.warn(`[EVENT SKIPPED] ${file}`);
        continue;
      }

      bot.eventHandler.register(event);

      console.log(`[EVENT LOADED] ${event.config.name}`);
    } catch (error) {
      console.error(`[EVENT LOAD ERROR] ${file}:`, error.message);
    }
  }

  console.log(`[EVENTS] ${bot.eventHandler.events.length} event files loaded.`);
}

module.exports = loadEvents;
