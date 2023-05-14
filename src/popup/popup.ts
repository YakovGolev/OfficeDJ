(async () => {
    const apiKeyInput = document.querySelector('.bot-api-key')! as HTMLInputElement

    const apikey = (await chrome.storage.local.get())['api_key']
    
    if (apikey)
        apiKeyInput.value = apikey

    apiKeyInput.addEventListener('input', e => {
        const val = (e.target as HTMLInputElement)?.value
        if (val)
            chrome.storage.local.set({
                api_key: val
            }) 
    })
})()
