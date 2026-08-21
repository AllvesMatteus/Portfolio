const WALLPAPER_GROUPS = [
  {
    id: 'custom',
    title: 'Featured Wallpaper',
    wallpapers: [
      { id: 'custom_wallpaper', name: 'macOS Wallpaper', image: 'assets/images/wallpapers/wallpaper.jpg', thumb: 'assets/images/wallpapers/wallpaper.jpg' }
    ]
  },
  {
    id: 'sequoia',
    title: 'macOS Sequoia',
    wallpapers: [
      { id: 'sequoia_1',  name: 'Sequoia Default', image: 'assets/images/wallpapers/Sequoia/wallpaper_default.png', thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_default_thumb.png' },
      { id: 'sequoia_2',  name: 'Sequoia Forest',  image: 'assets/images/wallpapers/Sequoia/wallpaper_2.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_2_thumb.png'  },
      { id: 'sequoia_3',  name: 'Sequoia Lake',    image: 'assets/images/wallpapers/Sequoia/wallpaper_3.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_3_thumb.png'  },
      { id: 'sequoia_4',  name: 'Sequoia Mountain',image: 'assets/images/wallpapers/Sequoia/wallpaper_4.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_4_thumb.png'  },
      { id: 'sequoia_5',  name: 'Sequoia Sunset',  image: 'assets/images/wallpapers/Sequoia/wallpaper_5.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_5_thumb.png'  },
      { id: 'sequoia_6',  name: 'Sequoia Night',   image: 'assets/images/wallpapers/Sequoia/wallpaper_6.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_6_thumb.png'  },
      { id: 'sequoia_7',  name: 'Sequoia Abstract',image: 'assets/images/wallpapers/Sequoia/wallpaper_7.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_7_thumb.png'  },
      { id: 'sequoia_8',  name: 'Sequoia Waves',   image: 'assets/images/wallpapers/Sequoia/wallpaper_8.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_8_thumb.png'  },
      { id: 'sequoia_9',  name: 'Sequoia Desert',  image: 'assets/images/wallpapers/Sequoia/wallpaper_9.png',       thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_9_thumb.png'  },
      { id: 'sequoia_10', name: 'Sequoia City',    image: 'assets/images/wallpapers/Sequoia/wallpaper_10.png',      thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_10_thumb.png' },
      { id: 'sequoia_11', name: 'Sequoia Vintage', image: 'assets/images/wallpapers/Sequoia/wallpaper_11.png',      thumb: 'assets/images/wallpapers/Sequoia/thumbs/wallpaper_11_thumb.png' },
    ]
  },
  {
    id: 'tahoe',
    title: 'macOS Tahoe',
    wallpapers: [
      { id: 'tahoe_light', name: 'Tahoe Light',       image: 'assets/images/wallpapers/Tahoe/Tahoe Light.webp',        thumb: 'assets/images/wallpapers/Tahoe/thumbs/Tahoe Light_thumb.webp',        isLight: true  },
      { id: 'tahoe_dark',  name: 'Tahoe Dark',        image: 'assets/images/wallpapers/Tahoe/Tahoe Dark.webp',         thumb: 'assets/images/wallpapers/Tahoe/thumbs/Tahoe Dark_thumb.webp',         isLight: false },
      { id: 'tahoe_dawn',  name: 'Tahoe Beach Dawn',  image: 'assets/images/wallpapers/Tahoe/26-Tahoe-Beach-Dawn.png', thumb: 'assets/images/wallpapers/Tahoe/thumbs/26-Tahoe-Beach-Dawn_thumb.png'  },
      { id: 'tahoe_day',   name: 'Tahoe Beach Day',   image: 'assets/images/wallpapers/Tahoe/26-Tahoe-Beach-Day.png',  thumb: 'assets/images/wallpapers/Tahoe/thumbs/26-Tahoe-Beach-Day_thumb.png'   },
      { id: 'tahoe_dusk',  name: 'Tahoe Beach Dusk',  image: 'assets/images/wallpapers/Tahoe/26-Tahoe-Beach-Dusk.png', thumb: 'assets/images/wallpapers/Tahoe/thumbs/26-Tahoe-Beach-Dusk_thumb.png'  },
      { id: 'tahoe_night', name: 'Tahoe Beach Night', image: 'assets/images/wallpapers/Tahoe/26-Tahoe-Beach-Night.png',thumb: 'assets/images/wallpapers/Tahoe/thumbs/26-Tahoe-Beach-Night_thumb.png' },
    ]
  }
];

import { WidgetsManager } from './widgets.js';
import { showNotification } from './notificationManager.js';
import { showMacAlert } from './macDialog.js';
import { moveToTrash, getMesaItems } from './apps/finder.js';

export const ALL_WALLPAPERS = WALLPAPER_GROUPS.flatMap(g => g.wallpapers);
export { WALLPAPER_GROUPS };

export class Desktop {
  constructor(wm, contextMenu) {
    this.el = document.getElementById('desktop');
    this.wm = wm;
    this.contextMenu = contextMenu;

    this.currentWallpaper = ALL_WALLPAPERS.find(w => w.id === 'custom_wallpaper') || ALL_WALLPAPERS[0];
    this._applyWallpaper(this.currentWallpaper.image);

    this._renderDesktopIcons();
    this._initDragSelection();
    this.widgetsManager = new WidgetsManager(this.el, wm);

    window.addEventListener('mesa:updated', () => this._renderDesktopIcons());

    this.useStacks = true;
    this.groupBy = 'tipo';

    if (this.el) {
      this.el.addEventListener('contextmenu', e => {
        if (e.target.closest('.desktop-icon') || e.target.closest('.window')) return;
        e.preventDefault();
        this.contextMenu.open(e.clientX, e.clientY, [
          { label: 'Nova Pasta', action: () => this.wm.openApp('finder', 'Finder') },
          { type: 'divider' },
          { label: 'Obter Informações', action: () => this.wm.openApp('settings', 'Ajustes do Sistema') },
          { label: 'Alterar Imagem de Fundo...', action: () => this.wm.openApp('settings', 'Ajustes do Sistema') },
          { label: 'Editar Widgets...', action: () => {} },
          { type: 'divider' },
          { 
            label: 'Usar Conjuntos', 
            checked: this.useStacks, 
            action: () => {
              this.useStacks = !this.useStacks;
            } 
          },
          { 
            label: 'Agrupar Conjuntos por', 
            submenu: [
              { label: 'Tipo', checked: this.groupBy === 'tipo', action: () => { this.groupBy = 'tipo'; } },
              { label: 'Data da Última Abertura', checked: this.groupBy === 'abertura', action: () => { this.groupBy = 'abertura'; } },
              { label: 'Data da Adição', checked: this.groupBy === 'adicao', action: () => { this.groupBy = 'adicao'; } },
              { label: 'Data de Modificação', checked: this.groupBy === 'modificacao', action: () => { this.groupBy = 'modificacao'; } },
              { label: 'Data de Criação', checked: this.groupBy === 'criacao', action: () => { this.groupBy = 'criacao'; } },
              { label: 'Etiquetas', checked: this.groupBy === 'etiquetas', action: () => { this.groupBy = 'etiquetas'; } },
            ] 
          },
          { label: 'Mostrar Opções de Visualização', action: () => {} },
          { type: 'divider' },
          { 
            label: 'Importar do iPhone', 
            submenu: [
              { label: 'iPhone de Mateus', disabled: true, isHeader: true },
              { label: 'Tirar Foto', action: () => {} },
              { label: 'Escanear Documentos', action: () => {} },
              { label: 'Adicionar Desenho', action: () => {} },
            ] 
          }
        ]);
      });
    }

    document.addEventListener('contextmenu', e => {
      if (e.shiftKey) return;
      if (!e.defaultPrevented) e.preventDefault();
    }, { capture: true });
  }

  _getSavedIconPositions() {
    try {
      const saved = localStorage.getItem('desktop_icon_positions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  _saveIconPosition(id, left, top) {
    const saved = this._getSavedIconPositions();
    saved[id] = { left, top };
    localStorage.setItem('desktop_icon_positions', JSON.stringify(saved));
  }

  _renderDesktopIcons() {
    const mesaItems = getMesaItems ? getMesaItems() : {};
    const desktopItemEntries = Object.entries(mesaItems);

    const activeIds = desktopItemEntries.map(([name, item]) => item.id || name.replace(/[^a-zA-Z0-9_-]/g, '_'));
    document.querySelectorAll('.desktop-icon').forEach(el => {
      if (!activeIds.includes(el.dataset.id)) {
        el.remove();
      }
    });

    const savedPositions = this._getSavedIconPositions();

    desktopItemEntries.forEach(([name, item], index) => {
      const itemId = item.id || name.replace(/[^a-zA-Z0-9_-]/g, '_');
      let wrapper = document.querySelector(`.desktop-icon[data-id="${itemId}"]`);
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'desktop-icon';
        wrapper.dataset.id = itemId;
        this.el.appendChild(wrapper);
      }
      wrapper.style.display = 'flex';

      const defaultLeft = window.innerWidth - 110;
      const defaultTop = window.innerHeight - 190 - (index * 90);
      let pos = savedPositions[itemId];
      if (!pos || pos.top < 350) {
        pos = { left: defaultLeft, top: defaultTop };
        this._saveIconPosition(itemId, pos.left, pos.top);
      }

      wrapper.style.cssText = `
        position: absolute;
        left: ${pos.left}px;
        top: ${pos.top}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        width: 84px;
        cursor: default;
        user-select: none;
        padding: 4px;
        border-radius: 8px;
        z-index: 10;
        touch-action: none;
      `;

      let iconHtml = '';
      if (item.type === 'folder') {
        iconHtml = `<img src="assets/icons/folders/default-folder.png" alt="${name}" draggable="false" style="width:60px;height:60px;object-fit:contain;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45));" />`;
      } else if (item.ext === 'pdf') {
        iconHtml = `<img src="assets/icons/documents/pdf-document.png" alt="${name}" draggable="false" style="width:60px;height:60px;object-fit:contain;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45));" />`;
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(item.ext) && item.url) {
        iconHtml = `<img src="${item.url}" alt="${name}" draggable="false" style="width:60px;height:60px;object-fit:cover;border-radius:6px;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45));" />`;
      } else {
        iconHtml = `<img src="assets/icons/documents/pdf-document.png" alt="${name}" draggable="false" style="width:60px;height:60px;object-fit:contain;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45));" />`;
      }

      wrapper.innerHTML = `
        <div class="desktop-icon-preview" style="display:flex;align-items:center;justify-content:center;width:68px;height:68px;border-radius:6px;transition:background 0.08s;">
          ${iconHtml}
        </div>
        <span class="desktop-icon-label" style="font-size:11px;font-weight:500;color:#fff;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,0.95),0 1px 8px rgba(0,0,0,0.6);padding:1px 5px;border-radius:4px;max-width:84px;word-break:break-word;line-height:1.3;font-family:-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;transition:background 0.08s;">${name}</span>
      `;

      wrapper.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();

        this._selectIcon(wrapper);

        const isImage = item.type === 'file' && ['png', 'jpg', 'jpeg', 'webp'].includes(item.ext);
        const menuItems = [
          {
            label: 'Abrir',
            action: () => {
              if (item.type === 'folder') {
                this.wm.openApp('finder', 'Finder');
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('finder:navigate', { detail: { path: ['~', 'Mesa', name] } }));
                }, 10);
              } else if (item.url) {
                window.open(item.url, '_blank');
              }
            }
          }
        ];

        if (item.url) {
          menuItems.push({
            label: 'Baixar',
            action: () => this._downloadFile(item.url, name)
          });
        } else {
          menuItems.push({ label: 'Abrir Com', disabled: true });
        }

        menuItems.push({ type: 'divider' });
        menuItems.push({
          label: 'Mover para o Lixo',
          action: () => {
            moveToTrash(name, item, ['~', 'Mesa']);
          }
        });
        menuItems.push({ type: 'divider' });
        menuItems.push({
          label: 'Obter Informações',
          action: () => {
            showMacAlert({
              messageText: name,
              informativeText: `Tipo: ${item.type === 'folder' ? 'Pasta' : (item.ext ? item.ext.toUpperCase() : 'Arquivo')}\nTamanho: ${item.size || '—'}\nModificado: Hoje\nLocal: Mesa`,
              buttons: ['OK']
            });
          }
        });
        menuItems.push({ label: 'Renomear', action: () => {} });
        menuItems.push({
          label: `Comprimir “${name.replace(/\.[^/.]+$/, '')}”`,
          action: () => {
            showNotification({
              title: 'Finder',
              desc: 'Criando arquivo compactado...',
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
            if (item.url) window.open(item.url, '_blank');
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
            action: () => this.setWallpaperUrl(item.url)
          });
        }

        this.contextMenu.open(e.clientX, e.clientY, menuItems);
      };

      const itemAction = () => {
        if (item.type === 'folder') {
          this.wm.openApp('finder', 'Finder');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('finder:navigate', { detail: { path: ['~', 'Mesa', name] } }));
          }, 10);
        } else if (item.url) {
          window.open(item.url, '_blank');
        }
      };

      this._makeIconDraggable(wrapper, itemId, itemAction);
    });

    this.el.onclick = e => {
      if (!e.target.closest('.desktop-icon')) {
        this._deselectAllIcons();
      }
    };
  }

  _deselectAllIcons() {
    document.querySelectorAll('.desktop-icon').forEach(i => {
      const prev = i.querySelector('.desktop-icon-preview');
      if (prev) prev.style.background = 'transparent';
      const lbl = i.querySelector('.desktop-icon-label');
      if (lbl) {
        lbl.style.background = 'transparent';
        lbl.style.textShadow = '0 1px 3px rgba(0,0,0,0.95),0 1px 8px rgba(0,0,0,0.6)';
      }
    });
  }

  _selectIcon(wrapper) {
    this._deselectAllIcons();
    const preview = wrapper.querySelector('.desktop-icon-preview');
    if (preview) preview.style.background = 'rgba(255, 255, 255, 0.18)';
    const label = wrapper.querySelector('.desktop-icon-label');
    if (label) {
      label.style.background = '#0063e1';
      label.style.textShadow = 'none';
    }
  }

  _downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  _makeIconDraggable(wrapper, itemId, action) {
    let isMouseDown = false;
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const onMouseDown = e => {
      if (e.button !== 0) return;
      e.stopPropagation();

      isMouseDown = true;
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = wrapper.offsetLeft;
      initialTop = wrapper.offsetTop;

      this._selectIcon(wrapper);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = e => {
      if (!isMouseDown) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!isDragging && Math.hypot(dx, dy) > 4) {
        isDragging = true;
        wrapper.style.zIndex = '100';
        wrapper.style.opacity = '0.85';
        wrapper.style.cursor = 'grabbing';
      }

      if (isDragging) {
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        const maxLeft = window.innerWidth - 84;
        const maxTop = window.innerHeight - 100;
        newLeft = Math.max(10, Math.min(maxLeft, newLeft));
        newTop = Math.max(36, Math.min(maxTop, newTop));

        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
      }
    };

    const onMouseUp = e => {
      if (!isMouseDown) return;
      isMouseDown = false;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      wrapper.style.opacity = '1';
      wrapper.style.zIndex = '10';
      wrapper.style.cursor = 'pointer';

      if (isDragging) {
        this._saveIconPosition(itemId, wrapper.offsetLeft, wrapper.offsetTop);
      }
    };

    wrapper.addEventListener('mousedown', onMouseDown);

    let lastClickTime = 0;
    wrapper.addEventListener('click', e => {
      e.stopPropagation();
      if (isDragging) return;
      const currentTime = new Date().getTime();
      if (currentTime - lastClickTime < 300) {
        if (action) action();
      }
      lastClickTime = currentTime;
    });
  }

  _alignIconsToGrid() {
    const icons = document.querySelectorAll('.desktop-icon');
    const gridX = window.innerWidth - 100;
    icons.forEach((icon, index) => {
      const id = icon.dataset.id;
      const top = 45 + (index * 110);
      icon.style.left = `${gridX}px`;
      icon.style.top = `${top}px`;
      if (id) this._saveIconPosition(id, gridX, top);
    });
  }

  _initDragSelection() {
    let isDragging = false;
    let startX = 0, startY = 0;
    let boxEl = null;

    this.el.addEventListener('mousedown', e => {
      if (e.target !== this.el && !e.target.classList.contains('desktop')) return;
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      boxEl = document.createElement('div');
      boxEl.className = 'selection-box';
      boxEl.style.cssText = 'position:fixed;border:1px solid rgba(0,122,255,0.7);background:rgba(0,122,255,0.18);border-radius:4px;pointer-events:none;z-index:90;';
      document.body.appendChild(boxEl);
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging || !boxEl) return;
      const currentX = e.clientX;
      const currentY = e.clientY;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      boxEl.style.left = `${left}px`;
      boxEl.style.top = `${top}px`;
      boxEl.style.width = `${width}px`;
      boxEl.style.height = `${height}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (boxEl) { boxEl.remove(); boxEl = null; }
      }
    });
  }

  setWallpaper(wallpaperId) {
    const wp = ALL_WALLPAPERS.find(w => w.id === wallpaperId);
    if (!wp) return;
    this.currentWallpaper = wp;
    this._applyWallpaper(wp.image);
    localStorage.setItem('wallpaper', wallpaperId);
  }

  setWallpaperUrl(url) {
    this._applyWallpaper(url);
    localStorage.setItem('custom_wallpaper_url', url);
  }

  _applyWallpaper(url) {
    if (this.el) {
      this.el.style.backgroundImage = `url('${url}')`;
      this.el.style.backgroundSize = 'cover';
      this.el.style.backgroundPosition = 'center';
    }
  }

  restoreWallpaper() {
    const customUrl = localStorage.getItem('custom_wallpaper_url');
    if (customUrl) {
      this.setWallpaperUrl(customUrl);
      return;
    }
    const saved = localStorage.getItem('wallpaper');
    if (saved) this.setWallpaper(saved);
  }
}
