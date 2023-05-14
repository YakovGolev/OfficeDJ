import './style.css'

/** Add blocking page element */
export function setPageBlock() {
  var body = document.querySelector('body')!;
  var block = document.createElement('div');
  block.style.width = '100%';
  block.style.height = '100%';
  block.style.position = 'absolute';
  block.style.zIndex = '1000000000';
  block.style.top = '0';
  block.style.left = '0';
  block.style.backgroundColor = '#FFFFFF33';
  block.innerHTML = '<div class="page-block">Этой вкладкой управляет расширение Office DJ</div>';
  body.setAttribute('style', 'overflow: hidden !important');

  body.appendChild(block);
}
