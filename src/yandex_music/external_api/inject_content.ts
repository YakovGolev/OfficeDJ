import { extensionPlaylist } from "yandex_music/playlist_name"
import { ExternalAPI } from "./actions_enum"

document.addEventListener(ExternalAPI.Navigate, e => {
    const event = e as CustomEvent<string>
    window?.externalAPI?.navigate(event.detail)
})

document.addEventListener(ExternalAPI.RequestPlaylist, e => {
    const event = e as CustomEvent<number>
    const tracks = window?.externalAPI?.getTracksList()
    document.dispatchEvent(new CustomEvent(ExternalAPI.SendPlaylist, { detail: {
        chatId: event.detail,
        tracks: tracks
    }}))
})

document.addEventListener(ExternalAPI.TogglePlay, e => {
    let action = (e as CustomEvent<'PLAY' | 'PAUSE'>).detail
    const agr = action === 'PAUSE' ? action : ''
    window?.externalAPI?.togglePause(agr)
})

window?.externalAPI?.on('state', () => {
    const source = window?.externalAPI?.getSourceInfo()?.title as string
    if (source !== extensionPlaylist){
        document.dispatchEvent(new CustomEvent(ExternalAPI.SourceChanged))
    }
})
