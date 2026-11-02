
"use strict";

const TelegramAPI = require("./api");
const TelegramContext = require("./context");
const TelegramPermissions = require("./permissions");
const TelegramLanguage = require("./language");
const TelegramDatabase = require("./database");
const TelegramCooldown = require("./cooldown");
const TelegramReply = require("./reply");

const loadCommands = require("../loader/loadCommands");
const loadEvents = require("../loader/loadEvents");

const CommandHandler = require("../handlers/commandHandler");
const MessageHandler = require("../handlers/messageHandler");
const EventHandler = require("../handlers/eventHandler");
const CallbackHandler = require("../handlers/callbackHandler");
const ReplyHandler = require("../handlers/replyHandler");
const ReactionHandler = require("../handlers/reactionHandler");
const ErrorHandler = require("../handlers/errorHandler");

class TelegramBot {
    constructor(config) {
        this.config = config;

        this.api = new TelegramAPI(config.botToken);
        this.permissions = new TelegramPermissions(this);
        this.language = new TelegramLanguage(config);
        this.database = new TelegramDatabase();
        this.cooldown = new TelegramCooldown();
        this.reply = new TelegramReply();

        this.commands = new Map();
        this.aliases = new Map();

        this.events = new EventHandler(this);

        this.commandHandler = new CommandHandler(this);
        this.messageHandler = new MessageHandler(this);
        this.callbackHandler = new CallbackHandler(this);
        this.replyHandler = new ReplyHandler(this);
        this.reactionHandler = new ReactionHandler(this);
        this.errorHandler = new ErrorHandler();

        this.me = null;
        this.offset = 0;
        this.running = false;
        this.pollingController = null;
    }

    createContext(update) {
        return new TelegramContext(this, update);
    }

    async start() {
        if (this.running) return;

        this.me = await this.api.getMe();

        await this.api.request("deleteWebhook", {
            drop_pending_updates: Boolean(
                this.config.polling?.dropPendingUpdates
            )
        });

        loadCommands(this);
        loadEvents(this);

        this.running = true;

        console.log(
            `[TELEGRAM] Logged in as @${this.me.username || this.me.id}`
        );

        this.poll();
    }

    async poll() {
        while (this.running) {
            try {
                const updates = await this.api.getUpdates(
                    this.offset,
                    this.config.polling?.timeout || 30
                );

                for (const update of updates) {
                    this.offset = update.update_id + 1;

                    try {
                        await this.handleUpdate(update);
                    } catch (error) {
                        this.errorHandler.handle(error, "UPDATE");
                    }
                }
            } catch (error) {
                if (!this.running) break;

                this.errorHandler.handle(error, "POLLING");

                await new Promise(resolve =>
                    setTimeout(
                        resolve,
                        this.config.polling?.retryDelayMs || 3000
                    )
                );
            }
        }
    }

    async handleUpdate(update) {
        const ctx = this.createContext(update);

        if (update.message || update.edited_message) {
            if (ctx.isReply) {
                const handled = await this.replyHandler.handle(ctx);
                if (handled) return;
            }

            await this.messageHandler.handle(ctx);
            return;
        }

        if (update.callback_query) {
            await this.callbackHandler.handle(update);
            return;
        }

        if (update.message_reaction) {
            await this.reactionHandler.handle(update);
            return;
        }

        await this.events.dispatch("onEvent", ctx);
    }

    async stop() {
        this.running = false;

        if (this.pollingController) {
            this.pollingController.abort();
        }

        this.reply.clear();
        this.cooldown.clear();
    }
}

module.exports = TelegramBot;
          
