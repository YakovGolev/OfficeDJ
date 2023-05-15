import { GetApiKeyAsync } from "storage/get_api_key"

const telegramApiUrl = 'https://api.telegram.org/bot'

/** Url for getUpdates method. */
export const getTelegramGetUpdatesUrlAsync = async () => `${telegramApiUrl}${await GetApiKeyAsync()}/getUpdates`

/** Url for sendChatAction method. */
export const getTelegramSendActionUrlAsync = async () => `${telegramApiUrl}${await GetApiKeyAsync()}/sendChatAction`

/** Url for sendMessage method. */
export const getTelegramSendMessageUrlAsync = async () => `${telegramApiUrl}${await GetApiKeyAsync()}/sendMessage`

/** Build Telegram Request URL */
export const buildTelegramUrl = async (method: string, offsetChanged: boolean, lastOffset: number) => {
    const url = new URL(method)
    if (offsetChanged)
      url.searchParams.append('offset', (lastOffset + 1).toString())
    if (!offsetChanged && lastOffset !== 0)
      url.searchParams.append('offset', lastOffset.toString())
    url.searchParams.append('timeout', '120')
    url.searchParams.append('limit', '1')
  
    return url
  }
