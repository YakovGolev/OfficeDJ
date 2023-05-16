import { ExternalAPI } from "./actions"

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
