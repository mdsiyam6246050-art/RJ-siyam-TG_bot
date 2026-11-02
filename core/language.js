
"use strict";

const fs = require("fs");
const path = require("path");

class TelegramLanguage {
    constructor(config) {
        this.config = config;
        this.language = config.language || "en";
        this.cache = {};
    }

    load(language = this.language) {
        if (this.cache[language]) return this.cache[language];

        const file = path.join(
            __dirname,
            "..",
            "languages",
            language,
            "handlerEvents.js"
        );

        if (!fs.existsSync(file)) {
            if (language !== "en") return this.load("en");
            return {};
        }

        delete require.cache[require.resolve(file)];

        this.cache[language] = require(file);
        return this.cache[language];
    }

    get(key, ...args) {
        let messages = this.load();
        let message = messages[key];

        if (!message && this.language !== "en") {
            message = this.load("en")[key];
        }

        if (!message) return `Missing language text: ${key}`;

        return args.reduce((result, value, index) => {
            return result.replace(
                new RegExp(`%${index + 1}`, "g"),
                String(value)
            );
        }, message);
    }
}

module.exports = TelegramLanguage;
