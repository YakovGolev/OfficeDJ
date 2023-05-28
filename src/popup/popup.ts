import { getApiKeyAsync, setApiKeyAsync } from "storage/api_key"

(async () => {
    const apiKeyInput = document.querySelector('.bot-api-key')! as HTMLInputElement

    const apikey = await getApiKeyAsync()
    
    if (apikey)
        apiKeyInput.value = apikey

    apiKeyInput.addEventListener('input', async (e) => {
        const val = (e.target as HTMLInputElement)?.value
        if (val)
            await setApiKeyAsync(val)
    })
})()
