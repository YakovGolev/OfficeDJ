import { getChatId, getMessageData, sendTypingAction } from "telegram/messages"
import { ITelegramApiResponse } from "telegram/interfaces"
import { tryGetTrackUrl } from "utility"
import { searchTracksAsync } from "yandex_music/search"
import { addTrackAsync } from "yandex_music/page_interaction/actions"

/** handle message from Telegram. */
export const handleMessageAsync = async (data: ITelegramApiResponse, lastOffset: number, offsetChanged: boolean) => {
  const update = data.result[0]
  const chatId = getChatId(update)
  await sendTypingAction(chatId)
  lastOffset = update.update_id
  offsetChanged = true
  const message = getMessageData(update)
  const trackUrl = tryGetTrackUrl(message)
  if (trackUrl) {
    await addTrackAsync(trackUrl, chatId)
  }
  else {
    await searchTracksAsync(message, chatId)
  }

  return { chatId, lastOffset, offsetChanged }
}
