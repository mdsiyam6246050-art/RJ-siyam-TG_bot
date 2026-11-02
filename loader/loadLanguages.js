
"use strict";

const fs = require("fs");
const path = require("path");

function loadLanguages() {
    const directory = path.join(__dirname, "..", "languages");

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    return fs.readdirSync(directory)
        .filter(name => fs.statSync(path.join(directory, name)).isDirectory());
}

module.exports = loadLanguages;
