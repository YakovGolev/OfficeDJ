export const contextMenuButtonSelector = '.sidebar-track .d-context-menu .d-button'
export const addToQueueButtonSelector = '.d-context-menu__popup .d-context-menu__item_forth'
export const addToPlaylistButtonSelector = '.d-context-menu__popup .d-context-menu__item_add'
export const listOfPlaylistsSelector = '.d-context-menu__popup .d-addition__playlists'
export const artistSelector = '.sidebar-track .sidebar__info .d-artists'
export const createPlaylistInputSelector = '.d-context-menu__popup .d-addition__actions-visible input'
export const playlistPlaybuttonSelector = '.page-playlist__head .button-play'
export const playlistContextButtonselector = '.page-playlist__head .d-context-menu .d-button'
export const playlistDeleteButtonSelector = '.d-context-menu__popup .d-context-menu__item_delete'
export const confirmDeleteButtonSelector = '.d-context-menu__popup + .d-tooltip .d-tooltip__actions .d-tooltip__btn-agree'

export const buildSidebarSelector = (href: string) => `.sidebar-track .sidebar-track__title a[href="${href}"]`
