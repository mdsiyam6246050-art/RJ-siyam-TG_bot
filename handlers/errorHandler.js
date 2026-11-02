
"use strict";

class TelegramErrorHandler {
    handle(error, context = "UNKNOWN") {
        console.error(
            `[TELEGRAM ERROR: ${context}]`,
            error?.stack || error
        );
    }
}

module.exports = TelegramErrorHandler;
