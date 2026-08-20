export function getSFSymbolImg(symbolName, { isDark = false, size = 16, className = '', title = '' } = {}) {
  const folder = isDark ? 'dark' : 'white';
  const img = document.createElement('img');
  img.src = `assets/icons/sf-symbols/${folder}/${symbolName}.png`;
  img.alt = title || symbolName;
  img.className = `sf-symbol ${className}`.trim();
  img.style.cssText = `width:${size}px;height:${size}px;object-fit:contain;vertical-align:middle;display:inline-block;`;
  img.draggable = false;
  return img;
}

export function getSFSymbolHtml(symbolName, { isDark = false, size = 16, className = '', style = '' } = {}) {
  const folder = isDark ? 'dark' : 'white';
  return `<img src="assets/icons/sf-symbols/${folder}/${symbolName}.png" alt="${symbolName}" class="sf-symbol ${className}" style="width:${size}px;height:${size}px;object-fit:contain;vertical-align:middle;display:inline-block;${style}" draggable="false" />`;
}
