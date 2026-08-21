import { WindowManager } from '../windowManager.js';
import { getSFSymbolHtml } from '../sfSymbols.js';
import { showNotification } from '../notificationManager.js';
import { showMacAlert } from '../macDialog.js';

const FILE_TREE = {
  '~': {
    type: 'folder',
    children: {
      'Documentos': {
        type: 'folder',
        children: {
          'Currículo.pdf': { type: 'file', size: '353 KB', ext: 'pdf', url: 'assets/docs/mateus-desenvolvedor-fullstack.pdf' }
        }
      },
      'Downloads':  { type: 'folder', children: { 'macOS-Sequoia.dmg': { type: 'file', size: '5.4 GB', ext: 'dmg' } } },
      'Filmes':     { type: 'folder', children: {} },
      'Imagens':    {
        type: 'folder',
        children: {
          'Captura de Tela 2026-05-05 às 18.38.12.jpeg': { type: 'file', size: '33 KB', ext: 'jpeg', url: 'assets/images/user_photos/Captura de Tela 2026-05-05 às 18.38.12.jpeg' },
          'Captura de Tela 2026-05-08 às 02.39.45.jpeg': { type: 'file', size: '172 KB', ext: 'jpeg', url: 'assets/images/user_photos/Captura de Tela 2026-05-08 às 02.39.45.jpeg' },
          'Captura de Tela 2026-05-08 às 20.26.10.jpeg': { type: 'file', size: '224 KB', ext: 'jpeg', url: 'assets/images/user_photos/Captura de Tela 2026-05-08 às 20.26.10.jpeg' },
          'wallpaper.jpg': { type: 'file', size: '1.2 MB', ext: 'jpg' }
        }
      },
      'Mesa':       {
        type: 'folder',
        children: {
          'Currículo.pdf': { type: 'file', size: '353 KB', ext: 'pdf', url: 'assets/docs/mateus-desenvolvedor-fullstack.pdf', id: 'curriculo-pdf' }
        }
      },
      'Música':     { type: 'folder', children: {} },
      'Pública':    { type: 'folder', children: {} },
      'Developer':  {
        type: 'folder',
        children: {
          'archive':  { type: 'folder', children: {} },
          'learning': { type: 'folder', children: {} },
          'projects': { type: 'folder', children: {} },
          'sandbox':  { type: 'folder', children: {} },
          'setup':    { type: 'folder', children: {} },
          'temp':     { type: 'folder', children: {} },
          'work':     { type: 'folder', children: {} },
        }
      },
      'Aplicativos': {
        type: 'folder',
        children: {
          'Finder.app':   { type: 'app', size: '15 MB', ext: 'app', appKey: 'finder' },
          'Terminal.app': { type: 'app', size: '8 MB',  ext: 'app', appKey: 'terminal' },
          'Safari.app':   { type: 'app', size: '50 MB', ext: 'app', appKey: 'safari' },
          'Ajustes.app':  { type: 'app', size: '12 MB', ext: 'app', appKey: 'settings' },
          'Portfolio.app':{ type: 'app', size: '25 MB', ext: 'app', appKey: 'safari', portfolioSection: 'all' },
        }
      },
    }
  }
};

function getIconHtml(name, item, size = 72) {
  if (item.type === 'folder') {
    if (name === 'Documentos')  return `<img src="assets/icons/folders/documents-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Downloads')   return `<img src="assets/icons/folders/downloads-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Música')      return `<img src="assets/icons/folders/music-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Mesa')        return `<img src="assets/icons/folders/desktop-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Aplicativos') return `<img src="assets/icons/folders/applications-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Imagens')     return `<img src="assets/icons/folders/imagens-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Lixo')        return `<img src="assets/icons/dock/empty-bin.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Filmes' || name === 'Movies')  return `<img src="assets/icons/folders/films-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Pública' || name === 'Public') return `<img src="assets/icons/folders/public-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name === 'Developer' || name === 'Projetos') return `<img src="assets/icons/folders/developer-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    return `<img src="assets/icons/folders/default-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
  }

  if (item.ext === 'pdf') {
    return `<img src="assets/icons/documents/pdf-document.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
  }

  if (item.type === 'app') {
    if (name.includes('Finder')   || item.appKey === 'finder')   return `<img src="assets/icons/dock/finder.png"   alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name.includes('Safari')   || item.appKey === 'safari')   return `<img src="assets/icons/dock/safari.png"   alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name.includes('Terminal') || item.appKey === 'terminal') return `<img src="assets/icons/dock/terminal.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name.includes('Settings') || name.includes('Ajustes') || item.appKey === 'settings') return `<img src="assets/icons/dock/settings.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    return getSFSymbolHtml('app', { size });
  }

  if (['png', 'jpg', 'jpeg', 'webp'].includes(item.ext)) {
    if (item.url) {
      return `<img src="${item.url}" alt="${name}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:6px;box-shadow:0 3px 8px rgba(0,0,0,0.4);border:0.5px solid rgba(255,255,255,0.15);" draggable="false" />`;
    }
    return getSFSymbolHtml('photo', { size });
  }
  if (['mp3', 'm3u'].includes(item.ext))                  return getSFSymbolHtml('music.note', { size });
  if (['zip', 'dmg'].includes(item.ext))                  return getSFSymbolHtml('archivebox', { size });

  return getSFSymbolHtml('doc.text', { size });
}

export const TRASH_ITEMS = {};

function dispatchTrashUpdate() {
  const hasItems = Object.keys(TRASH_ITEMS).length > 0;
  window.dispatchEvent(new CustomEvent('trash:updated', { detail: { hasItems } }));
}

function dispatchMesaUpdate() {
  window.dispatchEvent(new CustomEvent('mesa:updated'));
}

export function getMesaItems() {
  return FILE_TREE['~']['Mesa']?.children || {};
}

export function moveToTrash(name, item, originPath = ['~']) {
  const node = resolvePath(originPath);
  if (node?.children?.[name]) {
    delete node.children[name];
  }
  TRASH_ITEMS[name] = { ...item, originPath: [...originPath], trashedAt: Date.now() };
  dispatchTrashUpdate();
  dispatchMesaUpdate();
  showNotification({
    title: 'Lixo',
    desc: `"${name}" movido para o Lixo.`,
    icon: 'assets/icons/dock/empty-bin.png',
    duration: 3000
  });
}

export function restoreFromTrash(name) {
  const item = TRASH_ITEMS[name];
  if (!item) return;

  const originPath = (item.originPath && item.originPath.length > 0 && item.originPath[0] !== 'desktop')
    ? item.originPath
    : ['~', 'Mesa'];

  const node = resolvePath(originPath) || FILE_TREE['~']['Mesa'];
  if (node && node.children) {
    const { originPath: _, trashedAt: __, ...cleanItem } = item;
    node.children[name] = cleanItem;
  }

  delete TRASH_ITEMS[name];
  dispatchTrashUpdate();
  dispatchMesaUpdate();
  showNotification({
    title: 'Lixo',
    desc: `"${name}" colocado de volta.`,
    icon: 'assets/icons/dock/empty-bin.png',
    duration: 3000
  });
}

export function deleteImmediately(name) {
  delete TRASH_ITEMS[name];
  dispatchTrashUpdate();
}

export function emptyTrash() {
  for (const k of Object.keys(TRASH_ITEMS)) {
    delete TRASH_ITEMS[k];
  }
  dispatchTrashUpdate();
}

function resolvePath(pathArr) {
  if (pathArr && (pathArr[pathArr.length - 1] === 'Lixo' || (pathArr[0] === '~' && pathArr[1] === 'Lixo'))) {
    return { type: 'folder', children: TRASH_ITEMS };
  }
  let node = FILE_TREE['~'];
  for (const p of pathArr.slice(1)) {
    if (!node?.children?.[p]) return null;
    node = node.children[p];
  }
  return node;
}

function openQuickLookImage(title, url) {
  const existing = document.getElementById('mac-quicklook-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'mac-quicklook-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    opacity: 0;
    transition: opacity 0.2s ease;
  `;

  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 85vw;
    max-height: 85vh;
    background: #1e1e20;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.95);
    transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1);
  `;

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(40,40,44,0.95);border-bottom:1px solid rgba(255,255,255,0.08);user-select:none;">
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="ql-close-btn" style="width:12px;height:12px;border-radius:50%;background:#ff5f57;border:none;cursor:pointer;padding:0;" title="Fechar"></button>
        <span style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);margin-left:6px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">${title}</span>
      </div>
      <a href="${url}" target="_blank" style="font-size:11px;color:#0a84ff;text-decoration:none;font-weight:500;">Abrir Original ↗</a>
    </div>
    <div style="padding:16px;display:flex;align-items:center;justify-content:center;background:#141416;overflow:hidden;flex:1;">
      <img src="${url}" alt="${title}" style="max-width:100%;max-height:75vh;object-fit:contain;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.5);" />
    </div>
  `;

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    container.style.transform = 'scale(1)';
  });

  const close = () => {
    overlay.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    setTimeout(() => overlay.remove(), 200);
  };

  container.querySelector('#ql-close-btn').onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  window.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', escHandler);
    }
  });
}

export function renderFinder(contentEl, wm, options = {}) {
  contentEl.innerHTML = '';

  const initialPath = options?.initialPath ? [...options.initialPath] : ['~'];
  const titlebar = WindowManager.buildTitleBar('finder', 'mateus', wm, { showTitle: false });

  let currentPath = initialPath;
  let viewMode    = 'grid';
  let searchQuery = '';

  const onNavigate = (e) => {
    if (e.detail?.path) {
      currentPath = [...e.detail.path];
      render();
    }
  };
  window.addEventListener('finder:navigate', onNavigate);

  const SIDEBAR_SECTIONS = [
    {
      header: 'Favoritos',
      items: [
        { label: 'Mesa', iconFile: 'assets/icons/sf-symbols/white/macwindow.png', path: ['~', 'Mesa'] },
        { label: 'Aplicativos', iconFile: 'assets/icons/sf-symbols/white/applications.png', path: ['~', 'Aplicativos'] },
        { label: 'Documentos', iconFile: 'assets/icons/sf-symbols/white/doc.png', path: ['~', 'Documentos'] },
        { label: 'Downloads', iconFile: 'assets/icons/sf-symbols/white/arrow.down.circle.png', path: ['~', 'Downloads'] },
        { label: 'Imagens', iconFile: 'assets/icons/sf-symbols/white/photo.fill.png', path: ['~', 'Imagens'] },
        { label: 'Developer', iconFile: 'assets/icons/sf-symbols/white/hammer.png', path: ['~', 'Developer'] },
      ]
    },
    {
      header: 'iCloud',
      items: []
    },
    {
      header: 'Localizações',
      items: [
        { label: 'OneDrive', iconFile: 'assets/icons/sf-symbols/white/onedrive.png', path: ['~'] },
      ]
    },
    {
      header: 'Etiquetas',
      items: []
    }
  ];

  const root = document.createElement('div');
  root.className = 'finder-root';
  root.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: transparent;
    font-family: -apple-system, 'SF Pro Text', BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  `;

  const body = document.createElement('div');
  body.style.cssText = 'display:flex;flex:1;overflow:hidden;min-height:0;';

  const sidebar = document.createElement('div');
  sidebar.className = 'finder-sidebar';
  sidebar.style.cssText = `
    width: 210px;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    background: rgba(25, 25, 27, 0.97);
    border-right: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  `;

  const tlArea = document.createElement('div');
  tlArea.style.cssText = `
    flex-shrink: 0;
    padding: 0;
  `;

  titlebar.style.cssText = `
    display: flex;
    align-items: center;
    padding: 13px 14px 10px 14px;
    background: rgba(25, 25, 27, 0.97);
    border-bottom: none;
    flex-shrink: 0;
  `;
  tlArea.appendChild(titlebar);
  sidebar.appendChild(tlArea);

  const sidebarScroll = document.createElement('div');
  sidebarScroll.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 4px 0 12px 0;
  `;
  sidebarScroll.style.scrollbarWidth = 'none';

  SIDEBAR_SECTIONS.forEach(sec => {

    const header = document.createElement('div');
    header.className = 'finder-sidebar-header';
    header.style.cssText = `
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.32);
      padding: 14px 16px 5px 16px;
      letter-spacing: 0.3px;
      text-transform: none;
      user-select: none;
    `;
    header.textContent = sec.header;
    sidebarScroll.appendChild(header);

    sec.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'finder-sidebar-item';
      row.style.cssText = `
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 5px 12px 5px 12px;
        cursor: pointer;
        border-radius: 6px;
        margin: 0 6px 1px 6px;
        transition: background 0.1s;
        color: rgba(255,255,255,0.92);
        font-size: 13px;
        font-weight: 400;
        letter-spacing: -0.1px;
        user-select: none;
      `;
      const iconColor = item.label === 'OneDrive' ? 'rgba(255, 255, 255, 0.55)' : '#007aff';
      row.innerHTML = `
        <span class="sidebar-icon-mask" style="width:16px;height:16px;display:inline-block;background-color:${iconColor};-webkit-mask:url('${item.iconFile}') no-repeat center / contain;mask:url('${item.iconFile}') no-repeat center / contain;flex-shrink:0;"></span>
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.label}</span>
      `;
      row.addEventListener('click', () => {
        if (item.path) { currentPath = [...item.path]; render(); }

        sidebarScroll.querySelectorAll('.finder-sidebar-item').forEach(r => r.style.background = '');
        row.style.background = 'rgba(255,255,255,0.12)';
      });
      sidebarScroll.appendChild(row);
    });
  });

  sidebar.appendChild(sidebarScroll);

  const mainPane = document.createElement('div');
  mainPane.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: rgba(30, 30, 32, 0.97);
  `;

  const toolbar = document.createElement('div');
  toolbar.className = 'finder-toolbar';
  toolbar.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px 4px 20px;
    border-bottom: none;
    flex-shrink: 0;
    background: transparent;
    height: 42px;
    box-sizing: border-box;
    position: relative;
    user-select: none;
  `;

  const leftGroup = document.createElement('div');
  leftGroup.style.cssText = 'display:flex;align-items:center;gap:20px;';
  leftGroup.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <button id="finder-back" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Voltar">
        ${getSFSymbolHtml('chevron.left', { size: 14, style: 'opacity:0.65;' })}
      </button>
      <button id="finder-fwd" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Avançar">
        ${getSFSymbolHtml('chevron.right', { size: 14, style: 'opacity:0.4;' })}
      </button>
    </div>
    <div id="finder-folder-title" style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.95);letter-spacing:-0.15px;white-space:nowrap;">mateus</div>
  `;

  const folderTitle = leftGroup.querySelector('#finder-folder-title');

  const rightGroup = document.createElement('div');
  rightGroup.style.cssText = 'display:flex;align-items:center;gap:22px;opacity:0.35;pointer-events:none;';
  rightGroup.innerHTML = `
    <!-- Unified View Mode Toggle -->
    <div id="finder-view-toggle" style="display:flex;align-items:center;gap:3px;cursor:pointer;opacity:0.75;padding:3px 4px;border-radius:4px;transition:opacity 0.12s;" title="Alternar Visualização">
      ${getSFSymbolHtml('square.grid.2x2', { size: 15 })}
      ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.65;margin-left:1px;' })}
    </div>

    <!-- Grouping / Arrange Icon -->
    <div id="finder-group-toggle" style="display:flex;align-items:center;gap:3px;cursor:pointer;opacity:0.75;padding:3px 4px;border-radius:4px;transition:opacity 0.12s;" title="Agrupar">
      ${getSFSymbolHtml('square.grid.3x2', { size: 15 })}
      ${getSFSymbolHtml('chevron.down', { size: 9, style: 'opacity:0.65;margin-left:1px;' })}
    </div>

    <!-- Share Icon -->
    <div id="finder-share-btn" style="display:flex;align-items:center;cursor:pointer;opacity:0.75;padding:3px 4px;border-radius:4px;transition:opacity 0.12s;" title="Compartilhar">
      ${getSFSymbolHtml('square.and.arrow.up', { size: 15 })}
    </div>

    <!-- Action Icon -->
    <div id="finder-action-btn" style="display:flex;align-items:center;gap:3px;cursor:pointer;opacity:0.75;padding:3px 4px;border-radius:4px;transition:opacity 0.12s;" title="Ações">
      ${getSFSymbolHtml('ellipsis.circle', { size: 15 })}
      ${getSFSymbolHtml('chevron.down', { size: 9, style: 'opacity:0.65;margin-left:1px;' })}
    </div>

    <!-- Search Icon (Magnifying glass only) -->
    <div id="finder-search-wrap" style="position:relative;display:flex;align-items:center;">
      <button id="finder-search-icon-btn" style="background:none;border:none;color:currentColor;cursor:pointer;padding:3px 4px;display:flex;align-items:center;opacity:0.75;transition:opacity 0.12s;" title="Buscar">
        ${getSFSymbolHtml('magnifyingglass', { size: 15 })}
      </button>
      <input id="finder-search" type="text" placeholder="Buscar" value="${searchQuery}"
        style="display:none;position:absolute;right:0;top:-2px;background:rgba(30,30,34,0.95);border:1px solid rgba(255,255,255,0.18);outline:none;color:rgba(255,255,255,0.9);border-radius:6px;padding:4px 8px;font-size:12px;width:130px;font-family:inherit;box-shadow:0 4px 12px rgba(0,0,0,0.4);" />
    </div>
  `;

  rightGroup.querySelectorAll('div[title], button').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.opacity = '1');
    el.addEventListener('mouseleave', () => el.style.opacity = '0.75');
  });

  toolbar.appendChild(leftGroup);
  toolbar.appendChild(rightGroup);

  const trashBar = document.createElement('div');
  trashBar.className = 'finder-trash-bar';
  trashBar.style.cssText = `
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px;
    background: rgba(38, 38, 40, 0.95);
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    height: 32px;
    box-sizing: border-box;
    user-select: none;
  `;
  trashBar.innerHTML = `
    <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.92);letter-spacing:-0.1px;">Lixo</span>
    <button id="finder-empty-trash-btn" style="
      background: rgba(255, 255, 255, 0.12);
      border: 0.5px solid rgba(255, 255, 255, 0.15);
      border-radius: 5px;
      color: #ffffff;
      font-size: 11.5px;
      font-weight: 400;
      padding: 2px 10px;
      cursor: pointer;
      outline: none;
      transition: background 0.12s;
      font-family: inherit;
    ">Esvaziar</button>
  `;

  trashBar.querySelector('#finder-empty-trash-btn').addEventListener('click', () => {
    showMacAlert({
      messageText: 'Tem certeza de que deseja esvaziar o Lixo?',
      informativeText: 'Os itens no Lixo serão apagados permanentemente.',
      iconSrc: 'assets/icons/dock/empty-bin-full.png',
      buttons: ['Cancelar', 'Esvaziar Lixo'],
      callback: (chosenBtn) => {
        if (chosenBtn === 'Esvaziar Lixo') {
          emptyTrash();
          render();
          showNotification({
            title: 'Lixo',
            desc: 'O Lixo foi esvaziado.',
            icon: 'assets/icons/dock/empty-bin.png',
            duration: 3000
          });
        }
      }
    });
  });

  const contentArea = document.createElement('div');
  contentArea.id = 'finder-content';

  function deselectAllItems() {
    contentArea.querySelectorAll('.finder-grid-cell').forEach(c => {
      const icon = c.querySelector('.finder-icon-preview');
      if (icon) icon.style.background = '';
      const txt = c.querySelector('.finder-item-name');
      if (txt) {
        txt.style.background = '';
        txt.style.color = 'rgba(255,255,255,0.92)';
      }
    });
    contentArea.querySelectorAll('.finder-list-row').forEach(r => {
      r.style.background = '';
      r.style.color = '';
    });
  }

  function selectGridCell(cell) {
    deselectAllItems();
    const icon = cell.querySelector('.finder-icon-preview');
    if (icon) icon.style.background = 'rgba(255,255,255,0.18)';
    const txt = cell.querySelector('.finder-item-name');
    if (txt) {
      txt.style.background = '#0063e1';
      txt.style.color = '#ffffff';
    }
  }

  function selectListRow(row) {
    deselectAllItems();
    row.style.background = '#0063e1';
    row.style.color = '#ffffff';
  }

  function showItemContextMenu(e, name, item) {
    e.preventDefault();
    e.stopPropagation();

    const isTrash = currentPath[currentPath.length - 1] === 'Lixo';
    const isImage = item.type === 'file' && ['png', 'jpg', 'jpeg', 'webp'].includes(item.ext);

    let menuItems = [];

    if (isTrash) {
      menuItems = [
        {
          label: 'Abrir',
          action: () => {
            if (isImage) openQuickLookImage(name, item.url);
            else if (item.url) window.open(item.url, '_blank');
          }
        },
        {
          label: 'Abrir Com',
          disabled: true
        },
        { type: 'divider' },
        {
          label: 'Colocar de Volta',
          action: () => {
            restoreFromTrash(name);
            render();
          }
        },
        {
          label: 'Apagar Imediatamente...',
          action: () => {
            showMacAlert({
              messageText: `Deseja realmente apagar “${name}” imediatamente?`,
              informativeText: 'Este item será apagado imediatamente. Você não pode desfazer esta ação.',
              buttons: ['Cancelar', 'Apagar'],
              callback: (btn) => {
                if (btn === 'Apagar') {
                  deleteImmediately(name);
                  render();
                }
              }
            });
          }
        },
        {
          label: 'Esvaziar Lixo',
          action: () => {
            showMacAlert({
              messageText: 'Tem certeza de que deseja esvaziar o Lixo?',
              informativeText: 'Os itens no Lixo serão apagados permanentemente.',
              buttons: ['Cancelar', 'Esvaziar Lixo'],
              callback: (btn) => {
                if (btn === 'Esvaziar Lixo') {
                  emptyTrash();
                  render();
                }
              }
            });
          }
        },
        { type: 'divider' },
        {
          label: 'Obter Informações',
          action: () => {
            showMacAlert({
              messageText: name,
              informativeText: `Tipo: ${item.type === 'folder' ? 'Pasta' : (item.ext ? item.ext.toUpperCase() : 'Arquivo')}\nTamanho: ${item.size || '—'}\nLocal: Lixo`,
              buttons: ['OK']
            });
          }
        },
        {
          label: 'Renomear',
          action: () => {}
        },
        {
          label: `Visualização Rápida de “${name}”`,
          action: () => {
            if (isImage) openQuickLookImage(name, item.url);
            else if (item.url) window.open(item.url, '_blank');
          }
        },
        { type: 'divider' },
        {
          label: 'Copiar',
          action: () => navigator.clipboard?.writeText(name)
        },
        { type: 'divider' },
        { type: 'tags' },
        {
          label: 'Etiquetas...',
          action: () => {}
        }
      ];

      if (isImage && item.url) {
        menuItems.push({ type: 'divider' });
        menuItems.push({
          label: 'Definir como Imagem da Mesa',
          action: () => {
            if (options?.desktop?.setWallpaperUrl) {
              options.desktop.setWallpaperUrl(item.url);
            }
          }
        });
      }

    } else {

      menuItems = [
        {
          label: 'Abrir',
          action: () => {
            if (item.type === 'folder') { currentPath.push(name); render(); }
            else if (item.type === 'app') { wm.openApp(item.appKey || name.toLowerCase().replace('.app', ''), name); }
            else if (isImage) { openQuickLookImage(name, item.url); }
            else if (item.url) { window.open(item.url, '_blank'); }
          }
        }
      ];

      if (item.url) {
        menuItems.push({
          label: 'Baixar',
          action: () => {
            const a = document.createElement('a');
            a.href = item.url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }
        });
      } else {
        menuItems.push({ label: 'Abrir Com', disabled: true });
      }

      menuItems.push({ type: 'divider' });
      menuItems.push({
        label: 'Mover para o Lixo',
        action: () => {
          moveToTrash(name, item, currentPath);
          render();
        }
      });
      menuItems.push({ type: 'divider' });
      menuItems.push({
        label: 'Obter Informações',
        action: () => {
          showMacAlert({
            messageText: name,
            informativeText: `Tipo: ${item.type === 'folder' ? 'Pasta' : (item.ext ? item.ext.toUpperCase() : 'Arquivo')}\nTamanho: ${item.size || '—'}\nLocal: ${currentPath.join(' > ')}`,
            buttons: ['OK']
          });
        }
      });
      menuItems.push({ label: 'Renomear', action: () => {} });
      menuItems.push({
        label: `Comprimir “${name}”`,
        action: () => {
          showNotification({
            title: 'Finder',
            desc: `Comprimindo “${name}”...`,
            icon: 'assets/icons/dock/finder.png',
            duration: 2500
          });
        }
      });
      menuItems.push({ label: 'Duplicar', action: () => {} });
      menuItems.push({ label: 'Criar Atalho', action: () => {} });
      menuItems.push({
        label: `Visualização Rápida de “${name}”`,
        action: () => {
          if (isImage) openQuickLookImage(name, item.url);
          else if (item.url) window.open(item.url, '_blank');
        }
      });
      menuItems.push({ type: 'divider' });
      menuItems.push({
        label: 'Copiar',
        action: () => navigator.clipboard?.writeText(name)
      });
      menuItems.push({
        label: 'Compartilhar...',
        action: () => {
          if (navigator.share) {
            navigator.share({ title: name, url: item.url || window.location.href });
          } else {
            navigator.clipboard?.writeText(item.url || window.location.href);
          }
        }
      });
      menuItems.push({ type: 'divider' });
      menuItems.push({ type: 'tags' });
      menuItems.push({ label: 'Etiquetas...', action: () => {} });

      if (isImage && item.url) {
        menuItems.push({ type: 'divider' });
        menuItems.push({
          label: 'Definir como Imagem da Mesa',
          action: () => {
            if (options?.desktop?.setWallpaperUrl) {
              options.desktop.setWallpaperUrl(item.url);
            }
          }
        });
      }
    }

    if (options?.contextMenu) {
      options.contextMenu.open(e.clientX, e.clientY, menuItems);
    }
  }

  contentArea.addEventListener('click', (e) => {
    if (!e.target.closest('.finder-grid-cell') && !e.target.closest('.finder-list-row')) {
      deselectAllItems();
    }
  });

  const pathBar = document.createElement('div');
  pathBar.id = 'finder-pathbar';
  pathBar.style.cssText = `
    padding: 5px 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 11.5px;
    font-weight: 400;
    color: rgba(255,255,255,0.65);
    display: flex;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
    background: rgba(28, 28, 30, 0.97);
    letter-spacing: -0.1px;
    height: 26px;
    box-sizing: border-box;
  `;

  mainPane.appendChild(toolbar);
  mainPane.appendChild(trashBar);
  mainPane.appendChild(contentArea);
  mainPane.appendChild(pathBar);

  body.appendChild(sidebar);
  body.appendChild(mainPane);
  root.appendChild(body);
  contentEl.appendChild(root);

  function updatePathBar() {
    const isTrash = currentPath[currentPath.length - 1] === 'Lixo';
    const fullPath = ['Macintosh HD', 'Usuários', ...currentPath.map(p => p === '~' ? 'mateus' : p)];

    const lastSegment = isTrash ? 'Lixo' : fullPath[fullPath.length - 1];
    folderTitle.textContent = lastSegment;

    if (isTrash) {
      pathBar.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,0.85);font-weight:500;font-size:11px;">
          <img src="assets/icons/dock/empty-bin.png" style="width:13px;height:13px;object-fit:contain;flex-shrink:0;" draggable="false" />
          <span>Lixo</span>
        </span>
      `;
      return;
    }

    pathBar.innerHTML = fullPath.map((p, i) => {
      let iconSrc = 'assets/icons/folders/default-folder.png';
      if (p === 'Macintosh HD') {
        iconSrc = 'assets/icons/folders/macintosh-HD-drive.png';
      } else if (p === 'Documentos') {
        iconSrc = 'assets/icons/folders/documents-folder.png';
      } else if (p === 'Downloads') {
        iconSrc = 'assets/icons/folders/downloads-folder.png';
      } else if (p === 'Mesa') {
        iconSrc = 'assets/icons/folders/desktop-folder.png';
      } else if (p === 'Aplicativos') {
        iconSrc = 'assets/icons/folders/applications-folder.png';
      } else if (p === 'Imagens') {
        iconSrc = 'assets/icons/folders/imagens-folder.png';
      } else if (p === 'Lixo') {
        iconSrc = 'assets/icons/dock/empty-bin.png';
      } else if (p === 'Filmes' || p === 'Movies') {
        iconSrc = 'assets/icons/folders/films-folder.png';
      } else if (p === 'Música' || p === 'Music') {
        iconSrc = 'assets/icons/folders/music-folder.png';
      } else if (p === 'Developer' || p === 'Projetos') {
        iconSrc = 'assets/icons/folders/developer-folder.png';
      }

      const iconHtml = `<img src="${iconSrc}" style="width:13px;height:13px;object-fit:contain;flex-shrink:0;" draggable="false" />`;
      const isLast = i === fullPath.length - 1;
      return `<span style="display:inline-flex;align-items:center;gap:5px;cursor:pointer;color:${isLast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)'};font-weight:${isLast ? '500' : '400'};font-size:11px;" data-idx="${i}">${iconHtml}<span>${p}</span></span>${!isLast ? `<img src="assets/icons/sf-symbols/white/chevron.right.png" style="width:5.5px;height:9px;object-fit:contain;opacity:0.35;margin:0 5px;vertical-align:middle;display:inline-block;flex-shrink:0;" draggable="false" />` : ''}`;
    }).join('');

    pathBar.querySelectorAll('[data-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const idx = +el.dataset.idx;
        if (idx >= 2) {
          currentPath = currentPath.slice(0, idx - 1);
          render();
        }
      });
    });
  }

  function render() {
    const isTrash = currentPath[currentPath.length - 1] === 'Lixo';
    trashBar.style.display = isTrash ? 'flex' : 'none';

    const node     = resolvePath(currentPath);
    const children = node?.children || {};
    const filtered = Object.entries(children).filter(([name]) =>
      !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (viewMode === 'grid') {
      contentArea.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 20px 20px 8px 20px;
        display: flex;
        flex-wrap: wrap;
        align-content: start;
        gap: 20px 24px;
      `;
      contentArea.innerHTML = '';

      filtered.forEach(([name, item]) => {
        const cell = document.createElement('div');
        cell.className = 'finder-grid-cell';
        cell.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 6px 4px 4px 4px;
          border-radius: 8px;
          cursor: default;
          width: 90px;
          user-select: none;
        `;
        cell.innerHTML = `
          <div class="finder-icon-preview" style="width:76px;height:76px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:background 0.08s;">
            ${getIconHtml(name, item, 68)}
          </div>
          <span class="finder-item-name" style="
            font-size: 11.5px;
            text-align: center;
            word-break: break-word;
            color: rgba(255,255,255,0.92);
            max-width: 88px;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            letter-spacing: -0.1px;
            font-weight: 400;
            padding: 1px 5px;
            border-radius: 4px;
            transition: background 0.08s, color 0.08s;
          ">${name}</span>
        `;
        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          selectGridCell(cell);
        });
        cell.addEventListener('contextmenu', (e) => {
          selectGridCell(cell);
          showItemContextMenu(e, name, item);
        });
        cell.addEventListener('dblclick', () => {
          if (item.type === 'folder') { currentPath.push(name); render(); }
          if (item.type === 'app') {
            wm.openApp(item.appKey || name.toLowerCase().replace('.app', ''), name);
            if (item.portfolioSection) {
              setTimeout(() => {
                if (window._safariEngine) window._safariEngine.loadPortfolioSection(item.portfolioSection, true);
              }, 50);
            }
          }
          if (item.type === 'file' && item.url) {
            if (['png', 'jpg', 'jpeg', 'webp'].includes(item.ext)) {
              openQuickLookImage(name, item.url);
            } else {
              window.open(item.url, '_blank');
            }
          }
        });
        contentArea.appendChild(cell);
      });

      if (filtered.length === 0) {
        contentArea.innerHTML = `<div style="text-align:center;opacity:0.25;padding:60px;font-size:13px;width:100%;">Esta pasta está vazia</div>`;
      }

    } else {

      contentArea.style.cssText = `flex:1;overflow-y:auto;padding:4px;user-select:none;`;
      contentArea.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 100px 80px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.35);padding:5px 12px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:2px;letter-spacing:0.1px;">
          <span>Nome</span><span style="text-align:right;">Data de modificação</span><span style="text-align:right;">Tamanho</span>
        </div>
      `;
      filtered.forEach(([name, item]) => {
        const row = document.createElement('div');
        row.className = 'finder-list-row';
        row.style.cssText = `
          display: grid;
          grid-template-columns: 1fr 100px 80px;
          align-items: center;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 5px;
          cursor: default;
          transition: background 0.08s;
          letter-spacing: -0.1px;
        `;
        row.innerHTML = `
          <span style="display:flex;align-items:center;gap:8px;">${getIconHtml(name, item, 20)}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</span></span>
          <span style="text-align:right;opacity:0.4;font-size:11px;">${new Date().toLocaleDateString('pt-BR')}</span>
          <span style="text-align:right;opacity:0.4;font-size:11px;">${item.size || '—'}</span>
        `;
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          selectListRow(row);
        });
        row.addEventListener('contextmenu', (e) => {
          selectListRow(row);
          showItemContextMenu(e, name, item);
        });
        row.addEventListener('dblclick', () => {
          if (item.type === 'folder') { currentPath.push(name); render(); }
          if (item.type === 'app') {
            wm.openApp(item.appKey || name.toLowerCase().replace('.app', ''), name);
            if (item.portfolioSection) {
              setTimeout(() => {
                if (window._safariEngine) window._safariEngine.loadPortfolioSection(item.portfolioSection, true);
              }, 50);
            }
          }
          if (item.type === 'file' && item.url) {
            if (['png', 'jpg', 'jpeg', 'webp'].includes(item.ext)) {
              openQuickLookImage(name, item.url);
            } else {
              window.open(item.url, '_blank');
            }
          }
        });
        contentArea.appendChild(row);
      });

      if (filtered.length === 0) {
        contentArea.innerHTML += `<div style="text-align:center;opacity:0.25;padding:40px;font-size:13px;">Esta pasta está vazia</div>`;
      }
    }

    updatePathBar();
  }

  toolbar.querySelector('#finder-back')?.addEventListener('click', () => {
    if (currentPath.length > 1) { currentPath.pop(); render(); }
  });

  const viewToggle = toolbar.querySelector('#finder-view-toggle');
  viewToggle?.addEventListener('click', () => {
    viewMode = viewMode === 'grid' ? 'list' : 'grid';
    render();
  });

  const searchWrap = toolbar.querySelector('#finder-search-wrap');
  const searchIconBtn = toolbar.querySelector('#finder-search-icon-btn');
  const searchInput = toolbar.querySelector('#finder-search');

  let searchTimer;

  searchIconBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (searchInput) {
      const isHidden = searchInput.style.display === 'none' || !searchInput.style.display;
      searchInput.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        searchInput.focus();
      } else {
        searchQuery = '';
        searchInput.value = '';
        render();
      }
    }
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(render, 180);
  });

  searchInput?.addEventListener('blur', () => {
    if (!searchQuery) {
      searchInput.style.display = 'none';
    }
  });

  render();
}
