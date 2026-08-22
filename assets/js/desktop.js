const WALLPAPER_GROUPS = [
  {
    id: 'dynamic',
    title: 'Imagens de Fundo Dinâmicas',
    totalCount: 33,
    badgeType: 'dynamic',
    wallpapers: [
      { id: 'dyn_sequoia', name: 'Sequoia', image: 'assets/images/wallpapers/dynamic/sequoia.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/sequoia.jpg' },
      { id: 'dyn_macintosh', name: 'Macintosh', image: 'assets/images/wallpapers/dynamic/macintosh.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/macintosh.jpg' },
      { id: 'dyn_sonoma', name: 'Sonoma', image: 'assets/images/wallpapers/dynamic/sonoma.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/sonoma.jpg' },
      { id: 'dyn_ventura', name: 'Ventura', image: 'assets/images/wallpapers/dynamic/ventura.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/ventura.jpg' },
      { id: 'dyn_monterey', name: 'Monterey', image: 'assets/images/wallpapers/dynamic/monterey.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/monterey.jpg' },
      { id: 'dyn_bigsur', name: 'Big Sur', image: 'assets/images/wallpapers/dynamic/big-sur.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/big-sur.jpg' },
      { id: 'dyn_catalina', name: 'Catalina', image: 'assets/images/wallpapers/dynamic/catalina.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/catalina.jpg' },
      { id: 'dyn_cliffs', name: 'Os Penhascos', image: 'assets/images/wallpapers/dynamic/os-penhascos.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/os-penhascos.jpg' },
      { id: 'dyn_lake', name: 'O Lago', image: 'assets/images/wallpapers/dynamic/o-lago.jpg', thumb: 'assets/images/wallpapers/dynamic/thumbs/o-lago.jpg' }
    ]
  },
  {
    id: 'landscape',
    title: 'Paisagem',
    totalCount: 64,
    badgeType: 'video',
    wallpapers: [
      { id: 'land_sequoia_sunrise', name: 'Sequoia ao Amanhecer', image: 'assets/images/wallpapers/landscape/sequoia-ao-amanhecer.jpg', thumb: 'assets/images/wallpapers/landscape/thumbs/sequoia-ao-amanhecer.jpg' },
      { id: 'land_sequoia_morning', name: 'Sequoia de Manhã', image: 'assets/images/wallpapers/landscape/sequoia-de-manha.jpg', thumb: 'assets/images/wallpapers/landscape/thumbs/sequoia-de-manha.jpg' },
      { id: 'land_sequoia_night', name: 'Sequoia à Noite', image: 'assets/images/wallpapers/landscape/sequoia-a-noite.jpg', thumb: 'assets/images/wallpapers/landscape/thumbs/sequoia-a-noite.jpg' },
      { id: 'land_sonoma_horizon', name: 'Horizonte de Sonoma', image: 'assets/images/wallpapers/landscape/horizonte-de-sonoma.jpg', thumb: 'assets/images/wallpapers/landscape/thumbs/horizonte-de-sonoma.jpg', arrow: true },
      { id: 'land_sonoma_night', name: 'Sonoma à Noite', image: 'assets/images/wallpapers/landscape/sonoma-a-noite.jpg', thumb: 'assets/images/wallpapers/landscape/thumbs/sonoma-a-noite.jpg', arrow: true },
      { id: 'land_sonoma_clouds', name: 'Nuvens de Sonoma', image: 'assets/images/wallpapers/landscape/nuvens-de-sonoma.png', thumb: 'assets/images/wallpapers/landscape/thumbs/nuvens-de-sonoma.png', arrow: true },
      { id: 'land_sonoma_above', name: 'Sonoma de Cima', image: 'assets/images/wallpapers/landscape/sonoma-de-cima.png', thumb: 'assets/images/wallpapers/landscape/thumbs/sonoma-de-cima.png', arrow: true },
      { id: 'land_sonoma_river', name: 'Rio em Sonoma', image: 'assets/images/wallpapers/landscape/rio-em-sonoma.png', thumb: 'assets/images/wallpapers/landscape/thumbs/rio-em-sonoma.png', arrow: true },
      { id: 'land_temblor', name: 'Cordilheira de Temblor, Califórnia', image: 'assets/images/wallpapers/landscape/cordilheira-de-temblor.png', thumb: 'assets/images/wallpapers/landscape/thumbs/cordilheira-de-temblor.png', arrow: true }
    ]
  },
  {
    id: 'cityscape',
    title: 'Paisagem urbana',
    totalCount: 30,
    badgeType: 'video',
    wallpapers: [
      { id: 'city_dubai_skyline', name: 'Linha do Horizonte de Dubai', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_dubai_night', name: 'Dubai à Noite', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_dubai_creek', name: 'Dubai Creek', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_dubai_above', name: 'Dubai de Cima', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_dubai_harbor', name: 'Porto de Dubai Creek', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_la_overpass', name: 'Viaduto de Los Angeles', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_la_beach', name: 'Praia de Los Angeles', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_la_airport', name: 'Aeroporto de Los Angeles', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'city_la_sunset', name: 'Pôr do Sol em Los Angeles', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true }
    ]
  },
  {
    id: 'underwater',
    title: 'Subaquático',
    totalCount: 21,
    badgeType: 'video',
    wallpapers: [
      { id: 'under_jellyfish_light', name: 'Medusas do Alasca (Claro)', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_jellyfish_dark', name: 'Medusas do Alasca (Escuro)', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_dolphins', name: 'Grupo de Golfinhos da Califórnia', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_kelp', name: 'Floresta de Algas da Califórnia', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_tahiti_coast', name: 'Costa do Tahiti', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_tahiti_mist', name: 'Bruma de Ondas do Tahiti', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_seal_pod', name: 'Grupo de Focas', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_palau_coral', name: 'Coral de Palau (Colorido)', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'under_barracuda', name: 'Cardume de Barracudas', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true }
    ]
  },
  {
    id: 'earth',
    title: 'Terra',
    totalCount: 22,
    badgeType: 'video',
    wallpapers: [
      { id: 'earth_mideast', name: 'Oriente Médio', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'earth_north_africa', name: 'Norte da África', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'earth_caribbean', name: 'Caribe', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'earth_aurora', name: 'Aurora Austral', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'earth_north_atlantic', name: 'Atlântico Norte', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'earth_europe_night', name: 'Europa à Noite', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'earth_caribbean_islands', name: 'Ilhas do Caribe', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'earth_caribbean_sea', name: 'Mar do Caribe', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'earth_west_africa', name: 'África Ocidental', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true }
    ]
  },
  {
    id: 'abstract',
    title: 'Imagens',
    totalCount: 41,
    badgeType: 'none',
    wallpapers: [
      { id: 'img_teal_radial', name: 'Azul-celeste Radial', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'img_blue_radial', name: 'Azul Radial', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'img_green_radial', name: 'Verde Radial', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'img_purple_radial', name: 'Roxo Radial', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'img_yellow_radial', name: 'Amarelo Radial', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png', arrow: true },
      { id: 'img_silver_imac', name: 'iMac Prateado', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'img_blue_imac', name: 'iMac Azul', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'img_purple_imac', name: 'iMac Roxo', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' },
      { id: 'img_pink_imac', name: 'iMac Rosa', image: 'assets/images/wallpapers/placeholder.png', thumb: 'assets/images/wallpapers/placeholder.png' }
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

    const saved = localStorage.getItem('wallpaper');
    const found = saved ? ALL_WALLPAPERS.find(w => w.id === saved) : null;
    this.currentWallpaper = found || ALL_WALLPAPERS.find(w => w.id === 'land_sequoia_sunrise') || ALL_WALLPAPERS[0];
    if (this.currentWallpaper && this.currentWallpaper.image) {
      this._applyWallpaper(this.currentWallpaper.image);
    }

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

      const WIDGET_AREA_BOTTOM = 530;
      const defaultLeft = window.innerWidth - 110;
      const defaultTop = WIDGET_AREA_BOTTOM + (index * 110);
      let pos = savedPositions[itemId];
      if (!pos) {
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
    if (wp.image) {
      this._applyWallpaper(wp.image);
    }
    localStorage.setItem('wallpaper', wallpaperId);
    window.dispatchEvent(new CustomEvent('wallpaper:changed', { detail: { wallpaper: wp } }));
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
