"use strict";

const { startTelegram } = require("./index");

async function main() {
    try {
        await startTelegram();
    } catch (error) {
        console.error("[RJ-SIYAM-TG] Startup error:", error);
        process.exit(1);
    }
}

process.on("unhandledRejection", error => {
    console.error("[RJ-SIYAM-TG] Unhandled rejection:", error);
});

process.on("uncaughtException", error => {
    console.error("[RJ-SIYAM-TG] Uncaught exception:", error);
    process.exit(1);
});

main();
