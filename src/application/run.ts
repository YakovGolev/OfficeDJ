import { getDataAsync } from "requests"
import { sendMessageAsync, sendTypingAction } from "telegram/messages"
import { getTelegramSendMessageUrlAsync, getTelegramGetUpdatesUrlAsync, buildTelegramUrl } from "telegram/pathes"
import { ITelegramApiResponse } from "telegram/interfaces"
import { setPageBlock } from "page_block/setPageBlock"
import { injectScript } from "yandex_music/external_api/inject_script"
import { tryGetTrackUrl } from "utility"
import { searchTracksAsync } from "yandex_music/search/search"
import { addTrack } from "yandex_music/page_interaction/actions"

/** Run Application. */
export const runApplication = async () => {
  injectScript()
  setPageBlock()

  let lastOffset = 0
  let offsetChanged = false
  document.addEventListener(nextMessageEvent, async () => {
    let chatId = 0

    try {
      const url = await buildTelegramUrl(await getTelegramGetUpdatesUrlAsync(), offsetChanged, lastOffset)
      const data = await getDataAsync<ITelegramApiResponse>(url)

      if (data.ok && data.result.length) {
        const update = data.result[0]
        chatId = update.message?.chat.id ?? update.callback_query?.message.chat.id ?? 0
        await sendTypingAction(chatId)
        lastOffset = update.update_id
        offsetChanged = true
        const message = update.message?.text ?? `https://music.yandex.ru/${update.callback_query?.data}`
        const trackUrl = tryGetTrackUrl(message)
        if (trackUrl) {
          await addTrack(trackUrl, chatId)
        }
        else {
          await searchTracksAsync(message, chatId)
        }
      }
      else {
        offsetChanged = false
      }
    } catch (error) {
      console.log(error)
      await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, (error as Error).toString())
    }
    finally {
      getNextMessage()
    }
  })
  getNextMessage()
}

const nextMessageEvent = 'getNextMessage'

const getNextMessage = () => {
  document.dispatchEvent(new CustomEvent(nextMessageEvent))
}
