import { sendMessageAsync } from "telegram/messaging"
import { ITrackInfo } from "yandex_music/interfaces"
import { ExternalAPI } from "./actions_enum"
import { getAppStatus, setAppStatus } from "storage/get_api_key"
import { clickButton, waitForAsyncCondition, waitForElementLoaded } from "utility"
import { navigateToPlaylistAsync } from "yandex_music/page_interaction/actions"

export const navigate = (trackUrl: URL) => document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, { detail: trackUrl.pathname }))
export const requestPlaylist = (chatId: number) => document.dispatchEvent(new CustomEvent(ExternalAPI.RequestPlaylist, { detail: chatId }))

const playlistPlaybuttonSelector = '.page-playlist__head .button-play'
export const addExternalApiListeners = () => {

    document.addEventListener(ExternalAPI.SendPlaylist, async e => {
        const { chatId, tracks } = (e as CustomEvent<{chatId: number, tracks: ITrackInfo[]}>).detail
        await sendMessageAsync(chatId, buildTrackList(tracks))
    })

    document.addEventListener(ExternalAPI.SourceChanged, async () => {
        await waitForAsyncCondition(async () => (await getAppStatus()) === 'waiting')
        await setAppStatus('processing')
        await navigateToPlaylistAsync()
        await waitForElementLoaded(playlistPlaybuttonSelector)
        clickButton(playlistPlaybuttonSelector)
        await setAppStatus('waiting')
    })
}

const buildTrackList = (tracks: ITrackInfo[]): string => tracks
        .filter(t => t !== null)
        .map(t => `${t.artists[0].title} - ${t.title}`)
        .join('\n')
