/** Inject Script in page */
export function injectScript() {
    const file_path = chrome.runtime.getURL('build/inject_content.bundle.js') 
    var node = document.querySelector('body')
    var script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', file_path)
    node?.appendChild(script)
}
