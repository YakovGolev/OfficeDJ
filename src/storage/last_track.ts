import { ITrackInfo } from "yandex_music/interfaces"

/** Get last track */
export const getLastTrackAsync = async (): Promise<ITrackInfo> => {
    return (await chrome.storage.local.get()).last_track as ITrackInfo
}

/** Set last track */
export const setLastTrackAsync = async (track: ITrackInfo): Promise<void> => {
    return await chrome.storage.local.set( { last_track: track })
}
