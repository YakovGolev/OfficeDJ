/** Inject Script in page */
export function injectScript(file_path: string) {
    var node = document.querySelector('body')
    var script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', file_path)
    node?.appendChild(script)
}
