import { buildTrackPath } from "yandex_music/pathes";
import { ITelegramUpdate } from "./interfaces";


export const getMessageData = (update: ITelegramUpdate) => {
  return update.message?.text ?? buildTrackPath(update.callback_query?.data);
};

export const getChatId = (update: ITelegramUpdate) => {
  const chatId = update.message?.chat.id ?? update.callback_query?.message.chat.id;
  if (!chatId)
    throw new Error('Неизвестный тип сообщения');

  return chatId;
};
