import { sendMessageAsync } from "telegram/messaging"
import { navigate } from "yandex_music/external_api/actions"
import { buildSidebarSelector, contextMenuButtonSelector, addToPlaylistButtonSelector, artistSelector, listOfPlaylistsSelector, createPlaylistInputSelector, addToQueueButtonSelector, playlistPlaybuttonSelector, playlistContextButtonselector, playlistDeleteButtonSelector, confirmDeleteButtonSelector } from "./selectors"
import { waitForElementLoaded, clickButton, sleep, dateToString } from "utility"
import { extensionPlaylist } from "yandex_music/playlist_name"
import { ExternalAPI } from "yandex_music/external_api/actions_enum"
import { getLastPlaylistDropDateAsync, setLastPlaylistDropDateAsync } from "storage/last_drop_date"

let playlistsUrl : URL | null, extensionPlaylistUrl : URL | null

const updatePlaylistsLink = () => {
  const link = (document.querySelector('a[data-name=my]') as HTMLAnchorElement).href
  if (link)
    playlistsUrl = new URL(link)
}

/** Add track to extension playlist. */
export const addTrackAsync = async (trackUrl: URL, chatId: number): Promise<void> => {
  navigate(trackUrl)
  await sleep(300)
  if (document.querySelector('.page-404')){
    await sendMessageAsync(chatId, 'Не удалось добавить трек, возможно он удален')
    return
  }

  const dropDate = await getLastPlaylistDropDateAsync()
  if (!dropDate || dropDate < dateToString(new Date())) {
    await dropPlaylistAsync()
  }
    
  await waitForElementLoaded(buildSidebarSelector(trackUrl.pathname))
  clickButton(contextMenuButtonSelector)
  await waitForElementLoaded(addToQueueButtonSelector)
  clickButton(addToQueueButtonSelector)
  await sleep(300)
  clickButton(contextMenuButtonSelector)
  await waitForElementLoaded(addToPlaylistButtonSelector)
  clickButton(addToPlaylistButtonSelector)
  await waitForElementLoaded(listOfPlaylistsSelector)
  const extensionPlaylistElement = getPlaylist()
  extensionPlaylistElement?.click()
  if (!extensionPlaylistElement) {
    const input = document.querySelector(createPlaylistInputSelector) as HTMLInputElement
    input.value = extensionPlaylist
    const keyboardEvent = new KeyboardEvent('keyup', {
      code: 'Enter',
      key: 'Enter',
      charCode: 13,
      keyCode: 13,
      view: window,
      bubbles: true
    })
    input.dispatchEvent(keyboardEvent)
  }
  await sleep(300)
  const trackName = (document.querySelector(buildSidebarSelector(trackUrl.pathname)) as HTMLElement)?.innerText
  const artistName = (document.querySelector(artistSelector) as HTMLElement)?.innerText
  const message = `Трек "${artistName} - ${trackName}" успешно добавлен в очередь воспроизведения`
  await sendMessageAsync(chatId, message)
  await navigateToPlaylistAsync()
  document.dispatchEvent(new CustomEvent(ExternalAPI.GetSourceInfo))
}

const getPlaylist = () => {
  const playlistElement = document.querySelector(listOfPlaylistsSelector)?.querySelector(`span[title="${extensionPlaylist}"]`)
  if (playlistElement)
    return playlistElement.parentElement

  return null
}

export const navigateToPlaylistAsync = async () => {
  if (!extensionPlaylistUrl){
    if (!playlistsUrl)
      updatePlaylistsLink()
    navigate(playlistsUrl!)
    const playlistSelector = `div[title="${extensionPlaylist}"] a`
    await waitForElementLoaded(playlistSelector)
    const link = (document.querySelector(playlistSelector) as HTMLAnchorElement)?.href
    if (link)
      extensionPlaylistUrl = new URL(link)
  }
  if (extensionPlaylistUrl)
    navigate(extensionPlaylistUrl)
}

const dropPlaylistAsync = async () => {
  const today = dateToString(new Date())
  await setLastPlaylistDropDateAsync(today)
  if (!extensionPlaylistUrl)
    return
  await navigateToPlaylistAsync()
  await waitForElementLoaded(playlistPlaybuttonSelector)
  clickButton(playlistContextButtonselector)
  await waitForElementLoaded(playlistDeleteButtonSelector)
  clickButton(playlistDeleteButtonSelector)
  await waitForElementLoaded(confirmDeleteButtonSelector)
  clickButton(confirmDeleteButtonSelector)
  playlistsUrl = null
  extensionPlaylistUrl = null
}
