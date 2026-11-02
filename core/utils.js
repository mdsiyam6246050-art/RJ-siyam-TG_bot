
"use strict";

function parseCommand(text, prefix, botUsername = "") {
    if (typeof text !== "string") return null;

    const body = text.trim();

    if (!body) return null;

    let commandText = "";

    if (body.startsWith(prefix)) {
        commandText = body.slice(prefix.length).trim();
    } else if (body.startsWith("/")) {
        commandText = body.slice(1).trim();
    } else {
        return null;
    }

    const parts = commandText.split(/\s+/);
    let commandName = (parts.shift() || "").toLowerCase();

    if (commandName.includes("@")) {
        const [name, username] = commandName.split("@");

        if (
            botUsername &&
            username.toLowerCase() !== botUsername.toLowerCase()
        ) {
            return null;
        }

        commandName = name;
    }

    return {
        commandName,
        args: parts,
        body
    };
}

function createGetLang(language, prefix, commandName) {
    return function (key, ...args) {
        let text = language.get(key, ...args);

        return text
            .replace(/\{pn\}/g, `${prefix}${commandName}`)
            .replace(/\{p\}/g, prefix)
            .replace(/\{prefix\}/g, prefix)
            .replace(/\{n\}/g, commandName);
    };
}

module.exports = {
    parseCommand,
    createGetLang
};
