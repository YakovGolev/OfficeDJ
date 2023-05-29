import { ExternalAPI } from "./actions_enum"

document.addEventListener(ExternalAPI.Navigate, e => {
    const event = e as CustomEvent<string>
    window?.externalAPI?.navigate(event.detail)
})

document.addEventListener(ExternalAPI.RequestPlaylist, e => {
    const event = e as CustomEvent<number>
    const tracks = window?.externalAPI?.getTracksList()
    const index = window?.externalAPI?.getTrackIndex()
    document.dispatchEvent(new CustomEvent(ExternalAPI.SendPlaylist, { detail: {
        chatId: event.detail,
        tracks: tracks,
        index: index
    }}))
})

document.addEventListener(ExternalAPI.TogglePlay, e => {
    let action = (e as CustomEvent<'PLAY' | 'PAUSE'>).detail
    const agr = action === 'PAUSE' ? action : ''
    window?.externalAPI?.togglePause(agr)
})

document.addEventListener(ExternalAPI.GetSourceInfo, e => {
    const sourceInfo = window?.externalAPI?.getSourceInfo()
    document.dispatchEvent(new CustomEvent(ExternalAPI.SourceInfo, { detail: sourceInfo }))
})

document.addEventListener(ExternalAPI.PlayLastTrack, async e => {
    const tracks = window?.externalAPI?.getTracksList()
    await window?.externalAPI?.play(tracks.length - 1)
})
