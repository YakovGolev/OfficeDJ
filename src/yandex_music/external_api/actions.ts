import { sendMessageAsync } from "telegram/messaging"
import { IGetTrackListDetails, ITrackInfo } from "yandex_music/interfaces"
import { ExternalAPI } from "./actions_enum"
import { getAppStatus, setAppStatusAsync } from "storage/app_status"
import { clickButton, sleep, waitForAsyncCondition, waitForElementLoaded } from "utility"
import { navigateToPlaylistAsync } from "yandex_music/page_interaction/actions"
import { extensionPlaylist } from "yandex_music/playlist_name"

export const navigate = (trackUrl: URL) => document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, { detail: trackUrl.pathname }))
export const requestPlaylist = (chatId: number) => document.dispatchEvent(new CustomEvent(ExternalAPI.RequestPlaylist, { detail: chatId }))

const playlistPlaybuttonSelector = '.page-playlist__head .button-play'
export const addExternalApiListeners = () => {

    document.addEventListener(ExternalAPI.SendPlaylist, async e => {
        const detail = (e as CustomEvent<IGetTrackListDetails>).detail
        await sendMessageAsync(detail.chatId, buildTrackList(detail.tracks, detail.current), undefined, true)
    })

    document.addEventListener(ExternalAPI.SourceInfo, async e => {
        const detail = (e as CustomEvent<{ title: string }>).detail
        if (detail.title === extensionPlaylist)
            return
        await waitForAsyncCondition(async () => (await getAppStatus()) === 'waiting')
        await setAppStatusAsync('processing')
        await navigateToPlaylistAsync()
        await waitForElementLoaded(playlistPlaybuttonSelector)
        clickButton(playlistPlaybuttonSelector)        
        document.dispatchEvent(new CustomEvent(ExternalAPI.TogglePlay, { detail : 'PAUSE' }))
        await sleep(3000)
        document.dispatchEvent(new CustomEvent(ExternalAPI.PlayLastTrack))
        await setAppStatusAsync('waiting')  
    })
}

const buildTrackList = (tracks: ITrackInfo[], current: ITrackInfo): string => tracks
        .filter(t => t !== null)
        .map(t => {
            let result = `${t.artists[0].title} - ${t.title}`
            if (t.link === current.link)
                result = `<code>${new Array(result.length + 2).fill('=').join('')}\n ${result}\n${new Array(result.length + 2).fill('=').join('')}</code>`
            return result
        })
        .join('\n')
