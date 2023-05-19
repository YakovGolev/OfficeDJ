import { sendMessageAsync } from "telegram/messaging"
import { ITrackInfo } from "yandex_music/interfaces"
import { ExternalAPI } from "./actions_enum"

export const navigate = (trackUrl: URL) => document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, { detail: trackUrl.pathname }))
export const requestPlaylist = (chatId: number) => document.dispatchEvent(new CustomEvent(ExternalAPI.RequestPlaylist, { detail: chatId }))

export const addExternalApiListeners = () => {

    document.addEventListener(ExternalAPI.SendPlaylist, async e => {
        const { chatId, tracks } = (e as CustomEvent<{chatId: number, tracks: ITrackInfo[]}>).detail
        await sendMessageAsync(chatId, buildTrackList(tracks))
    })
}

const buildTrackList = (tracks: ITrackInfo[]): string => tracks
        .filter(t => t !== null)
        .map(t => `${t.artists[0].title} - ${t.title}`)
        .join('\n')
