"use strict";

const TelegramAPI = require("./api");
const Permissions = require("./permissions");
const CommandHandler = require("../handlers/commandHandler");
const MessageHandler = require("../handlers/messageHandler");
const EventHandler = require("../handlers/eventHandler");

const loadCommands = require("../loader/loadCommands");
const loadEvents = require("../loader/loadEvents");

class TelegramBot {
  constructor(config) {
    this.config = config;
    this.api = new TelegramAPI(config.botToken);

    this.commands = new Map();
    this.running = false;
    this.offset = 0;
    this.pollController = null;

    this.permissions = new Permissions(this);
    this.commandHandler = new CommandHandler(this);
    this.messageHandler = new MessageHandler(this);
    this.eventHandler = new EventHandler(this);
  }

  async start() {
    const me = await this.api.getMe();

    await this.api.deleteWebhook(
      this.config.polling?.dropPendingUpdates === true
    );

    console.log(`[BOT] Connected as @${me.username || me.id}`);

    loadCommands(this);
    loadEvents(this);

    this.running = true;

    // Polling আলাদাভাবে চলবে; start() সঙ্গে সঙ্গে ফিরে আসবে।
    this.poll().catch(error => {
      console.error("[POLLING FATAL ERROR]", error);
      this.running = false;
    });

    return me;
  }

  async poll() {
    const timeout = Math.min(
      50,
      Math.max(1, Number(this.config.polling?.timeout || 30))
    );

    while (this.running) {
      this.pollController = new AbortController();

      try {
        const updates = await this.api.getUpdates(
          this.offset,
          timeout,
          this.pollController.signal
        );

        for (const update of updates) {
          if (!this.running) break;

          this.offset = update.update_id + 1;

          try {
            await this.messageHandler.handle(update);
          } catch (error) {
            console.error("[UPDATE ERROR]", error);
          }
        }
      } catch (error) {
        if (!this.running) break;

        if (error.name === "AbortError") continue;

        console.error("[POLLING ERROR]", error.message);

        await new Promise(resolve => {
          setTimeout(
            resolve,
            Number(this.config.polling?.retryDelayMs || 3000)
          );
        });
      } finally {
        this.pollController = null;
      }
    }
  }

  async stop() {
    this.running = false;

    if (this.pollController) {
      this.pollController.abort();
    }
  }
}

module.exports = TelegramBot;
