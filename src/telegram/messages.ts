import { buildTrackPath } from "yandex_music/pathes"
import { IInlineButton, IMessageBody, ITelegramUpdate } from "./interfaces"
import { getTelegramSendActionUrlAsync } from "./pathes"
import { postWithBody } from "requests"

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

  const response = await fetch(await getTelegramSendActionUrlAsync(), postWithBody(JSON.stringify(messageBody)))
  const jsonData = await response.json()

  return jsonData
}

export const getMessageData = (update: ITelegramUpdate) => {
  return update.message?.text ?? buildTrackPath(update.callback_query?.data)
}

export const getChatId = (update: ITelegramUpdate) => {
  const chatId = update.message?.chat.id ?? update.callback_query?.message.chat.id
  if (!chatId)
    throw new Error('Неизвестный тип сообщения')

  return chatId
}