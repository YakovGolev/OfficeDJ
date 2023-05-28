import { UpdateApiKeyAsync, sendMessageAsync } from "telegram/messaging"
import { setPageBlock } from "page_block/set_page_block"
import { injectScript } from "yandex_music/external_api/inject_script"
import { handleMessageAsync } from "./handle_message"
import { addExternalApiListeners } from "yandex_music/external_api/actions"
import { waitForAsyncCondition } from "utility"
import { getApiKeyAsync } from "storage/api_key"
import { getAppStatus, setAppStatusAsync } from "storage/app_status"
import { checkIsApiKeyAsync } from "telegram/api_key"
import { getUpdatesAsync } from "telegram/get_updates"
import { initPlayButton } from "page_block/page_block_controls"

/** Run Application. */
export const runApplication = async () => {
  injectScript()
  await waitForAsyncCondition(async () => {
    const apiKey = await getApiKeyAsync()
    return apiKey !== undefined && apiKey !== null && (await checkIsApiKeyAsync(apiKey))
  }, -1, 1000)
  setPageBlock()
  addExternalApiListeners()

  await UpdateApiKeyAsync()

  initPlayButton()
  await setAppStatusAsync('waiting')

  let lastOffset = 0
  let offsetChanged = false
  document.addEventListener(nextMessageEvent, async () => {
    let chatId: number | undefined

    try {
      const data = await getUpdatesAsync(offsetChanged, lastOffset)
      await waitForAsyncCondition(async () => (await getAppStatus()) === 'waiting')

      if (data.ok && data.result.length) {
        await setAppStatusAsync('processing');

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
      await getNextMessage()
    }
  })
  await getNextMessage()
}

const nextMessageEvent = 'getNextMessage'

const getNextMessage = async () =>{
  await setAppStatusAsync('waiting')
  document.dispatchEvent(new CustomEvent(nextMessageEvent))
} 
