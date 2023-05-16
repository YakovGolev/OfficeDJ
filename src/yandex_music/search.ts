import { getDataAsync } from "requests"
import { sendMessageAsync } from "telegram/messages"
import { getTelegramSendMessageUrlAsync } from "telegram/pathes"
import { IInlineButton } from "telegram/interfaces"
import { IMusicSerachResult, ITrackInfo } from "yandex_music/interfaces"
import { buildSearchUrl } from "./pathes"

/** Search tracks and send result in reply. */
export const searchTracksAsync = async (query: string, chatId: number) => {
  const serachResult = await sendSearchTrackRequestAsync(query)
  const message = getSearchResultMessage(serachResult)
  const buttons = getButtons(serachResult)

  await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, message, buttons)
}

const sendSearchTrackRequestAsync = async (query: string): Promise<IMusicSerachResult> => {
  return await getDataAsync(buildSearchUrl(query))
}

const getButtons = (searchResult: IMusicSerachResult): IInlineButton[][] => {

  const getInlineButton = (track: ITrackInfo): IInlineButton[] => {
    return [{
      text: `${track.artists[0].name} - ${track.title}`,
      callback_data: `album/${track.albums[0].id}/track/${track.id}`
    }]
  }

  let result = searchResult.tracks.items.map(getInlineButton)
  if (result.length > 5)
    result = result.slice(0, 5)

  return result
}

const getSearchResultMessage = (serachResult: IMusicSerachResult) => {
  if (serachResult.tracks.items.length === 0)
    return `По запросу "${serachResult.text}" ничего не найдено`

  return `Вот какие треки удалось найти по запросу "${serachResult.text}"`
}
