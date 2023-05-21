export const contextMenuButtonSelector = '.sidebar-track .d-context-menu .d-button'
export const addToPlaylistButtonSelector = '.d-context-menu__popup .d-context-menu__item_add'
export const listOfPlaylistsSelector = '.d-context-menu__popup .d-addition__playlists'
export const artistSelector = '.sidebar-track .sidebar__info .d-artists'
export const createPlaylistInputSelector = '.d-context-menu__popup .d-addition__actions-visible input'

export const buildSidebarSelector = (href: string) => `.sidebar-track .sidebar-track__title a[href="${href}"]`
