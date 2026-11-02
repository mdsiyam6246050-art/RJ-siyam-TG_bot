"use strict";

module.exports = {
    config: {
        name: "welcome"
    },

    onEvent: async function ({ ctx, reply }) {
        const member = ctx.update.new_chat_members;

        if (!member || !Array.isArray(member)) return;

        for (const user of member) {
            if (user.is_bot) continue;

            await reply(
                `👋 Welcome ${user.first_name || "friend"}!`
            );
        }
    }
};
