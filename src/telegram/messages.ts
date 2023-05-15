import { IInlineButton, IMessageBody } from "./interfaces"
import { getTelegramSendActionUrlAsync } from "./pathes"
import { postWithBody } from "requests"


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
