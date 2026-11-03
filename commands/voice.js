"use strict";

module.exports = {
  config: {
    name: "voice",
    aliases: ["Voice", "fk"],
    version: "1.9",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Random captions with video and owner link",
    longDescription: "Bangla + English captions with direct video and owner contact link",
    category: "𝗙𝗨𝗡",
    guide: "voice"
  },

  onStart: async function ({ ctx }) {
    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {
      return ctx.reply("⚠️ [ SECURITY ALERT ]\nAuthor name change detected!");
    }

    const data = [
      {
        cap: "জীবনটা সহজ না, কিন্তু সুন্দর 😊\nকষ্ট থাকলেও হাসতে শিখো 💫\nনিজের উপর বিশ্বাস রাখো 💪",
        link: "https://files.catbox.moe/bs84st.mp4"
      },
      {
        cap: "সবাই পাশে থাকবে না 😌\nকিন্তু নিজে নিজেকে কখনো ছাড়ো না 💯\nনিজের ভ্যালু বুঝতে শিখো 🔥",
        link: "https://files.catbox.moe/hgo8gp.mp4"
      },
      {
        cap: "স্বপ্ন দেখতে ভয় পেয়ো না 💭\nআজ ছোট হলেও কাল বড় হবে 🚀\nধৈর্য ধরো, সময় আসবে,⏳🕰️",
        link: "https://files.catbox.moe/23zj4q.mp4"
      },
      {
        cap: "মন খারাপ হলেও চুপ থেকো না 😔\nনিজের সাথে কথা বলো 🙂\nসব ঠিক হয়ে যাবে একদিন 🌸",
        link: "https://files.catbox.moe/gogfic.mp4"
      },
      {
        cap: "নিজের মতো থাকো 😎\nকারো জন্য বদলাতে যেও না ❌",
        link: "https://files.catbox.moe/9uvit1.mp4"
      },
      {
        cap: "সময় অনেক কিছু শিখায় ⏳\nমানুষ চিনতে শেখায় 😶\nভুল থেকে শিক্ষা নাও 📖",
        link: "https://files.catbox.moe/l15d8y.mp4"
      },
      {
        cap: "ভালোবাসা পেতে হলে আগে নিজেকে ভালোবাসো ❤️\nনিজের যত্ন নাও 💫\nনিজেই নিজের happiness 😊🌸",
        link: "https://files.catbox.moe/22enjn.mp4"
      },
      {
        cap: "ছোট ছোট মুহূর্ত উপভোগ করো 📸\nএইগুলোই একদিন স্মৃতি হবে 💖\nহাসো, খেলো, বাঁচো 😊✨",
        link: "https://files.catbox.moe/gitfya.mp4"
      },
      {
        cap: "জীবন একটা যুদ্ধ ⚔️\nহার মানলে শেষ 😔\nলড়াই চালিয়ে যাও 💪🔥",
        link: "https://files.catbox.moe/src6qb.mp4"
      },
      {
        cap: "চুপ থাকা সবসময় দুর্বলতা না 🤫\nকখনো এটা শক্তি 💯\nসব কথা বলার দরকার নেই 😌",
        link: "https://files.catbox.moe/9iqdo0.mp4"
      }
    ];

    const randomItem = data[Math.floor(Math.random() * data.length)];
    const footer = `
✢━━━━━━━━━━━━━━━✢
--❖(✷‿𝐍𝐈𝐉𝐇𝐔𝐌-𝐁𝐎𝐓‿✷)❖--
✢━━━━━━━━━━━━━━━✢
[সিয়াম বসের ফ্রেন্ড ফারহানের ভয়েজ]
✢━━━━━━━━━━━━━━━✢
(✷‿𝐎𝐖𝐍𝐄𝐑:-𝐒𝐈𝐘𝐀𝐌‿✷)`;

    try {
      await ctx.reply("⚡ 𝗦𝗜𝗬𝗔𝗠 𝗕𝗢𝗦𝗦 𝗔𝗥 𝗩𝗜𝗗𝗘𝗢 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 𝗛𝗢𝗖𝗖𝗛𝗘... ⚡");

      await ctx.bot.api.request("sendVideo", {
        chat_id: ctx.chatId,
        video: randomItem.link,
        caption: randomItem.cap + footer,
        reply_to_message_id: ctx.messageId
      });
    } catch (error) {
      console.error("Voice Command Error:", error);
      return ctx.reply("❌ video load hote error hoyeche!");
    }
  }
};
