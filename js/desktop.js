/**
 * Desktop — background wallpaper management and desktop context menu
 */

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

export const ALL_WALLPAPERS = WALLPAPER_GROUPS.flatMap(g => g.wallpapers);
export { WALLPAPER_GROUPS };

export class Desktop {
  constructor(wm, contextMenu, themeManager) {
    this.el = document.getElementById('desktop');
    this.wm = wm;
    this.contextMenu = contextMenu;
    this.themeManager = themeManager;

    // Default wallpaper (Classic Wallpaper)
    this.currentWallpaper = ALL_WALLPAPERS.find(w => w.id === 'custom_wallpaper') || ALL_WALLPAPERS[0];
    this._applyWallpaper(this.currentWallpaper.image);

    // Sync wallpaper with theme on start
    themeManager.onChange(isLight => {
      if (this.currentWallpaper?.id === 'tahoe_dark' || this.currentWallpaper?.id === 'tahoe_light') {
        const wp = isLight
          ? ALL_WALLPAPERS.find(w => w.id === 'tahoe_light')
          : ALL_WALLPAPERS.find(w => w.id === 'tahoe_dark');
        if (wp) this.setWallpaper(wp.id);
      }
    });

    // Render desktop icons
    this._renderDesktopIcons();

    // Marquee drag selection box
    this._initDragSelection();

    // Right-click context menu on desktop (in Portuguese)
    if (this.el) {
      this.el.addEventListener('contextmenu', e => {
        if (e.target.closest('.desktop-icon') || e.target.closest('.window')) return;
        e.preventDefault();
        this.contextMenu.open(e.clientX, e.clientY, [
          { label: 'Nova Pasta', action: () => this.wm.openApp('finder', 'Finder') },
          { type: 'divider' },
          { label: 'Obter Informações', action: () => this.wm.openApp('settings', 'Ajustes') },
          { label: 'Alterar Papel de Parede…', action: () => this.wm.openApp('settings', 'Ajustes') },
          { label: 'Editar Widgets…', action: () => {} },
          { type: 'divider' },
          { label: 'Usar Conjuntos', action: () => {} },
          { label: 'Organizar Por', submenu: true, action: () => {} },
          { label: 'Limpar', action: () => {} },
          { type: 'divider' },
          { label: 'Mostrar Opções de Visualização', action: () => {} },
        ]);
      });
    }

    // Prevent context menu on shift+right-click (like original)
    document.addEventListener('contextmenu', e => {
      if (e.shiftKey) return;
      if (!e.defaultPrevented) e.preventDefault();
    }, { capture: true });
  }

  _renderDesktopIcons() {
    let iconsContainer = document.getElementById('desktop-icons-grid');
    if (!iconsContainer) {
      iconsContainer = document.createElement('div');
      iconsContainer.id = 'desktop-icons-grid';
      iconsContainer.style.cssText = 'position:absolute;top:40px;right:20px;display:flex;flex-direction:column;gap:20px;z-index:10;pointer-events:auto;';
      this.el.appendChild(iconsContainer);
    }

    const DESKTOP_ITEMS = [
      { id: 'mac-hd', name: 'Macintosh HD', icon: '💻', action: () => this.wm.openApp('finder', 'Finder') },
      { id: 'docs', name: 'Documentos', icon: '📁', action: () => this.wm.openApp('finder', 'Finder') },
      { id: 'trash', name: 'Lixeira', icon: '🗑️', action: () => this.wm.openApp('finder', 'Finder') },
      { id: 'github', name: 'GitHub Repo', icon: '🌐', action: () => window.open('https://github.com/gaminghackintosh/macweb.dev', '_blank') },
    ];

    iconsContainer.innerHTML = DESKTOP_ITEMS.map(item => `
      <div class="desktop-icon" data-id="${item.id}" style="display:flex;flex-direction:column;align-items:center;gap:4px;width:80px;cursor:pointer;user-select:none;padding:6px;border-radius:8px;transition:background 0.15s;">
        <div style="font-size:38px;line-height:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));">${item.icon}</div>
        <span style="font-size:11px;font-weight:500;color:#fff;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,0.9);background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;">${item.name}</span>
      </div>
    `).join('');

    iconsContainer.querySelectorAll('.desktop-icon').forEach(el => {
      const item = DESKTOP_ITEMS.find(i => i.id === el.dataset.id);
      if (!item) return;

      el.addEventListener('click', e => {
        e.stopPropagation();
        iconsContainer.querySelectorAll('.desktop-icon').forEach(i => i.style.background = 'none');
        el.style.background = 'rgba(255,255,255,0.2)';
      });

      el.addEventListener('dblclick', e => {
        e.stopPropagation();
        item.action();
      });
    });
  }

  _initDragSelection() {
    let isDragging = false;
    let startX = 0, startY = 0;
    let boxEl = null;

    this.el.addEventListener('mousedown', e => {
      if (e.target !== this.el && !e.target.classList.contains('desktop-icon')) return;
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

  _applyWallpaper(url) {
    if (this.el) {
      this.el.style.backgroundImage = `url('${url}')`;
      this.el.style.backgroundSize = 'cover';
      this.el.style.backgroundPosition = 'center';
    }
  }

  restoreWallpaper() {
    const saved = localStorage.getItem('wallpaper');
    if (saved) this.setWallpaper(saved);
  }
}
