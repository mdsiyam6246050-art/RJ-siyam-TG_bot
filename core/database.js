
"use strict";

const fs = require("fs");
const path = require("path");

class TelegramDatabase {
    constructor() {
        this.directory = path.join(__dirname, "..", "database");

        this.files = {
            users: path.join(this.directory, "users.json"),
            groups: path.join(this.directory, "groups.json"),
            global: path.join(this.directory, "global.json")
        };

        this.data = {};
        this.saveQueue = Promise.resolve();

        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory, { recursive: true });
        }

        for (const [name, file] of Object.entries(this.files)) {
            if (!fs.existsSync(file)) {
                fs.writeFileSync(file, "{}", "utf8");
            }

            try {
                this.data[name] = JSON.parse(
                    fs.readFileSync(file, "utf8")
                );
            } catch {
                throw new Error(`Invalid Telegram database file: ${file}`);
            }
        }
    }

    get(collection, id) {
        return this.data[collection]?.[String(id)] ?? null;
    }

    async set(collection, id, value) {
        if (!this.data[collection]) {
            throw new Error(`Unknown database collection: ${collection}`);
        }

        this.data[collection][String(id)] = value;
        await this.save(collection);

        return value;
    }

    async delete(collection, id) {
        if (!this.data[collection]) return false;

        delete this.data[collection][String(id)];
        await this.save(collection);

        return true;
    }

    async createUser(ctx) {
        const id = String(ctx.userId);

        if (!this.data.users[id]) {
            this.data.users[id] = {
                userId: id,
                firstName: ctx.from?.first_name || "",
                username: ctx.from?.username || "",
                languageCode: ctx.from?.language_code || "",
                banned: {
                    status: false,
                    reason: ""
                },
                createdAt: Date.now()
            };

            await this.save("users");
        }

        return this.data.users[id];
    }

    async createGroup(ctx) {
        const id = String(ctx.chatId);

        if (!this.data.groups[id]) {
            this.data.groups[id] = {
                chatId: id,
                title: ctx.chat?.title || "",
                type: ctx.chat?.type || "",
                banned: {
                    status: false,
                    reason: ""
                },
                settings: {},
                createdAt: Date.now()
            };

            await this.save("groups");
        }

        return this.data.groups[id];
    }

    async save(collection) {
        const file = this.files[collection];

        this.saveQueue = this.saveQueue.then(async () => {
            const temp = `${file}.tmp`;

            await fs.promises.writeFile(
                temp,
                JSON.stringify(this.data[collection], null, 2),
                "utf8"
            );

            await fs.promises.rename(temp, file);
        });

        return this.saveQueue;
    }
}

module.exports = TelegramDatabase;
