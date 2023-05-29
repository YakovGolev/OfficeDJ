/** Yandex music serach request result. */
export interface IMusicSerachResult {
  text: string
  tracks: {
    items: ITrackInfo[]
  }
}

/** Yandex music track object. */
export interface ITrackInfo {
  title: string
  link: string
  artists: {
    name: string
    title: string
  }[]
  albums: {
    id: number
  }[]
  id: number
}

/** Details provided with SendPlaylist event */
export interface IGetTrackListDetails {
  chatId: number
  tracks: ITrackInfo[]
  index: number
}
