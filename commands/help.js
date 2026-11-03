"use strict";

const fs = require("fs");
const path = require("path");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝗔𝗦𝗔𝗡";

function getSortedCommands() {
  const directories = [
    __dirname,
    path.join(__dirname, "..", "private")
  ];

  const commandSet = new Set();

  for (const dir of directories) {
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".js") || file === "help.js") continue;

      try {
        const filePath = path.join(dir, file);
        delete require.cache[require.resolve(filePath)];

        const exported = require(filePath);
        const command = exported.default || exported;
        const name = command.config?.name || command.name;

        if (name && typeof name === "string") {
          commandSet.add(name.toLowerCase());
        }
      } catch (error) {
        console.error(`[HELP] Cannot load ${file}:`, error.message);
      }
    }
  }

  return [...commandSet].sort();
}

module.exports = {
  config: {
    name: "help",
    aliases: ["commands", "menu", "start"],
    version: "3.0.0",
    author: AUTHOR,
    role: 0,
    category: "general",
    shortDescription: "Displays all available commands",
    guide: "help"
  },

  onStart: async function ({ ctx, bot }) {
    try {
      const commands = getSortedCommands();
      const totalCommands = commands.length;

      if (totalCommands === 0) {
        return ctx.reply("❌ কোনো কমান্ড পাওয়া যায়নি।");
      }

      let message = "━━━━❪👤❫━━━━\n";

      commands.forEach((cmd, index) => {
        message += `┣⊸ ${index + 1} ✿ /${cmd}\n`;
      });

      message += "━━━━❪👤❫━━━━\n\n";
      message += "🌿 ★ 𝗘𝗦𝗕-𝗕𝗢𝗧 ★\n";
      message += `𝗧𝗢𝗧𝗔𝗟 𝗖𝗠𝗗: [ ${totalCommands} ]\n`;
      message += "𝗗𝗘𝗩: 𝗘𝗦𝗕-𝗧𝗘𝗔𝗠";

      const links = bot?.config?.links || {};

      const ownerUrl =
        links.owner?.url || "https://t.me/ri_siyam";

      const addBotUrl =
        links.addBot?.url || "https://t.me/siyam_nu_bot?startgroup=true";

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: links.owner?.label || "👑 OWNER INBOX",
              url: ownerUrl
            }
          ],
          [
            {
              text: links.addBot?.label || "➕ ADD BOT TO GROUP",
              url: addBotUrl
            }
          ]
        ]
      };

      const chunks = [];
      const lines = message.split("\n");
      let current = "";

      for (const line of lines) {
        if ((current + line + "\n").length > 3900) {
          chunks.push(current);
          current = "";
        }
        current += line + "\n";
      }

      if (current.trim()) chunks.push(current);

      for (let i = 0; i < chunks.length; i++) {
        await ctx.bot.api.sendMessage(ctx.chatId, chunks[i], {
          reply_to_message_id: i === 0 ? ctx.messageId : undefined,
          reply_markup: i === chunks.length - 1 ? keyboard : undefined
        });
      }
    } catch (error) {
      console.error("[HELP COMMAND ERROR]", error);
      return ctx.reply("❌ Help menu দেখাতে সমস্যা হয়েছে।");
    }
  }
};
