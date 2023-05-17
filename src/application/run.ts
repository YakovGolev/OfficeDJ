import { getDataAsync } from "requests"
import { sendMessageAsync } from "telegram/messaging"
import { getTelegramGetUpdatesUrl, buildTelegramUrl, getTelegramSendMessageUrl } from "telegram/pathes"
import { ITelegramApiResponse } from "telegram/interfaces"
import { setPageBlock } from "page_block/setPageBlock"
import { injectScript } from "yandex_music/external_api/inject_script"
import { handleMessageAsync } from "./handle_message"
import { addExternalApiListeners } from "yandex_music/external_api/actions"
import { waitForAsyncCondition } from "utility"
import { GetApiKeyAsync } from "storage/get_api_key"
import { checkIsApiKeyAsync } from "telegram/api_key"

/** Run Application. */
export const runApplication = async () => {
  injectScript()
  await waitForAsyncCondition(async () => {
    const apiKey = await GetApiKeyAsync()
    return apiKey !== undefined && apiKey !== null && (await checkIsApiKeyAsync(apiKey))
  }, -1, 1000)
  setPageBlock()
  addExternalApiListeners()

  const apiKey = await GetApiKeyAsync()

  let lastOffset = 0
  let offsetChanged = false
  document.addEventListener(nextMessageEvent, async () => {
    let chatId: number | undefined

    try {
      const url = buildTelegramUrl(getTelegramGetUpdatesUrl(apiKey), offsetChanged, lastOffset)
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
        await sendMessageAsync(getTelegramSendMessageUrl(apiKey), chatId, (error as Error)?.toString())
    }
    finally {
      getNextMessage()
    }
  })
  getNextMessage()
}

const nextMessageEvent = 'getNextMessage'

const getNextMessage = () => document.dispatchEvent(new CustomEvent(nextMessageEvent))
