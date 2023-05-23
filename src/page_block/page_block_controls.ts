import { ExternalAPI } from "yandex_music/external_api/actions_enum"

export const initPlayButton = () => {
    const button = document.querySelector('.play-button') as HTMLElement

    button.addEventListener('click', e => {
        const action = getAction()
        button.classList.toggle('active')
        document.dispatchEvent(new CustomEvent(ExternalAPI.TogglePlay, { detail : action }))
    })

    const getAction = () => button.classList.contains('active') ? 'PAUSE' : 'PLAY'
}
