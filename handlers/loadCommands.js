
"use strict";

const fs = require("fs");
const path = require("path");

function loadCommands(bot) {
    const directory = path.join(__dirname, "..", "commands");

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    bot.commands.clear();
    bot.aliases.clear();

    const files = fs.readdirSync(directory)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        const filePath = path.join(directory, file);

        try {
            delete require.cache[require.resolve(filePath)];

            const command = require(filePath);

            if (!command.config?.name || typeof command.onStart !== "function") {
                console.warn(`[TELEGRAM LOADER] Invalid command: ${file}`);
                continue;
            }

            const name = command.config.name.toLowerCase();

            bot.commands.set(name, command);

            for (const alias of command.config.aliases || []) {
                bot.aliases.set(alias.toLowerCase(), name);
            }

            console.log(`[TELEGRAM LOADER] Loaded: ${name}`);
        } catch (error) {
            console.error(`[TELEGRAM LOADER] ${file}`, error);
        }
    }

    console.log(`[TELEGRAM LOADER] ${bot.commands.size} commands loaded`);
}

module.exports = loadCommands;
                
