import { sendMessageAsync } from "telegram/messages"
import { getTelegramSendMessageUrlAsync } from "telegram/pathes"
import { ITrackInfo } from "yandex_music/interfaces"

export enum ExternalAPI {
    Navigate = 'ExternalAPI_Navigate',
    RequestPlaylist = 'ExternalAPI_RequestPlaylist',
    SendPlaylist = 'ExternalAPI_SendPlaylist'
}

export const navigate = (trackUrl: URL) => document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, { detail: trackUrl.pathname }))
export const requestPlaylist = (chatId: number) => document.dispatchEvent(new CustomEvent(ExternalAPI.RequestPlaylist, { detail: chatId }))

export const addExternalApiListeners = () => {

    document.addEventListener(ExternalAPI.SendPlaylist, async e => {
        const { chatId, tracks } = (e as CustomEvent<{chatId: number, tracks: ITrackInfo[]}>).detail
        await sendMessageAsync(new URL(await getTelegramSendMessageUrlAsync()), chatId, buildTrackList(tracks))
    })
}

const buildTrackList = (tracks: ITrackInfo[]): string => tracks
        .map(t => `${t.artists[0].title} - ${t.title}`)
        .join('\n')
