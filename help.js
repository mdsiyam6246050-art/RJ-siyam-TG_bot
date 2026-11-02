
"use strict";

module.exports = {
    config: {
        name: "help",
        aliases: ["menu", "commands"],
        description: "Show available Telegram commands",
        role: 0,
        countDown: 1
    },

    onStart: async function ({ bot, reply }) {
        const commands = [...bot.commands.values()];

        const list = commands.map((command, index) => {
            return `${index + 1}. ${bot.config.prefix}${command.config.name} - ${command.config.description || "No description"}`;
        });

        await reply(
            "📚 TELEGRAM COMMAND LIST\n\n" +
            list.join("\n")
        );
    }
};

"use strict";

module.exports = {
    config: {
        name: "help",
        aliases: ["menu", "commands"],
        description: "Show available Telegram commands",
        role: 0,
        countDown: 1
    },

    onStart: async function ({ bot, reply }) {
        const commands = [...bot.commands.values()];

        const list = commands.map((command, index) => {
            return `${index + 1}. ${bot.config.prefix}${command.config.name} - ${command.config.description || "No description"}`;
        });

        await reply(
            "📚 TELEGRAM COMMAND LIST\n\n" +
            list.join("\n")
        );
    }
};
