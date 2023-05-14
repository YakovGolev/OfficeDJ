import { IInlineButton, getDataAsync, sendMessageAsync, sendTypingAction } from "./utility";
import { InjectContentPath, getTelegramSendMessageUrlAsync, getTelegramGetUpdatesUrlAsync } from "./constants";
import { ExternalAPI } from "./external_api";
import { injectScript } from "./inject";
import { ITelegramApiResponse } from "./telegram/interfaces";
import { setPageBlock } from "./page_block/setPageBlock";


const getNextMessage = () =>{
  document.dispatchEvent(new CustomEvent('getNextMessage'))
}

const tryGetTrack = (message: string): URL | undefined => {
  try {
    return new URL(message)
  } catch {
    return
  }
}

const buildTelegramUrl = async (offsetChanged: boolean, lastOffset: number) => {
  const url = new URL(await getTelegramGetUpdatesUrlAsync());
  if (offsetChanged)
    url.searchParams.append('offset', (lastOffset + 1).toString());
  if (!offsetChanged && lastOffset !== 0)
    url.searchParams.append('offset', lastOffset.toString());
  url.searchParams.append('timeout', '120');
  url.searchParams.append('limit', '1');

  return url;
}

(async function() {
  injectScript(chrome.runtime.getURL(InjectContentPath))
  setPageBlock()

  let lastOffset = 0
  let offsetChanged = false
  document.addEventListener('getNextMessage', async () => {
    let chatId = 0
    
    try {
      const url = await buildTelegramUrl(offsetChanged, lastOffset)
      const data = await getDataAsync<ITelegramApiResponse>(url)      
      
      if (data.ok && data.result.length){        
        const update = data.result[0]
        chatId = update.message?.chat.id ?? update.callback_query?.message.chat.id ?? 0
        await sendTypingAction(chatId)
        lastOffset = update.update_id
        offsetChanged = true
        const message = update.message?.text ?? `https://music.yandex.ru/${update.callback_query?.data}`
        const trackUrl = tryGetTrack(message)
        if (trackUrl) {
          await AddTrack(trackUrl, chatId)
        }
        else {
          await tryFindTrack(message, chatId)
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
})()

const contextMenuButtonSelector = '.sidebar-track .d-context-menu .d-button'
const addToQueueButtonSelector = '.d-context-menu__popup .d-context-menu__item_forth'
const buildSidebarSelector = (href: string) => `.sidebar-track .sidebar-track__title a[href="${href}"]`
const artistSelector = '.sidebar-track .sidebar__info .d-artists'

const AddTrack = async (trackUrl: URL, chatId: number): Promise<void> => {
  document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, {detail: trackUrl.pathname}))
  await waitForElementLoaded(buildSidebarSelector(trackUrl.pathname))
  ClickButton(contextMenuButtonSelector)
  await waitForElementLoaded(addToQueueButtonSelector)
  ClickButton(addToQueueButtonSelector)
  await sleep(1000)
  const trackName = (document.querySelector(buildSidebarSelector(trackUrl.pathname)) as HTMLElement)?.innerText
  const artistName = (document.querySelector(artistSelector) as HTMLElement)?.innerText
  const message = `Трек "${artistName} - ${trackName}" успешно добавлен в очередь воспроизведения`  
  await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, message)
}

const ClickButton = (selector: string): void => {
    (document.querySelector(selector) as HTMLElement)?.click()    
}

const sleep = async (timeout:number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const waitForElementLoaded = async (selector: string): Promise<void> => {
    await waitForCondition(() => document.querySelector(selector) !== null)
}

const waitForCondition = async (condition: () => boolean): Promise<void> => {
  const timeout: number = 100
  const maxRetryCount = 100
  let count = 1
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      count++
      if (condition()){
        clearInterval(interval)
        resolve()
      }
      if (count > maxRetryCount){
        clearInterval(interval)        
        reject(new Error('Превышено количество попыток выполнения действия'))
      }
    }, timeout)
  })
}

const tryFindTrack = async (query: string, chatId: number) => {
  const serachResult = await searchTrack(query)
  const message = getSearchResultMessage(serachResult)
  const buttons = getButtons(serachResult)
  await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, message, buttons)
}


const searchTrack = async (query: string): Promise<IMusicSerachResult> => {
    return await getDataAsync(new URL(`https://music.yandex.ru/handlers/music-search.jsx?text=${encodeURIComponent(query)}`))
}

function getButtons(searchResult: IMusicSerachResult): IInlineButton[][] {

  function getInlineButton(track: ITrackInfo): IInlineButton[]{
    return [{
      text: `${track.artists[0].name} - ${track.title}`,
      callback_data: `album/${track.albums[0].id}/track/${track.id}`
    }]
  }

  let result = searchResult.tracks.items.map(getInlineButton)
  if (result.length > 5)
    result = result.slice(0, 5);

  return result
}


function getSearchResultMessage(serachResult: IMusicSerachResult) {

  if (serachResult.tracks.items.length === 0)
    return `По запросу "${serachResult.text}" ничего не найдено`

  return `Вот какие треки удалось найти по запросу "${serachResult.text}"`
}

interface IMusicSerachResult {
  text: string,
  tracks: {
    items: ITrackInfo[]
  } 
}

interface ITrackInfo {
  title: string,
  artists: {
    name: string
  }[],
  albums: {
    id: number
  }[],
  id: number
}


