
"use strict";

const fs = require("fs");
const path = require("path");

function loadEvents(bot) {
    const directory = path.join(__dirname, "..", "events");

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    const files = fs.readdirSync(directory)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        const filePath = path.join(directory, file);

        try {
            delete require.cache[require.resolve(filePath)];

            const command = require(filePath);

            if (!command.config?.name) {
                console.warn(`[TELEGRAM EVENT] Invalid file: ${file}`);
                continue;
            }

            for (const eventName of [
                "onChat",
                "onAnyEvent",
                "onEvent",
                "onFirstChat",
                "onReaction",
                "onCallback"
            ]) {
                if (typeof command[eventName] === "function") {
                    bot.events.register(eventName, command);
                }
            }

            console.log(`[TELEGRAM EVENT] Loaded: ${command.config.name}`);
        } catch (error) {
            console.error(`[TELEGRAM EVENT] ${file}`, error);
        }
    }
}

module.exports = loadEvents;
          
