/** Get last playlist drop date */
export const getLastPlaylistDropDateAsync = async (): Promise<string> => {
    return (await chrome.storage.local.get()).drop_date as string
}

/** Set last playlist drop date */
export const setLastPlaylistDropDateAsync = async (date: string): Promise<void> => {
    return await chrome.storage.local.set( { drop_date: date })
}
