"use strict";

const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
  config: {
    name: "uff",
    aliases: [],
    author: LOCKED_AUTHOR,
    version: "1.0",
    countDown: 5,
    role: 2,
    shortDescription: "18+ tiktok video",
    longDescription: "18+ tiktok video",
    category: "18+",
    guide: "uff"
  },

  onStart: async function ({ ctx }) {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      return ctx.reply("⛔ Author change detected!");
    }

    try {
      const response = await axios.get(
        "https://only-tik.vercel.app/kshitiz",
        { timeout: 20000 }
      );

      const { videoUrl } = response.data;
      if (!videoUrl) throw new Error("Video URL পাওয়া যায়নি");

      await ctx.bot.api.request("sendVideo", {
        chat_id: ctx.chatId,
        video: videoUrl,
        reply_to_message_id: ctx.messageId
      });
    } catch (error) {
      console.error("Error fetching OnlyTik video:", error);
      return ctx.reply("Sorry, an error occurred while processing your request.");
    }
  }
};
