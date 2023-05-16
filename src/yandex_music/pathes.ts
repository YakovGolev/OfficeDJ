const yandexMusicUrl = 'https://music.yandex.ru'
const yandexMusicSearchPath = `${yandexMusicUrl}/handlers/music-search.jsx`

export const buildTrackPath = (path?: string): string => path ? `${yandexMusicUrl}/${path}` : ''

/** Build search request url. */
export const buildSearchUrl = (query: string) => {
    const url = new URL(yandexMusicSearchPath)
    url.searchParams.append('text', encodeURIComponent(query))

    return url
}