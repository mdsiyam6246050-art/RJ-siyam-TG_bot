"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒َান";

module.exports = {
  config: {
    name: "chemical",
    aliases: ["bounty", "কেমিনাল", "ধরো", "wanted"],
    version: "3.0",
    author: AUTHOR,
    role: 0,
    category: "fun",
    guide: "wanted অথবা chemical লিখুন। কারও মেসেজে Reply করেও ব্যবহার করতে পারবেন।",
    countDown: 5
  },

  onStart: async function ({ ctx }) {
    try {
      if (module.exports.config.author !== AUTHOR) {
        return ctx.reply("⛔ This file is locked!\nAuthor change detected.");
      }

      const target = ctx.message?.reply_to_message?.from || ctx.from;
      const targetID = target.id;
      const targetName = [target.first_name, target.last_name].filter(Boolean).join(" ") || "অভিযুক্ত আসামি";

      const crimes = [
        "রাত ২টায় বিরিয়ানির ছবি দিয়ে বন্ধুদের লোভ দেখানো!",
        "সব মেসেজ দেখেও সিন (Seen) করে রিপ্লাই না দেওয়া!",
        "গ্রুপে এসে আজেবাজে স্টিকার দিয়ে চ্যাট ভাসিয়ে দেওয়া!",
        "অনলাইন প্রেমে মিথ্যা আশ্বাস দিয়ে মন ভাঙা!",
        "প্রচুর পড়াশোনা করে পরীক্ষার আগে 'কিছুই পড়িনি' বলা!"
      ];

      const randomCrime = crimes[Math.floor(Math.random() * crimes.length)];
      const bountyAmount = (Math.floor(Math.random() * 45) + 5) * 1000000;
      const formattedBounty = "$" + bountyAmount.toLocaleString();

      let avatar;
      try {
        const photos = await ctx.bot.api.getUserProfilePhotos(targetID, { limit: 1 });
        const photo = photos.photos?.[0]?.slice(-1)[0];
        if (photo) {
          const file = await ctx.bot.api.getFile(photo.file_id);
          const token = ctx.bot.token || ctx.bot.config?.botToken;
          const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
          const response = await axios.get(url, { responseType: "arraybuffer" });
          avatar = await loadImage(Buffer.from(response.data));
        }
      } catch (e) {
        console.log("Telegram avatar unavailable:", e.message);
      }

      if (!avatar) {
        avatar = await loadImage("https://i.imgur.com/2dfL88M.png");
      }

      const width = 800;
      const height = 1000;
      const canvas = createCanvas(width, height);
      const ctx2 = canvas.getContext("2d");

      ctx2.fillStyle = "#0a0a0f";
      ctx2.fillRect(0, 0, width, height);

      ctx2.strokeStyle = "rgba(255, 0, 85, 0.15)";
      ctx2.lineWidth = 1;
      for (let i = 0; i < height; i += 20) {
        ctx2.beginPath();
        ctx2.moveTo(0, i);
        ctx2.lineTo(width, i);
        ctx2.stroke();
      }

      ctx2.shadowColor = "#ff0055";
      ctx2.shadowBlur = 30;
      ctx2.strokeStyle = "#ff0055";
      ctx2.lineWidth = 8;
      ctx2.strokeRect(25, 25, width - 50, height - 50);

      ctx2.shadowBlur = 20;
      ctx2.fillStyle = "#ff0055";
      ctx2.font = "bold 90px sans-serif";
      ctx2.textAlign = "center";
      ctx2.fillText("WANTED", width / 2, 130);

      ctx2.fillStyle = "#ffe600";
      ctx2.font = "bold 22px sans-serif";
      ctx2.fillText("DEAD OR ALIVE • CYBER CRIME DIVISION", width / 2, 170);

      ctx2.shadowColor = "#00f0ff";
      ctx2.shadowBlur = 25;
      ctx2.drawImage(avatar, width / 2 - 170, 230, 340, 340);

      ctx2.shadowBlur = 0;
      ctx2.fillStyle = "#ffffff";
      ctx2.font = "bold 36px sans-serif";
      ctx2.fillText(targetName.slice(0, 25), width / 2, 630);

      ctx2.fillStyle = "#ff0055";
      ctx2.font = "bold 22px sans-serif";
      ctx2.fillText("CRIME / অপরাধ:", width / 2, 680);

      ctx2.fillStyle = "#00f0ff";
      ctx2.font = "20px sans-serif";
      ctx2.fillText(randomCrime.slice(0, 55), width / 2, 720);

      ctx2.fillStyle = "#121520";
      ctx2.fillRect(80, 760, width - 160, 120);
      ctx2.strokeStyle = "#ffe600";
      ctx2.strokeRect(80, 760, width - 160, 120);

      ctx2.fillStyle = "#ffe600";
      ctx2.font = "bold 24px sans-serif";
      ctx2.fillText("💰 REWARD BOUNTY 💰", width / 2, 800);

      ctx2.fillStyle = "#ffffff";
      ctx2.font = "bold 48px sans-serif";
      ctx2.fillText(formattedBounty, width / 2, 855);

      ctx2.fillStyle = "#ff0055";
      ctx2.font = "bold 18px sans-serif";
      ctx2.fillText("─── 👑 OWNER: SIYAM-HASAN | NIJHUM CHATBOT ───", width / 2, 940);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      const imgPath = path.join(cacheDir, `wanted_${targetID}_${Date.now()}.png`);
      await fs.writeFile(imgPath, canvas.toBuffer("image/png"));

      try {
        await ctx.bot.api.request("sendPhoto", {
          chat_id: ctx.chatId,
          photo: fs.createReadStream(imgPath),
          caption: `» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
🚨 𝗪𝗔𝗡𝗧𝗘𝗗 𝗔𝗟𝗘𝗥𝗧 🚨
👤 নাম: ${targetName}
📌 অপরাধ: ${randomCrime}
💰 জরিমানা: ${formattedBounty}

⚠️ একে দেখলে দ্রুত সিয়াম ভাইকে খবর দিন!
───────────────
» 🧚‍♀️ NIJHUM CHATBOT`,
          reply_to_message_id: ctx.messageId
        });
      } finally {
        await fs.remove(imgPath);
      }
    } catch (error) {
      console.error("Chemical Command Error:", error);
      return ctx.reply("❌ ওয়ান্টেড পোস্টার তৈরি করতে সমস্যা হয়েছে!");
    }
  }
};
