import { sendMessageAsync } from "telegram/messaging"
import { getTelegramSendMessageUrl } from "telegram/pathes"
import { navigate } from "yandex_music/external_api/actions"
import { buildSidebarSelector, contextMenuButtonSelector, addToQueueButtonSelector, artistSelector } from "./selectors"
import { waitForElementLoaded, clickButton, sleep } from "utility"
import { GetApiKeyAsync } from "storage/get_api_key"

const extensionPlaylist = 'Office DJ'

/** Add track to extension playlist. */
export const addTrackAsync = async (trackUrl: URL, chatId: number): Promise<void> => {
  navigate(trackUrl)
  await waitForElementLoaded(buildSidebarSelector(trackUrl.pathname))
  clickButton(contextMenuButtonSelector)
  await waitForElementLoaded(addToQueueButtonSelector)
  clickButton(addToQueueButtonSelector)
  await sleep(300)
  const trackName = (document.querySelector(buildSidebarSelector(trackUrl.pathname)) as HTMLElement)?.innerText
  const artistName = (document.querySelector(artistSelector) as HTMLElement)?.innerText
  const message = `Трек "${artistName} - ${trackName}" успешно добавлен в очередь воспроизведения`
  const apiKey = await GetApiKeyAsync()
  await sendMessageAsync(getTelegramSendMessageUrl(apiKey), chatId, message)
}


