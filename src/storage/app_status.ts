/** Get app current status */
export const getAppStatus = async (): Promise<string> => {
    return (await chrome.storage.local.get()).status as 'waiting' | 'processing'
}

/** Set app status */
export const setAppStatusAsync = async (status: 'waiting' | 'processing'): Promise<void> => {
    return await chrome.storage.local.set({ status: status })
}
