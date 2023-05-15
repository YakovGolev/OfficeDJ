/** Get Api key from storage. */
export const GetApiKeyAsync = async () => {
    return (await chrome.storage.local.get()).api_key
}