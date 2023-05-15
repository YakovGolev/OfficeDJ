const yandexMusicSearchPath = 'https://music.yandex.ru/handlers/music-search.jsx'

/** Build search request url. */
export const buildSearchUrl = (query: string) => {
    const url = new URL(yandexMusicSearchPath)
    url.searchParams.append('text', encodeURIComponent(query))

    return url
}