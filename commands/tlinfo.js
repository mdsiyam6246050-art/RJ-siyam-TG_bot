"use strict";

module.exports = {
  config: {
    name: "tlinfo",
    aliases: ["tl", "ইনফো", "uidinfo"],
    version: "5.0.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 2,
    role: 0,
    shortDescription: "Get Telegram user information",
    longDescription: "Fetch Telegram user profile details",
    category: "utility",
    guide: "fbinfo — অথবা কারও মেসেজে Reply দিয়ে fbinfo"
  },

  onStart: async function ({ ctx }) {
    const target = ctx.message?.reply_to_message?.from || ctx.from;

    if (!target) {
      return ctx.reply("❌ ইউজারের তথ্য পাওয়া যায়নি।");
    }

    const name = [target.first_name, target.last_name].filter(Boolean).join(" ") || "Unknown";
    const username = target.username ? `@${target.username}` : "নেই";
    const profileUrl = target.username
      ? `https://t.me/${target.username}`
      : "Username নেই";

    const isBot = target.is_bot ? "হ্যাঁ" : "না";
    const language = target.language_code || "Private / Hidden";

    return ctx.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
👤 𝐔𝐒𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 𝐈𝐍𝐅𝐎

» 📛 𝐍𝐚𝐦𝐞 : ${name}
» 🆔 𝐔𝐈𝐃 : ${target.id}
» 🏷️ 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 : ${username}
» 🤖 𝐈𝐬 𝐁𝐨𝐭 : ${isBot}
» 🌐 𝐋𝐚𝐧𝐠𝐮𝐚𝐠𝐞 : ${language}
» 🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 : ${profileUrl}
───────────────
» 🧚‍♀️ NIJHUM CHATBOT`
    );
  }
};
