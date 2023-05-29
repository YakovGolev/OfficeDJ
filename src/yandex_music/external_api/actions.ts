import { sendMessageAsync } from "telegram/messaging"
import { IGetTrackListDetails, ITrackInfo } from "yandex_music/interfaces"
import { ExternalAPI } from "./actions_enum"
import { getAppStatus, setAppStatusAsync } from "storage/app_status"
import { clickButton, sleep, waitForAsyncCondition, waitForElementLoaded } from "utility"
import { navigateToPlaylistAsync } from "yandex_music/page_interaction/actions"
import { extensionPlaylist } from "yandex_music/playlist_name"
import { playlistPlaybuttonSelector } from "yandex_music/page_interaction/selectors"

export const navigate = (trackUrl: URL) => document.dispatchEvent(new CustomEvent(ExternalAPI.Navigate, { detail: trackUrl.pathname }))
export const requestPlaylist = (chatId: number) => document.dispatchEvent(new CustomEvent(ExternalAPI.RequestPlaylist, { detail: chatId }))


export const addExternalApiListeners = () => {

    document.addEventListener(ExternalAPI.SendPlaylist, async e => {
        const detail = (e as CustomEvent<IGetTrackListDetails>).detail
        await sendMessageAsync(detail.chatId, buildTrackList(detail.tracks, detail.index), undefined, true)
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

interface ITackWithIndex {
    track: ITrackInfo
    index: number
}
const maxTrackListSize = 10

const buildTrackList = (tracks: ITrackInfo[], currentTrackIndex: number): string => tracks
        .map((t, i) : ITackWithIndex => {
            return {
                track: t,
                index: i
            }
        })
        .filter(t => t.track !== null)
        .filter(t => t.index > Math.min(tracks.length - maxTrackListSize, currentTrackIndex - 2))
        .map(t => {
            const track = t.track
            let result = `${track.artists[0].title} - ${track.title}`
            if (t.index < currentTrackIndex){
                result = `<s>${result}</s>`
            }
            if (t.index === currentTrackIndex){
                const frame = new Array(Math.max(30, result.length + 2)).fill('=').join('')
                result = `<code>${frame}\n ${result}\n${frame}</code>`
            }

            return result
        })
        .join('\n')
