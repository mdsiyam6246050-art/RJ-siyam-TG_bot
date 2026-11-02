
"use strict";

module.exports = {
    config: {
        name: "goodbye"
    },

    onEvent: async function ({ ctx, reply }) {
        const member = ctx.update.left_chat_member;

        if (!member || member.is_bot) return;

        await reply(
            `👋 Goodbye ${member.first_name || "friend"}!`
        );
    }
};
