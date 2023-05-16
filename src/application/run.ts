import { getDataAsync } from "requests"
import { sendMessageAsync } from "telegram/messages"
import { getTelegramSendMessageUrlAsync, getTelegramGetUpdatesUrlAsync, buildTelegramUrl } from "telegram/pathes"
import { ITelegramApiResponse } from "telegram/interfaces"
import { setPageBlock } from "page_block/setPageBlock"
import { injectScript } from "yandex_music/external_api/inject_script"
import { handleMessageAsync } from "./handle_message"
import { addExternalApiListeners } from "yandex_music/external_api/actions"

/** Run Application. */
export const runApplication = async () => {
  injectScript()
  setPageBlock()
  addExternalApiListeners()

  let lastOffset = 0
  let offsetChanged = false
  document.addEventListener(nextMessageEvent, async () => {
    let chatId: number | undefined

    try {
      const url = await buildTelegramUrl(await getTelegramGetUpdatesUrlAsync(), offsetChanged, lastOffset)
      const data = await getDataAsync<ITelegramApiResponse>(url)

      if (data.ok && data.result.length) {
        ({ chatId, lastOffset, offsetChanged } = await handleMessageAsync(data))
      }
      else {
        offsetChanged = false
      }
    } catch (error) {
      console.log(error)
      if (chatId)
        await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, (error as Error)?.toString())
    }
    finally {
      getNextMessage()
    }
  })
  getNextMessage()
}

const nextMessageEvent = 'getNextMessage'

const getNextMessage = () => document.dispatchEvent(new CustomEvent(nextMessageEvent))
