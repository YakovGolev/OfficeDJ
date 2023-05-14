/** Get Api key from storage. */
export const GetApiKey = async () => {
    return (await chrome.storage.local.get()).api_key
}