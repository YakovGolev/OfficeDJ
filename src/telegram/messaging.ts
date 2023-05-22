import { IInlineButton, IMessageBody, ITelegramApiResponse } from "./interfaces"
import { postWithBody } from "requests"
import { getTelegramBotCheckUrl, getTelegramGetUpdatesUrl, getTelegramSendActionUrl } from "./pathes"
import { getApiKeyAsync } from "storage/get_api_key"
import { getTelegramSendMessageUrl } from "./pathes"

let apiKey = ''
let sendMessageUrl: URL, sendActionUrl: URL

export const UpdateApiKeyAsync = async () => {
  apiKey = await getApiKeyAsync()
  UpdateUrls()
}

/** Send reply to Telegram. */
export const sendMessageAsync = async <T>(chatId: number, message: string, buttons?: IInlineButton[][]): Promise<T> => {
  const messageBody: IMessageBody = {
    chat_id: chatId,
    text: message,
  }
  if (buttons)
    messageBody.reply_markup = {
      inline_keyboard: buttons
    }

  const response = await fetch(sendMessageUrl, postWithBody(JSON.stringify(messageBody)))
  const jsonData = await response.json()

  return jsonData
}

export const sendTypingAction = async (chatId: number): Promise<void> => {
  const messageBody = {
    chat_id: chatId,
    action: 'typing'
  }
  const response = await fetch(sendActionUrl, postWithBody(JSON.stringify(messageBody)))
  const jsonData = await response.json()

  return jsonData
}

export const sendCkeckRequest = async (apiKey: string): Promise<boolean> => {
  const response = await fetch(getTelegramBotCheckUrl(apiKey))
  const jsonData = await response?.json() as ITelegramApiResponse

  return jsonData?.ok
}

export const getGetUpdatesUrl = () => getTelegramGetUpdatesUrl(apiKey)

const UpdateUrls = () => {
  sendMessageUrl = getTelegramSendMessageUrl(apiKey)
  sendActionUrl = getTelegramSendActionUrl(apiKey)
}
