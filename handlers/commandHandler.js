
"use strict";

const { parseCommand, createGetLang } = require("../core/utils");

class TelegramCommandHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async handle(ctx) {
        if (!ctx.message || !ctx.text) return false;

        const parsed = parseCommand(
            ctx.text,
            ctx.prefix,
            this.bot.me?.username
        );

        if (!parsed) return false;

        const { commandName, args } = parsed;

        ctx.commandName = commandName;
        ctx.args = args;

        const command =
            this.bot.commands.get(commandName) ||
            this.bot.commands.get(this.bot.aliases.get(commandName));

        if (!command) {
            await ctx.reply(
                this.bot.language.get(
                    "commandNotFound",
                    commandName,
                    ctx.prefix
                )
            );
            return true;
        }

        const permission = await this.bot.permissions.check(ctx, command);

        if (!permission.allowed) {
            const messages = {
                adminOnly: "onlyAdminBot",
                role: "onlyAdmin",
                group: "groupNotAllowed",
                private: "privateNotAllowed",
                channel: "channelNotAllowed",
                whitelist: "notWhitelisted",
                bot: "botNotAllowed"
            };

            const key = messages[permission.reason];

            if (key) {
                await ctx.reply(this.bot.language.get(key, commandName));
            }

            return true;
        }

        const cooldownSeconds =
            command.config.countDown ??
            this.bot.config.cooldown?.defaultSeconds ??
            1;

        if (this.bot.config.cooldown?.enabled) {
            const cooldown = this.bot.cooldown.check(
                commandName,
                ctx.userId,
                cooldownSeconds
            );

            if (!cooldown.allowed) {
                await ctx.reply(
                    this.bot.language.get(
                        "waitingForCommand",
                        cooldown.remaining
                    )
                );
                return true;
            }
        }

        const getLang = createGetLang(
            this.bot.language,
            ctx.prefix,
            commandName
        );

        const event = ctx.message;

        const params = {
            bot: this.bot,
            api: this.bot.api,
            ctx,
            event,
            message: ctx,
            args,
            commandName,
            config: this.bot.config,
            userId: ctx.userId,
            chatId: ctx.chatId,
            isOwner: permission.isOwner,
            isAdmin: permission.isAdmin,
            role: permission.role,
            getLang,
            reply: (text, options) => ctx.reply(text, options),
            send: (text, options) => ctx.sendMessage(text, options),
            SyntaxError: async () => {
                return ctx.reply(
                    this.bot.language.get(
                        "commandSyntaxError",
                        ctx.prefix,
                        commandName
                    )
                );
            }
        };

        try {
            if (typeof command.onStart !== "function") {
                throw new Error(
                    `Command ${commandName} does not export onStart()`
                );
            }

            await command.onStart(params);

            this.bot.cooldown.set(commandName, ctx.userId);

            if (this.bot.config.logging?.showCommands) {
                console.log(
                    `[TELEGRAM COMMAND] ${commandName} | ${ctx.userId} | ${ctx.chatId}`
                );
            }
        } catch (error) {
            console.error(
                `[TELEGRAM COMMAND ERROR] ${commandName}`,
                error
            );

            await ctx.reply(
                this.bot.language.get(
                    "errorOccurred",
                    commandName
                )
            ).catch(() => {});
        }

        return true;
    }
}

module.exports = TelegramCommandHandler;
          
