/** Get Api key from storage. */
export const GetApiKeyAsync = async (): Promise<string> => {
    return (await chrome.storage.local.get()).api_key as string
}