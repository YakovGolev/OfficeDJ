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
  artists: {
    name: string
  }[]
  albums: {
    id: number
  }[]
  id: number
}
