import { WindowManager } from '../windowManager.js';
import { getSFSymbolHtml } from '../sfSymbols.js';

const FILE_TREE = {
  '~': {
    type: 'folder',
    children: {
      'Documentos': { type: 'folder', children: { 'Projetos': { type: 'folder', children: { 'macweb.dev': { type: 'file', size: '7 KB', ext: 'md' } } } } },
      'Downloads': { type: 'folder', children: { 'macOS-Sequoia.dmg': { type: 'file', size: '5.4 GB', ext: 'dmg' } } },
      'Filmes': { type: 'folder', children: {} },
      'Imagens': { type: 'folder', children: { 'wallpaper.jpg': { type: 'file', size: '1.2 MB', ext: 'jpg' } } },
      'Mesa': { type: 'folder', children: { 'macweb.dev': { type: 'folder', children: {} } } },
      'Música': { type: 'folder', children: {} },
      'Pública': { type: 'folder', children: {} },
      'Developer': { type: 'folder', children: {} },
      'OneDrive - Phalune': { type: 'folder', children: {} },
      'Aplicativos': {
        type: 'folder',
        children: {
          'Finder.app': { type: 'app', size: '15 MB', ext: 'app', appKey: 'finder' },
          'Terminal.app': { type: 'app', size: '8 MB', ext: 'app', appKey: 'terminal' },
          'Safari.app': { type: 'app', size: '50 MB', ext: 'app', appKey: 'safari' },
          'Settings.app': { type: 'app', size: '12 MB', ext: 'app', appKey: 'settings' },
        }
      },
      'Zomboid': { type: 'folder', children: {} },
    }
  }
};

function getIconHtml(name, item, size = 32) {
  if (item.type === 'folder') {
    if (name === 'Developer' || name === 'Projetos') {
      return `<img src="assets/icons/custom/folder-developer.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    }
    return `<img src="assets/icons/custom/default-folder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
  }

  if (item.ext === 'pdf') {
    return `<img src="assets/icons/custom/pdf-document.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
  }

  if (item.type === 'app') {
    if (name.includes('Finder') || item.appKey === 'finder') return `<img src="assets/icons/custom/finder.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name.includes('Safari') || item.appKey === 'safari') return `<img src="assets/icons/custom/safari.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name.includes('Terminal') || item.appKey === 'terminal') return `<img src="assets/icons/custom/terminal.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    if (name.includes('Settings') || item.appKey === 'settings') return `<img src="assets/icons/custom/settings.png" alt="${name}" style="width:${size}px;height:${size}px;object-fit:contain;" draggable="false" />`;
    return getSFSymbolHtml('app', { size });
  }

  if (['png', 'jpg', 'jpeg', 'webp'].includes(item.ext)) return getSFSymbolHtml('photo', { size });
  if (['mp3', 'm3u'].includes(item.ext)) return getSFSymbolHtml('music.note', { size });
  if (['zip', 'dmg'].includes(item.ext)) return getSFSymbolHtml('archivebox', { size });

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
  const titlebar = WindowManager.buildTitleBar('finder', 'mateus', wm, { showTitle: true });
  contentEl.appendChild(titlebar);

  let currentPath = ['~'];
  let viewMode = 'grid'; // 'grid' | 'list'
  let searchQuery = '';
  let selectedFile = null;

  const SIDEBAR_SECTIONS = [
    {
      header: 'Favoritos',
      items: [
        { label: 'Mesa', iconSymbol: 'desktopcomputer', path: ['~', 'Mesa'] },
        { label: 'Aplicativos', iconSymbol: 'app', path: ['~', 'Aplicativos'] },
        { label: 'Documentos', iconSymbol: 'doc.text', path: ['~', 'Documentos'] },
        { label: 'Downloads', iconSymbol: 'arrow.down.circle', path: ['~', 'Downloads'] },
        { label: 'Imagens', iconSymbol: 'photo', path: ['~', 'Imagens'] },
        { label: 'Developer', iconSymbol: 'hammer', path: ['~', 'Developer'] },
      ]
    },
    {
      header: 'iCloud',
      items: [
        { label: 'Drive do iCloud', iconSymbol: 'icloud', path: null },
      ]
    },
    {
      header: 'Localizações',
      items: [
        { label: 'OneDrive', iconSymbol: 'cloud', path: ['~', 'OneDrive - Phalune'] },
      ]
    },
    {
      header: 'Etiquetas',
      items: []
    }
  ];

  const wrapper = document.createElement('div');
  wrapper.className = 'finder-window';
  wrapper.style.cssText = 'display:flex;flex-direction:column;height:calc(100% - 38px);overflow:hidden;background:rgba(30,30,34,0.95);';

  // Toolbar matching Image 1
  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;background:rgba(36,36,40,0.98);';
  toolbar.innerHTML = `
    <button id="finder-back" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;padding:4px;display:flex;align-items:center;" title="Back">${getSFSymbolHtml('chevron.left', { size: 14 })}</button>
    <button id="finder-fwd" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;padding:4px;display:flex;align-items:center;" title="Forward">${getSFSymbolHtml('chevron.right', { size: 14 })}</button>
    <div style="font-weight:600;font-size:13px;margin-left:8px;">mateus</div>
    <div style="flex:1;display:flex;align-items:center;justify-content:flex-end;gap:12px;">
      <div style="display:flex;gap:4px;background:rgba(255,255,255,0.06);border-radius:6px;padding:2px;">
        <button id="finder-grid-view" style="background:${viewMode==='grid'?'rgba(255,255,255,0.15)':'transparent'};border:none;color:currentColor;border-radius:4px;padding:4px 8px;cursor:pointer;display:flex;align-items:center;" title="Grid View">${getSFSymbolHtml('square.grid.2x2', { size: 14 })}</button>
        <button id="finder-list-view" style="background:${viewMode==='list'?'rgba(255,255,255,0.15)':'transparent'};border:none;color:currentColor;border-radius:4px;padding:4px 8px;cursor:pointer;display:flex;align-items:center;" title="List View">${getSFSymbolHtml('list.bullet', { size: 14 })}</button>
      </div>
      <span style="opacity:0.6;cursor:pointer;">${getSFSymbolHtml('square.and.arrow.up', { size: 14 })}</span>
      <span style="opacity:0.6;cursor:pointer;">${getSFSymbolHtml('ellipsis.circle', { size: 14 })}</span>
      <div style="position:relative;display:flex;align-items:center;">
        <span style="position:absolute;left:8px;pointer-events:none;display:flex;align-items:center;opacity:0.5;">${getSFSymbolHtml('magnifyingglass', { size: 12 })}</span>
        <input id="finder-search" type="text" placeholder="Buscar" value="${searchQuery}"
          style="background:rgba(255,255,255,0.08);border:none;outline:none;color:currentColor;border-radius:6px;padding:4px 10px 4px 26px;font-size:13px;width:120px;" />
      </div>
    </div>
  `;

  // Body
  const body = document.createElement('div');
  body.style.cssText = 'display:flex;flex:1;overflow:hidden;';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'width:190px;min-width:160px;border-right:1px solid rgba(255,255,255,0.07);background:rgba(28,28,30,0.98);flex-shrink:0;overflow-y:auto;padding:12px 6px;';

  SIDEBAR_SECTIONS.forEach(sec => {
    const secHeader = document.createElement('div');
    secHeader.style.cssText = 'font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);padding:8px 10px 4px 10px;text-transform:none;';
    secHeader.textContent = sec.header;
    sidebar.appendChild(secHeader);

    sec.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'finder-sidebar-item';
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:5px 10px;cursor:pointer;border-radius:6px;margin:1px 0;transition:background 0.12s;color:rgba(255,255,255,0.85);';
      row.innerHTML = `<span style="display:flex;align-items:center;color:#007AFF;">${getSFSymbolHtml(item.iconSymbol, { size: 15 })}</span><span style="font-size:13px;">${item.label}</span>`;
      row.addEventListener('click', () => {
        if (item.path) { currentPath = [...item.path]; render(); }
      });
      row.addEventListener('mouseenter', () => row.style.background = 'rgba(255,255,255,0.06)');
      row.addEventListener('mouseleave', () => row.style.background = '');
      sidebar.appendChild(row);
    });
  });

  // Content area
  const contentArea = document.createElement('div');
  contentArea.id = 'finder-content';
  contentArea.style.cssText = 'flex:1;overflow-y:auto;padding:8px;';

  // Preview panel
  const preview = document.createElement('div');
  preview.id = 'finder-preview';
  preview.style.cssText = 'width:200px;min-width:160px;border-left:1px solid rgba(255,255,255,0.07);background:rgba(24,24,26,0.98);flex-shrink:0;padding:16px;display:flex;flex-direction:column;align-items:center;';
  preview.innerHTML = `<div style="opacity:0.3;font-size:13px;margin-top:60px;">Select a file to preview</div>`;

  // Path bar
  const pathBar = document.createElement('div');
  pathBar.id = 'finder-pathbar';
  pathBar.style.cssText = 'padding:4px 16px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;opacity:0.4;display:flex;align-items:center;gap:4px;flex-shrink:0;background:rgba(32,32,36,0.95);';

  body.appendChild(sidebar);
  body.appendChild(contentArea);
  body.appendChild(preview);
  wrapper.appendChild(toolbar);
  wrapper.appendChild(body);
  wrapper.appendChild(pathBar);
  contentEl.appendChild(wrapper);

  function updatePathBar() {
    const fullPath = ['Macintosh HD', 'Usuários', ...currentPath.map(p => p === '~' ? 'mateus' : p)];
    pathBar.innerHTML = fullPath.map((p, i) => {
      const icon = i === 0 ? '💻' : '📁';
      return `<span style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;" data-idx="${i}"><span>${icon}</span><span>${p}</span></span>${i < fullPath.length - 1 ? '<span style="opacity:0.5;margin:0 2px;"> > </span>' : ''}`;
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

  function showPreview(name, item) {
    selectedFile = name;
    preview.innerHTML = `
      <div style="margin-bottom:12px;display:flex;justify-content:center;">${getIconHtml(name, item, 56)}</div>
      <div style="font-size:14px;font-weight:600;text-align:center;word-break:break-all;margin-bottom:4px;">${name}</div>
      <div style="font-size:12px;opacity:0.5;text-align:center;margin-bottom:16px;">${item.size || (item.type==='folder'?'Folder':'Unknown')}</div>
      <div style="width:100%;border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.4;margin-bottom:8px;">Information</div>
        <div style="font-size:12px;opacity:0.6;line-height:2;">
          Kind: ${item.type === 'folder' ? 'Folder' : item.ext?.toUpperCase() || 'File'}<br/>
          Modified: ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;
  }

  function render() {
    const node = resolvePath(currentPath);
    const children = node?.children || {};
    const filtered = Object.entries(children).filter(([name]) =>
      !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (viewMode === 'grid') {
      contentArea.style.cssText = 'flex:1;overflow-y:auto;padding:16px;display:flex;flex-wrap:wrap;align-content:start;gap:16px;';
      contentArea.innerHTML = '';
      filtered.forEach(([name, item]) => {
        const cell = document.createElement('div');
        cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 8px;border-radius:8px;cursor:pointer;width:90px;transition:background 0.12s;';
        cell.innerHTML = `<div style="height:48px;display:flex;align-items:center;justify-content:center;">${getIconHtml(name, item, 42)}</div><span style="font-size:12px;text-align:center;word-break:break-all;opacity:0.9;max-width:84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</span>`;
        cell.addEventListener('mouseenter', () => cell.style.background = 'rgba(255,255,255,0.07)');
        cell.addEventListener('mouseleave', () => cell.style.background = '');
        cell.addEventListener('click', () => showPreview(name, item));
        cell.addEventListener('dblclick', () => {
          if (item.type === 'folder') { currentPath.push(name); render(); }
          if (item.type === 'app') { wm.openApp(item.appKey || name.toLowerCase().replace('.app',''), name); }
        });
        contentArea.appendChild(cell);
      });
    } else {
      // List view
      contentArea.style.cssText = 'flex:1;overflow-y:auto;padding:4px;';
      contentArea.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 80px 80px;font-size:11px;font-weight:700;opacity:0.4;padding:4px 8px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:2px;">
          <span>Name</span><span style="text-align:right;">Date Modified</span><span style="text-align:right;">Size</span>
        </div>
      `;
      filtered.forEach(([name, item]) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:grid;grid-template-columns:1fr 80px 80px;align-items:center;font-size:13px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background 0.12s;';
        row.innerHTML = `
          <span style="display:flex;align-items:center;gap:10px;"><span style="display:flex;align-items:center;">${getIconHtml(name, item, 20)}</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</span></span>
          <span style="text-align:right;opacity:0.4;font-size:11px;">${new Date().toLocaleDateString()}</span>
          <span style="text-align:right;opacity:0.4;font-size:11px;">${item.size || '—'}</span>
        `;
        row.addEventListener('mouseenter', () => row.style.background = 'rgba(255,255,255,0.05)');
        row.addEventListener('mouseleave', () => row.style.background = '');
        row.addEventListener('click', () => { showPreview(name, item); row.style.background = 'rgba(10,132,255,0.2)'; });
        row.addEventListener('dblclick', () => {
          if (item.type === 'folder') { currentPath.push(name); render(); }
          if (item.type === 'app') { wm.openApp(item.appKey || name.toLowerCase().replace('.app',''), name); }
        });
        contentArea.appendChild(row);
      });

      if (filtered.length === 0) {
        contentArea.innerHTML += `<div style="text-align:center;opacity:0.3;padding:40px;font-size:14px;">This folder is empty</div>`;
      }
    }

    updatePathBar();
  }

  // Toolbar events
  toolbar.querySelector('#finder-back')?.addEventListener('click', () => {
    if (currentPath.length > 1) { currentPath.pop(); render(); }
  });
  toolbar.querySelector('#finder-list-view')?.addEventListener('click', () => { viewMode = 'list'; render(); });
  toolbar.querySelector('#finder-grid-view')?.addEventListener('click', () => { viewMode = 'grid'; render(); });

  let searchTimer;
  toolbar.querySelector('#finder-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(render, 200);
  });

  render();
}
