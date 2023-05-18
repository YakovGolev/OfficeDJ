const telegramApiUrl = 'https://api.telegram.org/bot'

/** Url for getUpdates method. */
export const getTelegramGetUpdatesUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/getUpdates`)

/** Url for sendChatAction method. */
export const getTelegramSendActionUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/sendChatAction`)

/** Url for sendMessage method. */
export const getTelegramSendMessageUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/sendMessage`)

/** Url for getMe method. */
export const getTelegramBotCheckUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/getMe`)
