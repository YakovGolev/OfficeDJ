/** Get Api key from storage. */
export const getApiKeyAsync = async (): Promise<string> => {
    return (await chrome.storage.local.get()).api_key as string
}

/** Get app current status */
export const getAppStatus = async (): Promise<string> => {
    return (await chrome.storage.local.get()).status as 'waiting' | 'processing'
}

/** Set app status */
export const setAppStatus = async (status: 'waiting' | 'processing'): Promise<void> => {
    return await chrome.storage.local.set({ status: status })
}