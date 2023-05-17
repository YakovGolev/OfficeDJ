import { IInlineButton, IMessageBody, ITelegramApiResponse } from "./interfaces"
import { postWithBody } from "requests"
import { getTelegramBotCheckUrl, getTelegramSendActionUrl } from "./pathes"
import { GetApiKeyAsync } from "storage/get_api_key"

/** Send reply to Telegram. */
export const sendMessageAsync = async <T>(url: URL, chatId: number, message: string, buttons?: IInlineButton[][]): Promise<T> => {
  const messageBody: IMessageBody = {
    chat_id: chatId,
    text: message,
  }
  if (buttons)
    messageBody.reply_markup = {
      inline_keyboard: buttons
    }

  const response = await fetch(url, postWithBody(JSON.stringify(messageBody)))
  const jsonData = await response.json()

  return jsonData
}

export const sendTypingAction = async (chatId: number): Promise<void> => {
  const messageBody = {
    chat_id: chatId,
    action: 'typing'
  }
  const apiKey = await GetApiKeyAsync()
  const url = getTelegramSendActionUrl(apiKey)
  const response = await fetch(url, postWithBody(JSON.stringify(messageBody)))
  const jsonData = await response.json()

  return jsonData
}

export const sendCkeckRequest = async (apiKey: string): Promise<boolean> => {
  const url = getTelegramBotCheckUrl(apiKey)
  const response = await fetch(url)
  const jsonData = await response?.json() as ITelegramApiResponse

  return jsonData?.ok
}
