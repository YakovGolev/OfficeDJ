import { sendTypingAction } from "telegram/messaging"
import { getChatId, getMessageData } from "telegram/message_data"
import { ITelegramApiResponse } from "telegram/interfaces"
import { tryGetTrackUrl } from "utility"
import { searchTracksAsync } from "yandex_music/search"
import { addTrackAsync } from "yandex_music/page_interaction/actions"
import { handleCommandAsync } from "./handle_command"

/** handle message from Telegram. */
export const handleMessageAsync = async (data: ITelegramApiResponse) => {
  const update = data.result[0]
  const chatId = getChatId(update)
  const result = {
    chatId: chatId,
    lastOffset: update.update_id,
    offsetChanged: true
  }
  await sendTypingAction(chatId)

  const message = getMessageData(update)
  if (message.startsWith('/')) {
    if (message === '/start')
      return result
    await handleCommandAsync(message.slice(1), chatId)
    return result
  }

  const trackUrl = tryGetTrackUrl(message)
  if (trackUrl) {
    await addTrackAsync(trackUrl, chatId)
    return result
  }

  await searchTracksAsync(message, chatId)
  return result
}
