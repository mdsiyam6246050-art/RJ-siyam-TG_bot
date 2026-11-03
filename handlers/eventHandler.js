"use strict";

class EventHandler {
  constructor(bot) {
    this.bot = bot;
    this.events = [];
  }

  register(event) {
    this.events.push(event);
  }

  async dispatch(method, ctx) {
    if (this.bot.config.features?.events === false) return;

    for (const event of this.events) {
      if (typeof event[method] !== "function") continue;

      try {
        await event[method](ctx, this.bot);
      } catch (error) {
        console.error(
          `[EVENT ERROR] ${event.config?.name || "Unknown"}:`,
          error.message
        );
      }
    }
  }
}

module.exports = EventHandler;
