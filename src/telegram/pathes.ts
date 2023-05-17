const telegramApiUrl = 'https://api.telegram.org/bot'

/** Url for getUpdates method. */
export const getTelegramGetUpdatesUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/getUpdates`)

/** Url for sendChatAction method. */
export const getTelegramSendActionUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/sendChatAction`)

/** Url for sendMessage method. */
export const getTelegramSendMessageUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/sendMessage`)

/** Url for getMe method. */
export const getTelegramBotCheckUrl = (apiKey: string) => new URL(`${telegramApiUrl}${apiKey}/getMe`)

/** Build Telegram Request URL */
export const buildTelegramUrl = (url: URL, offsetChanged: boolean, lastOffset: number) => {
    if (offsetChanged)
      url.searchParams.append('offset', (lastOffset + 1).toString())
    if (!offsetChanged && lastOffset !== 0)
      url.searchParams.append('offset', lastOffset.toString())
    url.searchParams.append('timeout', '120')
    url.searchParams.append('limit', '1')
  
    return url
  }
