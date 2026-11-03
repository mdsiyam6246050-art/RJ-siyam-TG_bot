"use strict";

const axios = require("axios");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

const baseApiUrl = async () => {
  const response = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json",
    { timeout: 15000 }
  );
  return response.data.mahmud;
};

module.exports = {
  config: {
    name: "album",
    version: "1.7",
    role: 0,
    author: LOCKED_AUTHOR,
    category: "media",
    guide: "album [page number]\nalbum add [category] [video URL]\nalbum list"
  },

  onStart: async function ({ ctx, args }) {
    try {
      const apiUrl = await baseApiUrl();

      if (args[0] === "add") {
        const category = args[1]?.toLowerCase();
        const videoUrl = args[2];

        if (!category) {
          return ctx.reply("Please specify a category. Usage: album add [category] [URL]");
        }

        if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) {
          return ctx.reply("❌ Please provide a valid video URL.");
        }

        const response = await axios.post(
          `${apiUrl}/api/add`,
          { category, videoUrl },
          { timeout: 20000 }
        );

        return ctx.reply(response.data.message || "✅ Video added successfully.");
      }

      if (args[0] === "list") {
        const response = await axios.get(
          `${apiUrl}/api/album/mahmud/list`,
          { timeout: 20000 }
        );
        return ctx.reply(response.data.message || "Album list পাওয়া যায়নি।");
      }

      const response = await axios.get(
        `${apiUrl}/api/album/mahmud/list`,
        { timeout: 20000 }
      );

      const text = response.data.message || "Album list পাওয়া যায়নি।";
      return ctx.reply(`${text}\n\n📖 Page: ${args[0] || 1}`);
    } catch (error) {
      return ctx.reply(
        `❌ Album Error:\n${error.response?.data?.error || error.message}`
      );
    }
  }
};
