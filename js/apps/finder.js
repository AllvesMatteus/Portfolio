import { WindowManager } from '../windowManager.js';
import { getSFSymbolHtml } from '../sfSymbols.js';

const FILE_TREE = {
  '~': {
    type: 'folder',
    children: {
      'Documentos': { type: 'folder', children: { 'Projetos': { type: 'folder', children: { 'macweb.dev': { type: 'file', size: '7 KB', ext: 'md' } } }, 'Currículo.pdf': { type: 'file', size: '1.2 MB', ext: 'pdf', url: 'assets/docs/mateus-desenvolvedor-fullstack.pdf' } } },
      'Downloads':  { type: 'folder', children: { 'macOS-Sequoia.dmg': { type: 'file', size: '5.4 GB', ext: 'dmg' } } },
      'Filmes':     { type: 'folder', children: {} },
      'Imagens':    { type: 'folder', children: { 'wallpaper.jpg': { type: 'file', size: '1.2 MB', ext: 'jpg' } } },
      'Mesa':       { type: 'folder', children: { 'macweb.dev': { type: 'folder', children: {} } } },
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
          'Ajustes.app':   { type: 'app', size: '12 MB', ext: 'app', appKey: 'settings' },
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

  if (['png', 'jpg', 'jpeg', 'webp'].includes(item.ext)) return getSFSymbolHtml('photo',      { size });
  if (['mp3', 'm3u'].includes(item.ext))                  return getSFSymbolHtml('music.note', { size });
  if (['zip', 'dmg'].includes(item.ext))                  return getSFSymbolHtml('archivebox', { size });

  return getSFSymbolHtml('doc.text', { size });
}

function resolvePath(pathArr) {
  let node = FILE_TREE['~'];
  for (const p of pathArr.slice(1)) {
    if (!node?.children?.[p]) return null;
    node = node.children[p];
  }
  return node;
}

export function renderFinder(contentEl, wm) {
  contentEl.innerHTML = '';

  const titlebar = WindowManager.buildTitleBar('finder', 'mateus', wm, { showTitle: false });

  let currentPath = ['~'];
  let viewMode    = 'grid';
  let searchQuery = '';

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
      items: [
        { label: 'OneDrive', iconFile: 'assets/icons/sf-symbols/white/icloud.png', path: ['~'] },
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
      row.innerHTML = `
        <span class="sidebar-icon-mask" style="width:16px;height:16px;display:inline-block;background-color:#007aff;-webkit-mask:url('${item.iconFile}') no-repeat center / contain;mask:url('${item.iconFile}') no-repeat center / contain;flex-shrink:0;"></span>
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.label}</span>
      `;
      row.addEventListener('click', () => {
        if (item.path) { currentPath = [...item.path]; render(); }

        sidebarScroll.querySelectorAll('.finder-sidebar-item').forEach(r => r.style.background = '');
        row.style.background = 'rgba(255,255,255,0.12)';
      });
      row.addEventListener('mouseenter', () => { if (row.style.background !== 'rgba(255,255,255,0.12)') row.style.background = 'rgba(255,255,255,0.06)'; });
      row.addEventListener('mouseleave', () => { if (row.style.background !== 'rgba(255,255,255,0.12)') row.style.background = ''; });
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
  rightGroup.style.cssText = 'display:flex;align-items:center;gap:22px;';
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

  const contentArea = document.createElement('div');
  contentArea.id = 'finder-content';

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
  mainPane.appendChild(contentArea);
  mainPane.appendChild(pathBar);

  body.appendChild(sidebar);
  body.appendChild(mainPane);
  root.appendChild(body);
  contentEl.appendChild(root);

  function updatePathBar() {
    const fullPath = ['Macintosh HD', 'Usuários', ...currentPath.map(p => p === '~' ? 'mateus' : p)];

    const lastSegment = fullPath[fullPath.length - 1];
    folderTitle.textContent = lastSegment;

    pathBar.innerHTML = fullPath.map((p, i) => {

      const iconHtml = i === 0
        ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0;opacity:0.75;"><rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="rgba(255,255,255,0.7)" stroke-width="1"/><rect x="3" y="4.5" width="6" height="3" rx="0.5" fill="rgba(255,255,255,0.5)"/></svg>`
        : `<svg width="12" height="12" viewBox="0 0 20 16" fill="none" style="flex-shrink:0;"><path d="M0 3.5C0 2.395 0.895 1.5 2 1.5H7.5L9.5 3.5H18C19.105 3.5 20 4.395 20 5.5V13.5C20 14.605 19.105 15.5 18 15.5H2C0.895 15.5 0 14.605 0 13.5V3.5Z" fill="#3b9eff" opacity="0.9"/></svg>`;

      const isLast = i === fullPath.length - 1;
      return `<span style="display:inline-flex;align-items:center;gap:3px;cursor:pointer;color:${isLast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)'};font-weight:${isLast ? '500' : '400'};" data-idx="${i}">${iconHtml}<span>${p}</span></span>${!isLast ? '<span style="opacity:0.3;margin:0 1px;font-size:10px;">›</span>' : ''}`;
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
          gap: 7px;
          padding: 10px 8px 8px 8px;
          border-radius: 8px;
          cursor: pointer;
          width: 90px;
          transition: background 0.12s;
        `;
        cell.innerHTML = `
          <div style="height:72px;display:flex;align-items:center;justify-content:center;">${getIconHtml(name, item, 68)}</div>
          <span style="
            font-size: 12px;
            text-align: center;
            word-break: break-word;
            color: rgba(255,255,255,0.9);
            max-width: 88px;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            letter-spacing: -0.1px;
            font-weight: 400;
          ">${name}</span>
        `;
        cell.addEventListener('mouseenter', () => cell.style.background = 'rgba(255,255,255,0.08)');
        cell.addEventListener('mouseleave', () => cell.style.background = '');
        cell.addEventListener('dblclick', () => {
          if (item.type === 'folder') { currentPath.push(name); render(); }
          if (item.type === 'app')    { wm.openApp(item.appKey || name.toLowerCase().replace('.app', ''), name); }
          if (item.type === 'file' && item.url) { window.open(item.url, '_blank'); }
        });
        contentArea.appendChild(cell);
      });

      if (filtered.length === 0) {
        contentArea.innerHTML = `<div style="text-align:center;opacity:0.25;padding:60px;font-size:13px;width:100%;">Esta pasta está vazia</div>`;
      }

    } else {

      contentArea.style.cssText = `flex:1;overflow-y:auto;padding:4px;`;
      contentArea.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 100px 80px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.35);padding:5px 12px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:2px;letter-spacing:0.1px;">
          <span>Nome</span><span style="text-align:right;">Data de modificação</span><span style="text-align:right;">Tamanho</span>
        </div>
      `;
      filtered.forEach(([name, item]) => {
        const row = document.createElement('div');
        row.style.cssText = `
          display: grid;
          grid-template-columns: 1fr 100px 80px;
          align-items: center;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.1s;
          letter-spacing: -0.1px;
        `;
        row.innerHTML = `
          <span style="display:flex;align-items:center;gap:8px;">${getIconHtml(name, item, 20)}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</span></span>
          <span style="text-align:right;opacity:0.4;font-size:11px;">${new Date().toLocaleDateString('pt-BR')}</span>
          <span style="text-align:right;opacity:0.4;font-size:11px;">${item.size || '—'}</span>
        `;
        row.addEventListener('mouseenter', () => row.style.background = 'rgba(255,255,255,0.05)');
        row.addEventListener('mouseleave', () => row.style.background = '');
        row.addEventListener('dblclick', () => {
          if (item.type === 'folder') { currentPath.push(name); render(); }
          if (item.type === 'app')    { wm.openApp(item.appKey || name.toLowerCase().replace('.app', ''), name); }
          if (item.type === 'file' && item.url) { window.open(item.url, '_blank'); }
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
