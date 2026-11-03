"use strict";

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "goru",
    version: "2.3",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Expose someone as a Goru!",
    longDescription: "Puts the replied user's face on a cow's body",
    category: "fun",
    guide: "কাউকে Reply দিয়ে /goru লিখুন 😂"
  },

  onStart: async function ({ ctx }) {
    const target = ctx.message?.reply_to_message?.from;

    if (!target) {
      return ctx.reply("❗ কাউকে Reply দিয়ে /goru লিখুন!");
    }

    if (target.id === ctx.from.id) {
      return ctx.reply("❗ Bro, why would you cow yourself?");
    }

    let outputPath;

    try {
      const waitMsg = await ctx.reply("⌛️ Wait kor...");

      const cacheDir = path.join(__dirname, "goru_cache");
      await fs.ensureDir(cacheDir);

      const bgPath = path.join(cacheDir, "cow_bg.jpg");
      if (!fs.existsSync(bgPath)) {
        const bgResponse = await axios.get("https://files.catbox.moe/ecebko.jpg", {
          responseType: "arraybuffer",
          timeout: 20000
        });
        await fs.writeFile(bgPath, Buffer.from(bgResponse.data));
      }

      const photos = await ctx.bot.api.getUserProfilePhotos(target.id, { limit: 1 });
      const photo = photos.photos?.[0]?.slice(-1)[0];
      if (!photo) throw new Error("User profile photo পাওয়া যায়নি");

      const file = await ctx.bot.api.getFile(photo.file_id);
      const token = ctx.bot.token || ctx.bot.config?.botToken;
      const avatarUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

      const [bgImage, avatarResponse] = await Promise.all([
        loadImage(bgPath),
        axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 15000 })
      ]);

      const avatarImage = await loadImage(Buffer.from(avatarResponse.data));
      const canvas = createCanvas(bgImage.width, bgImage.height);
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.drawImage(bgImage, 0, 0);

      const avatarSize = 135;
      const centerX = 80 + avatarSize / 2;
      const centerY = 60 + avatarSize / 2;

      canvasCtx.save();
      canvasCtx.beginPath();
      canvasCtx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2);
      canvasCtx.clip();
      canvasCtx.shadowColor = "rgba(0,0,0,0.3)";
      canvasCtx.shadowBlur = 8;
      canvasCtx.shadowOffsetY = 3;
      canvasCtx.drawImage(
        avatarImage,
        centerX - avatarSize / 2,
        centerY - avatarSize / 2,
        avatarSize,
        avatarSize
      );
      canvasCtx.restore();

      canvasCtx.font = "bold 20px Arial";
      canvasCtx.fillStyle = "white";
      canvasCtx.textAlign = "left";
      canvasCtx.shadowColor = "black";
      canvasCtx.shadowBlur = 5;
      canvasCtx.fillText("Kire chdna", 40, 50);

      outputPath = path.join(cacheDir, `goru_${target.id}_${Date.now()}.png`);
      await fs.writeFile(outputPath, canvas.toBuffer("image/png"));

      const tagName = [target.first_name, target.last_name].filter(Boolean).join(" ");

      await ctx.bot.api.request("sendPhoto", {
        chat_id: ctx.chatId,
        photo: fs.createReadStream(outputPath),
        caption: `😹
${tagName} একদম আসল গরু হয়েছে বিদেশী গরু! 🐮✨
আরো কর বস সিয়ামের সাথে বিয়াদবি😴`,
        reply_to_message_id: ctx.messageId
      });

      if (waitMsg?.message_id) {
        try {
          await ctx.bot.api.request("deleteMessage", {
            chat_id: ctx.chatId,
            message_id: waitMsg.message_id
          });
        } catch {}
      }
    } catch (error) {
      console.error("Goru Command Error:", error);
      return ctx.reply("⚠️ something wrong, trying again 🙂");
    } finally {
      if (outputPath) await fs.remove(outputPath).catch(() => {});
    }
  }
};
