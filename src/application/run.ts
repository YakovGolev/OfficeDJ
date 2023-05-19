import { UpdateApiKeyAsync, sendMessageAsync } from "telegram/messaging"
import { setPageBlock } from "page_block/set_page_block"
import { injectScript } from "yandex_music/external_api/inject_script"
import { handleMessageAsync } from "./handle_message"
import { addExternalApiListeners } from "yandex_music/external_api/actions"
import { waitForAsyncCondition } from "utility"
import { GetApiKeyAsync } from "storage/get_api_key"
import { checkIsApiKeyAsync } from "telegram/api_key"
import { getUpdatesAsync } from "telegram/get_updates"

/** Run Application. */
export const runApplication = async () => {
  injectScript()
  await waitForAsyncCondition(async () => {
    const apiKey = await GetApiKeyAsync()
    return apiKey !== undefined && apiKey !== null && (await checkIsApiKeyAsync(apiKey))
  }, -1, 1000)
  setPageBlock()
  addExternalApiListeners()

  await UpdateApiKeyAsync()

  let lastOffset = 0
  let offsetChanged = false
  document.addEventListener(nextMessageEvent, async () => {
    let chatId: number | undefined

    try {
      const data = await getUpdatesAsync(offsetChanged, lastOffset)

      if (data.ok && data.result.length) {
        ({ chatId, lastOffset, offsetChanged } = await handleMessageAsync(data))
      }
      else {
        offsetChanged = false
      }
    } catch (error) {
      console.log(error)
      if (chatId)
        await sendMessageAsync(chatId, (error as Error)?.toString())
    }
    finally {
      getNextMessage()
    }
  })
  getNextMessage()
}

const nextMessageEvent = 'getNextMessage'

const getNextMessage = () => document.dispatchEvent(new CustomEvent(nextMessageEvent))
