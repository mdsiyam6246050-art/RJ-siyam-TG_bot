"use strict";

const OWNER_NAME = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const ANTI_TAMPER = "𝆠፝";
const hiddenOwner = ANTI_TAMPER + OWNER_NAME;

if (hiddenOwner !== "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {
  throw new Error("Unauthorized file modification detected!");
}

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "ad",
    version: "1.0",
    author: hiddenOwner,
    countDown: 10,
    role: 0,
    shortDescription: "Generate ad style image",
    description: "Creates ad style meme image from profile picture",
    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
    guide: "ad — অথবা কারও মেসেজে Reply দিয়ে ad লিখুন"
  },

  onStart: async function ({ ctx }) {
    try {
      const target = ctx.message?.reply_to_message?.from || ctx.from;
      if (!target?.id) {
        return ctx.reply("❌ ইউজারের তথ্য পাওয়া যায়নি।");
      }

      const photos = await ctx.bot.api.getUserProfilePhotos(target.id, { limit: 1 });
      const photo = photos.photos?.[0]?.slice(-1)[0];

      if (!photo) {
        return ctx.reply("❌ এই ইউজারের Telegram profile photo পাওয়া যায়নি।");
      }

      const file = await ctx.bot.api.getFile(photo.file_id);
      const token = ctx.bot.token || ctx.bot.config?.botToken;
      if (!token || !file.file_path) {
        throw new Error("Telegram file information পাওয়া যায়নি");
      }

      const avatarURL = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      const apiURL = `https://api.popcat.xyz/v2/ad?image=${encodeURIComponent(avatarURL)}`;

      const res = await axios.get(apiURL, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      const cacheFolder = path.join(__dirname, "cache");
      fs.mkdirSync(cacheFolder, { recursive: true });

      const filePath = path.join(cacheFolder, `ad_${target.id}_${Date.now()}.png`);
      fs.writeFileSync(filePath, res.data);

      try {
        await ctx.bot.api.request("sendPhoto", {
          chat_id: ctx.chatId,
          photo: fs.createReadStream(filePath),
          caption: "📢কিরে শালা 😁তর এড দিয়া 😂ভাইরাল কইরা দিলাম🐸",
          reply_to_message_id: ctx.messageId
        });
      } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("AD Command Error:", error);
      return ctx.reply("❌ | Failed to generate ad image.");
    }
  }
};
