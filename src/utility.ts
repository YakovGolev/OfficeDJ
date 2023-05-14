import { getTelegramSendActionUrlAsync } from "./constants"

export const getDataAsync = async <T> (url: URL): Promise<T> => {    
    const response = await fetch(url)
    const jsonData = await response.json()
  
    return jsonData
  }

  export interface IInlineButton {
    text: string
    callback_data: string
  }

  interface IMessageBody {
    chat_id: number
    text: string
    reply_markup?: {
      inline_keyboard: IInlineButton[][]
    } 
  }

  export const sendMessageAsync = async <T> (url: URL, chatId: number, message: string, buttons?: IInlineButton[][]): Promise<T> => {
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

  const defaultPostRequest = {
    method: "POST", 
    mode: "cors", 
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", 
    referrerPolicy: "no-referrer",
    body: undefined
  }

  const postWithBody = (body: string): RequestInit => {
    return {...defaultPostRequest, body: body} as RequestInit
  }
  