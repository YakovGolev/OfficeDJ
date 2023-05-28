/** Get Api key from storage. */
export const getApiKeyAsync = async (): Promise<string> => {
    return (await chrome.storage.local.get()).api_key as string
}

/** Set api key */
export const setApiKeyAsync = async (apiKey: string): Promise<void> => {
    return await chrome.storage.local.set( {api_key: apiKey })
}
