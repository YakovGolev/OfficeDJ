document.addEventListener('ExternalAPI_Navigate', e => {
    const event = e as CustomEvent<string>
    window?.externalAPI?.navigate(event.detail)
})
