"use strict";

const { startTelegram, stopTelegram } = require("./index");

let shuttingDown = false;

async function main() {
  try {
    console.log("================================");
    console.log("     RJ SIYAM TELEGRAM BOT");
    console.log("================================");

    await startTelegram();

    console.log("[START] Telegram bot is running.");
  } catch (error) {
    console.error("[START ERROR]", error.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  if (shuttingDown) return;

  shuttingDown = true;
  console.log(`[SYSTEM] ${signal} received. Stopping bot...`);

  try {
    await stopTelegram();
    console.log("[SYSTEM] Bot stopped.");
    process.exit(0);
  } catch (error) {
    console.error("[STOP ERROR]", error.message);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", error => {
  console.error("[UNHANDLED REJECTION]", error);
});

process.on("uncaughtException", error => {
  console.error("[UNCAUGHT EXCEPTION]", error);
});

main();
