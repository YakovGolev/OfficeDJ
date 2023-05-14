import { GetApiKey } from "./storage/get_api_key"

export const InjectContentPath = 'build/inject_content.bundle.js'


const telegramApiUrl = 'https://api.telegram.org/bot'

export const getTelegramGetUpdatesUrlAsync = async () => `${telegramApiUrl}${await GetApiKey()}/getUpdates`
export const getTelegramSendActionUrlAsync = async () => `${telegramApiUrl}${await GetApiKey()}/sendChatAction`
export const getTelegramSendMessageUrlAsync = async () => `${telegramApiUrl}${await GetApiKey()}/sendMessage`