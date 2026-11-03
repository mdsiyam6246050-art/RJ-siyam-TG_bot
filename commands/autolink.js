"use strict";

const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const COMMAND_NAME = "autolink";

module.exports = {
  config: {
    name: COMMAND_NAME,
    version: "1.3",
    author: AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: "Auto-download videos from links",
    category: "media",
    guide: "autolink <video URL>"
  },

  onStart: async function ({ ctx, args }) {
    if (module.exports.config.author !== AUTHOR ||
        module.exports.config.name !== COMMAND_NAME) {
      return ctx.reply("⛔ Unauthorized file modification detected!");
    }

    const url = args.find(item => /^https?:\/\//i.test(item));
    if (!url) {
      return ctx.reply("❌ একটি ভিডিও লিংক দিন।\nব্যবহার: /autolink [URL]");
    }

    try {
      await ctx.reply("💋 ভিডিও ডাউনলোড হচ্ছে...");

      const { title, filePath } = await downloadVideo(url);
      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error("Video download failed");
      }

      const stats = fs.statSync(filePath);
      const size = stats.size / (1024 * 1024);

      if (size > 25) {
        fs.unlinkSync(filePath);
        return ctx.reply("❌ ভিডিওটি ২৫ MB-এর বেশি। Telegram-এ পাঠানো যাচ্ছে না।");
      }

      await ctx.bot.api.request("sendVideo", {
        chat_id: ctx.chatId,
        video: fs.createReadStream(filePath),
        caption: `📥 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃
━━━━━━━━━━━━━━━
🎬 𝐓𝐈𝐓𝐋𝐄: ${title || "Video File"}
📦 𝐒𝐈𝐙𝐄: ${size.toFixed(2)} MB
━━━━━━━━━━━━━━━
🦋 NIJHUM CHATBOT`,
        reply_to_message_id: ctx.messageId
      });
    } catch (error) {
      console.error("Autolink Error:", error);
      return ctx.reply(`❌ ভিডিও ডাউনলোড করা যায়নি:\n${error.message}`);
    }
  }
};
