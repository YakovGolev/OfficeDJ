import './style.css'
import pageBlockTemplate from './page_block.html'

/** Add blocking page element */
export function setPageBlock() {
  var body = document.querySelector('body')!
  var block = document.createElement('div') as HTMLElement
  block.classList.add('block-frame')
  block.innerHTML = pageBlockTemplate
  body.setAttribute('style', 'overflow: hidden !important')

  body.appendChild(block)
}
