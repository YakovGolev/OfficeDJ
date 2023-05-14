/** Users message. */
export interface ITelegramMessage {
  text: string
  chat: { id: number; }
}

/** Update recieved from getUpdates method. */
export interface ITelegramUpdate {
  update_id: number
  message?: ITelegramMessage
  callback_query?: {
    message: ITelegramMessage
    data: string;
  };
}

/** Response from Telegram Api */
export interface ITelegramApiResponse {
  ok: boolean
  result: ITelegramUpdate[]
}
