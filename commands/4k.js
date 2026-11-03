"use strict";

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const MODEL_VERSION = "badol-dslr-beauty-v6-natural";

function dslrEnhance(data, level) {
  const contrast = { "1": 1.10, "2": 1.14, "3": 1.18, "4": 1.20, "5": 1.22 }[level];
  const bright = { "1": 4, "2": 4, "3": 6, "4": 8, "5": 10 }[level];

  for (let i = 0; i < data.length; i += 4) {
    let r = (data[i] - 128) * contrast + 128 + bright;
    let g = (data[i + 1] - 128) * contrast + 128 + bright + 2;
    let b = (data[i + 2] - 128) * contrast + 128 + bright + 5;
    const avg = (r + g + b) / 3;
    const sat = level === "5" ? 1.30 : level === "4" ? 1.25 : 1.20;

    r = avg + (r - avg) * sat;
    g = avg + (g - avg) * sat;
    b = avg + (b - avg) * sat;

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
}

module.exports = {
  config: {
    name: "4k",
    aliases: ["hd", "enhance", "remini", "hdr", "8k"],
    version: "6.0-DSLR-PRO",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: "DSLR Beautiful HD",
    longDescription: "Photo to DSLR Beautiful HD - 5 Levels",
    category: "image",
    guide: "4k [1-5] — ছবিতে Reply দিন।"
  },

  onStart: async function ({ ctx, args }) {
    const photo = ctx.message?.reply_to_message?.photo;
    if (!photo?.length) {
      return ctx.reply(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📸 Model: ${MODEL_VERSION}
» 📌 USAGE GUIDE:
» /4k = Auto Full HD
» /4k 1 = Low HD
» /4k 2 = Natural HD
» /4k 3 = DSLR 4K
» /4k 4 = DSLR 8K
» /4k 5 = DSLR 16K Beautiful

» 💡 একটি ছবিতে Reply দিয়ে কমান্ড দিন
───────────────
» 🧚‍♀️ NIJHUM CHATBOT`
      );
    }

    const level = ["1", "2", "3", "4", "5"].includes(args[0]) ? args[0] : "5";
    const names = {
      "1": "LOW HD",
      "2": "NATURAL HD",
      "3": "DSLR 4K",
      "4": "DSLR 8K ULTRA",
      "5": "DSLR 16K BEAUTIFUL"
    };
    const scales = { "1": 1.4, "2": 1.6, "3": 2, "4": 2.4, "5": 2.8 };

    const status = await ctx.reply(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📸 Mode: ${names[level]}
» 🌸 No Red ✓ Natural Skin
» ⏳ Enhancing...
───────────────
» 🧚‍♀️ NIJHUM CHATBOT`
    );

    const cacheDir = path.join(__dirname, "cache");
    fs.mkdirSync(cacheDir, { recursive: true });

    let inputPath;
    let outputPath;

    try {
      const file = await ctx.bot.api.getFile(photo[photo.length - 1].file_id);
      const token = ctx.bot.token || ctx.bot.config?.botToken;
      if (!token || !file.file_path) throw new Error("Telegram file information পাওয়া যায়নি");

      const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      const id = `${Date.now()}`;
      inputPath = path.join(cacheDir, `dslr_in_${id}.jpg`);
      outputPath = path.join(cacheDir, `dslr_out_${id}.jpg`);
      fs.writeFileSync(inputPath, Buffer.from(response.data));

      const img = await loadImage(inputPath);
      const scale = scales[level];
      const canvas = createCanvas(
        Math.floor(img.width * scale),
        Math.floor(img.height * scale)
      );
      const canvasCtx = canvas.getContext("2d");

      canvasCtx.imageSmoothingEnabled = true;
      canvasCtx.imageSmoothingQuality = "high";
      canvasCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
      dslrEnhance(imageData.data, level);
      canvasCtx.putImageData(imageData, 0, 0);

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.96 }));

      await ctx.bot.api.request("sendPhoto", {
        chat_id: ctx.chatId,
        photo: fs.createReadStream(outputPath),
        caption: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ✅ Success: ${names[level]}
» 🌸 No Red ✓ Natural Skin
» 📐 ${img.width}x${img.height} ➔ ${canvas.width}x${canvas.height}
» 👑 Author: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
» 🧚‍♀️ NIJHUM CHATBOT`,
        reply_to_message_id: ctx.messageId
      });
    } catch (error) {
      await ctx.reply(`» ❌ Error: ${error.message}\n» 🔄 Please Try Again Later.`);
    } finally {
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }
};
