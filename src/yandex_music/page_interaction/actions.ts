import { sendMessageAsync } from "telegram/messages"
import { getTelegramSendMessageUrlAsync } from "telegram/pathes"
import { ExternalAPI } from "yandex_music/external_api/actions"
import { buildSidebarSelector, contextMenuButtonSelector, addToQueueButtonSelector, artistSelector } from "./selectors"
import { waitForElementLoaded, clickButton, sleep } from "utility"

/** Add track to extension playlist. */
export const addTrack = async (trackUrl: URL, chatId: number): Promise<void> => {
  document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, { detail: trackUrl.pathname }))
  await waitForElementLoaded(buildSidebarSelector(trackUrl.pathname))
  clickButton(contextMenuButtonSelector)
  await waitForElementLoaded(addToQueueButtonSelector)
  clickButton(addToQueueButtonSelector)
  await sleep(300)
  const trackName = (document.querySelector(buildSidebarSelector(trackUrl.pathname)) as HTMLElement)?.innerText
  const artistName = (document.querySelector(artistSelector) as HTMLElement)?.innerText
  const message = `Трек "${artistName} - ${trackName}" успешно добавлен в очередь воспроизведения`
  await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, message)
}
