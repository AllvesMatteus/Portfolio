import { getSFSymbolHtml } from './sfSymbols.js';

const APPLE_MENU_OPTIONS = [
  { id: 'about', label: 'Sobre este Mac' },
  { type: 'divider' },
  { id: 'settings', label: 'Ajustes do Sistema…' },
  { id: 'appstore', label: 'App Store…' },
  { type: 'divider' },
  { id: 'recent', label: 'Itens Recentes' },
  { type: 'divider' },
  { id: 'force', label: 'Forçar Encerramento…', shortcut: '⌥⌘⎋' },
  { type: 'divider' },
  { id: 'sleep', label: 'Repousar' },
  { id: 'restart', label: 'Reiniciar…' },
  { id: 'shutdown', label: 'Desligar…' },
  { type: 'divider' },
  { id: 'lock', label: 'Bloquear Tela', shortcut: '⌃⌘Q' },
  { id: 'logout', label: 'Encerrar Sessão mateus…', shortcut: '⇧⌘Q' },
];

const MENU_OPTIONS = {
  Arquivo: [
    { id: 'new-win', label: 'Nova Janela', shortcut: '⌘N' },
    { id: 'new-tab', label: 'Nova Aba', shortcut: '⌘T' },
    { id: 'open', label: 'Abrir Arquivo…', shortcut: '⌘O' },
    { type: 'divider' },
    { id: 'close-win', label: 'Fechar Janela', shortcut: '⌘W' },
    { id: 'save', label: 'Salvar', shortcut: '⌘S' },
  ],
  Editar: [
    { id: 'undo', label: 'Desfazer', shortcut: '⌘Z' },
    { id: 'redo', label: 'Refazer', shortcut: '⇧⌘Z' },
    { type: 'divider' },
    { id: 'cut', label: 'Recortar', shortcut: '⌘X' },
    { id: 'copy', label: 'Copiar', shortcut: '⌘C' },
    { id: 'paste', label: 'Colar', shortcut: '⌘V' },
    { id: 'select-all', label: 'Selecionar Tudo', shortcut: '⌘A' },
  ],
  Visualizar: [
    { id: 'toggle-sidebar', label: 'Mostrar Barra Lateral', shortcut: '⌃⌘S' },
    { id: 'toggle-path', label: 'Mostrar Barra de Caminho' },
    { type: 'divider' },
    { id: 'zoom-in', label: 'Ampliar Zoom', shortcut: '⌘+' },
    { id: 'zoom-out', label: 'Reduzir Zoom', shortcut: '⌘-' },
    { id: 'actual-size', label: 'Tamanho Real', shortcut: '⌘0' },
    { type: 'divider' },
    { id: 'fullscreen', label: 'Entrar em Tela Cheia', shortcut: '⌃⌘F' },
  ],
  Desenvolvedor: [
    { id: 'inspect', label: 'Inspecionar Elemento', shortcut: '⌥⌘I' },
    { id: 'console', label: 'Console JavaScript', shortcut: '⌥⌘J' },
    { id: 'source', label: 'Exibir Código-Fonte', shortcut: '⌥⌘U' },
  ],
  Janela: [
    { id: 'minimize', label: 'Minimizar', shortcut: '⌘M' },
    { id: 'zoom', label: 'Zoom' },
    { type: 'divider' },
    { id: 'front', label: 'Trazer Todas para a Frente' },
  ],
  Ajuda: [
    { id: 'search-help', label: 'Buscar' },
    { type: 'divider' },
    { id: 'mac-help', label: 'Ajuda do macOS' },
  ],
};

export class MenuBar {
  constructor(wm) {
    this.wm = wm;
    this.activeMenu = null;
    this.currentAppName = 'Finder';

    this.state = {
      wifi: true, bluetooth: true, airdrop: true,
      focus: false, stageManager: false, screenMirror: false,
      brightness: 75, volume: 55,
      ccOpen: false,
      aboutOpen: false,
    };

    this._initClock();
    this._initMenus();
    this._initCC();

    document.addEventListener('mousedown', e => {
      const bar = document.getElementById('menubar');
      const cc = document.getElementById('control-center');
      if (bar && !bar.contains(e.target) && cc && !cc.contains(e.target)) {
        this._closeAll();
      }
    });

    wm.onChange(({ activeWin }) => {
      this.currentAppName = activeWin
        ? activeWin.charAt(0).toUpperCase() + activeWin.slice(1)
        : 'Finder';
      const el = document.getElementById('menubar-appname');
      if (el) el.textContent = this.currentAppName;
      this._updateAppMenuDropdown();
    });
  }

  _initClock() {
    const clockEl = document.getElementById('menubar-clock');
    if (!clockEl) return;

    const update = () => {
      const now = new Date();
      const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
      const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
      const day = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${day}. ${date} de ${month}. ${hours}:${mins}`;
    };
    update();
    setInterval(update, 1000);
  }

  _initMenus() {
    const allMenuKeys = ['apple', 'appname', ...Object.keys(MENU_OPTIONS).map(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))];

    allMenuKeys.forEach(key => {
      const wrapper = document.getElementById(key === 'apple' ? 'menubar-apple' : `menubar-${key}-wrapper`);
      const overlay = document.getElementById(key === 'apple' ? 'menubar-apple-overlay' : `menubar-${key}-overlay`);
      const dropdown = document.getElementById(`menubar-${key}-dropdown`);

      if (!wrapper || !overlay || !dropdown) return;

      if (key === 'apple') {
        this._populateAppleMenu(dropdown);
      } else if (key === 'appname') {
        this._updateAppMenuDropdown();
      } else {
        const origKey = Object.keys(MENU_OPTIONS).find(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === key);
        if (origKey) this._populateMenu(dropdown, MENU_OPTIONS[origKey]);
      }

      overlay.addEventListener('click', e => {
        e.stopPropagation();
        this._toggleMenu(key);
      });

      wrapper.addEventListener('mouseenter', () => {
        if (this.activeMenu && this.activeMenu !== key) {
          this._openMenu(key);
        }
      });
    });
  }

  _updateAppMenuDropdown() {
    const dropdown = document.getElementById('menubar-appname-dropdown');
    if (!dropdown) return;

    const appName = this.currentAppName;
    const items = [
      { id: 'about-app', label: `Sobre o ${appName}` },
      { type: 'divider' },
      { id: 'app-settings', label: 'Configurações…', shortcut: '⌘,' },
      { type: 'divider' },
      { id: 'services', label: 'Serviços' },
      { type: 'divider' },
      { id: 'hide-app', label: `Ocultar ${appName}`, shortcut: '⌘H' },
      { id: 'hide-others', label: 'Ocultar Outros', shortcut: '⌥⌘H' },
      { id: 'show-all', label: 'Mostrar Tudo' },
      { type: 'divider' },
      { id: 'quit-app', label: `Encerrar ${appName}`, shortcut: '⌘Q' },
    ];

    this._populateMenu(dropdown, items);
  }

  _populateAppleMenu(dropdown) {
    dropdown.innerHTML = APPLE_MENU_OPTIONS.map(opt => {
      if (opt.type === 'divider') return `<div class="menuBar__dropdownDivider"></div>`;
      return `
        <div class="menuBar__dropdownItem" data-id="${opt.id}">
          <span class="menuBar__dropdownLabel">${opt.label}</span>
          ${opt.shortcut ? `<span class="menuBar__dropdownShortcut">${opt.shortcut}</span>` : ''}
        </div>
      `;
    }).join('');

    dropdown.querySelectorAll('.menuBar__dropdownItem').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        const id = item.dataset.id;
        this._closeAll();
        if (id === 'about') this._showAbout();
        if (id === 'settings') this.wm.openWindow('settings');
      });
    });
  }

  _populateMenu(dropdown, items) {
    dropdown.innerHTML = items.map(opt => {
      if (opt.type === 'divider') return `<div class="menuBar__dropdownDivider"></div>`;
      return `
        <div class="menuBar__dropdownItem" data-id="${opt.id}">
          <span class="menuBar__dropdownLabel">${opt.label}</span>
          ${opt.shortcut ? `<span class="menuBar__dropdownShortcut">${opt.shortcut}</span>` : ''}
        </div>
      `;
    }).join('');

    dropdown.querySelectorAll('.menuBar__dropdownItem').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        const id = item.dataset.id;
        this._closeAll();

        // Execute HIG window actions
        if (id === 'close-win' || id === 'quit-app') {
          if (this.wm.activeWinId) this.wm.closeWindow(this.wm.activeWinId);
        } else if (id === 'minimize' || id === 'hide-app') {
          if (this.wm.activeWinId) this.wm.minimizeWindow(this.wm.activeWinId);
        } else if (id === 'app-settings') {
          this.wm.openWindow('settings');
        } else if (id === 'new-win') {
          this.wm.openWindow(this.wm.activeWinId || 'finder');
        }
      });
    });
  }

  _toggleMenu(key) {
    if (this.activeMenu === key) {
      this._closeAll();
    } else {
      this._openMenu(key);
    }
  }

  _openMenu(key) {
    this._closeAll();
    this.activeMenu = key;

    const dropdown = document.getElementById(`menubar-${key}-dropdown`);
    if (dropdown) dropdown.style.display = 'block';

    const itemEl = key === 'apple'
      ? document.getElementById('menubar-apple-btn')
      : document.getElementById(key === 'appname' ? 'menubar-appname' : `menubar-${key}`);
    if (itemEl) itemEl.classList.add('isActive');
  }

  _closeAll() {
    this.activeMenu = null;
    document.querySelectorAll('.menuBar__dropdown').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.menuBar__item').forEach(i => i.classList.remove('isActive'));
    const cc = document.getElementById('control-center');
    if (cc) {
      cc.classList.remove('is-open');
      cc.style.display = 'none';
    }
    this.state.ccOpen = false;
  }

  // ── Control Center ────────────────────────────────────────────────────
  _initCC() {
    const ccBtn = document.getElementById('menubar-cc-btn');
    if (!ccBtn) return;

    ccBtn.addEventListener('click', e => {
      e.stopPropagation();
      this.state.ccOpen = !this.state.ccOpen;
      const cc = document.getElementById('control-center');
      if (this.state.ccOpen) {
        this._renderCC();
      } else {
        if (cc) {
          cc.classList.remove('is-open');
          cc.style.display = 'none';
        }
      }
    });
  }

  _renderCC() {
    let cc = document.getElementById('control-center');
    if (!cc) {
      cc = document.createElement('div');
      cc.id = 'control-center';
      cc.className = 'control-center';
      document.body.appendChild(cc);
    }

    cc.classList.add('is-open');
    cc.style.display = 'flex';
    cc.style.position = 'fixed';
    cc.style.top = '32px';
    cc.style.right = '8px';
    cc.style.zIndex = '9000';

    const s = this.state;

    cc.innerHTML = `
      <div class="cc-grid-main">
        <div class="cc-card cc-card--connectivity">
          <div class="cc-conn-item" id="cc-wifi">
            <div class="cc-icon-circle ${s.wifi ? 'active-blue' : ''}" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('wifi', { size: 16 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">Wi-Fi</span>
              ${!s.wifi ? '<span class="cc-label-sub">Desativado</span>' : ''}
            </div>
          </div>
          <div class="cc-conn-item" id="cc-bluetooth">
            <div class="cc-icon-circle ${s.bluetooth ? 'active-blue' : ''}" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('bluetooth', { size: 16 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">Bluetooth</span>
              <span class="cc-label-sub">${s.bluetooth ? 'Ativado' : 'Desativado'}</span>
            </div>
          </div>
          <div class="cc-conn-item" id="cc-airdrop">
            <div class="cc-icon-circle ${s.airdrop ? 'active-blue' : ''}" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('airdrop', { size: 16 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">AirDrop</span>
              <span class="cc-label-sub">${s.airdrop ? 'Apenas Contatos' : 'Desativado'}</span>
            </div>
          </div>
        </div>

        <div class="cc-right-column">
          <button class="cc-focus-row ${s.focus ? 'active-purple' : ''}" id="cc-focus">
            <div class="cc-icon-circle" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('moon.fill', { size: 16 })}
            </div>
            <span class="cc-label-main">Foco</span>
          </button>
          <div class="cc-utilities-row">
            <button class="cc-utility-square ${s.stageManager ? 'active-opaque' : ''}" id="cc-stage">
              ${getSFSymbolHtml('rectangle.grid.1x2.fill', { size: 18 })}
              <span class="cc-utility-label">Organiz.<br/>Visual</span>
            </button>
            <button class="cc-utility-square ${s.screenMirror ? 'active-opaque' : ''}" id="cc-mirror">
              ${getSFSymbolHtml('desktopcomputer', { size: 18 })}
              <span class="cc-utility-label">Espelham.<br/>de Tela</span>
            </button>
          </div>
        </div>
      </div>

      <div class="cc-card cc-card--slider-wrapper">
        <div class="cc-slider-title-row">
          <span class="cc-slider-title">Tela</span>
        </div>
        <div class="cc-slider-row">
          <div class="cc-slider-container">
            <div class="cc-slider-fill" id="cc-brightness-fill" style="width: ${s.brightness}%;"></div>
            <div class="cc-slider-icon-wrap">
              ${getSFSymbolHtml('sun.max.fill', { size: 16 })}
            </div>
            <input type="range" class="cc-slider-input" id="cc-brightness" min="0" max="100" value="${s.brightness}" aria-label="Tela" />
          </div>
        </div>
      </div>

      <div class="cc-card cc-card--slider-wrapper">
        <div class="cc-slider-title-row">
          <span class="cc-slider-title">Som</span>
        </div>
        <div class="cc-slider-row">
          <div class="cc-slider-container" style="flex:1;">
            <div class="cc-slider-fill" id="cc-volume-fill" style="width: ${s.volume}%;"></div>
            <div class="cc-slider-icon-wrap">
              ${getSFSymbolHtml(s.volume === 0 ? 'speaker.slash.fill' : 'speaker.3.fill', { size: 16 })}
            </div>
            <input type="range" class="cc-slider-input" id="cc-volume" min="0" max="100" value="${s.volume}" aria-label="Som" />
          </div>
          <button class="cc-airplay-btn" title="Saída de Áudio" id="cc-airplay">
            ${getSFSymbolHtml('airplayaudio', { size: 16 })}
          </button>
        </div>
      </div>
    `;

    // Bind events
    cc.querySelector('#cc-wifi')?.addEventListener('click', () => { s.wifi = !s.wifi; this._renderCC(); });
    cc.querySelector('#cc-bluetooth')?.addEventListener('click', () => { s.bluetooth = !s.bluetooth; this._renderCC(); });
    cc.querySelector('#cc-airdrop')?.addEventListener('click', () => { s.airdrop = !s.airdrop; this._renderCC(); });
    cc.querySelector('#cc-focus')?.addEventListener('click', () => { s.focus = !s.focus; this._renderCC(); });
    cc.querySelector('#cc-stage')?.addEventListener('click', () => { s.stageManager = !s.stageManager; this._renderCC(); });
    cc.querySelector('#cc-mirror')?.addEventListener('click', () => { s.screenMirror = !s.screenMirror; this._renderCC(); });
    cc.querySelector('#cc-brightness')?.addEventListener('input', e => {
      s.brightness = +e.target.value;
      const fill = cc.querySelector('#cc-brightness-fill');
      if (fill) fill.style.width = s.brightness + '%';
    });
    cc.querySelector('#cc-volume')?.addEventListener('input', e => {
      s.volume = +e.target.value;
      const fill = cc.querySelector('#cc-volume-fill');
      if (fill) fill.style.width = s.volume + '%';
    });
  }

  // ── About This Mac ─────────────────────────────────────────────────────
  _showAbout() {
    const container = document.getElementById('about-this-mac');
    if (!container) return;

    if (!window.macSerialNumber) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomPart = '';
      for (let i = 0; i < 9; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      window.macSerialNumber = 'C02' + randomPart;
    }

    container.style.display = 'block';
    container.innerHTML = `
      <div class="atm-overlay" id="atm-overlay">
        <div class="atm-window app-window app-window--active">

          <div class="atm-titlebar">
            <button class="app-window__btn app-window__btn--close traffic-light traffic-close" id="atm-close" aria-label="Fechar" title="Fechar"></button>
            <div class="atm-disabled-dot"></div>
            <div class="atm-disabled-dot"></div>
          </div>

          <img src="assets/icons/settings icons/Macbook-settings.png" alt="MacBook Pro" class="atm-mac-img" draggable="false" />

          <div class="atm-model-title">MacBook Pro</div>
          <div class="atm-model-subtitle">13-inch, 2018, Four Thunderbolt 3 Ports</div>

          <div class="atm-specs-grid">
            <div class="atm-spec-label">Processador</div>
            <div class="atm-spec-value">2,7 GHz Intel Core i7 Quad-Core</div>
            
            <div class="atm-spec-label">Gráficos</div>
            <div class="atm-spec-value">Intel Iris Plus Graphics 655 1536 MB</div>
            
            <div class="atm-spec-label">Memória</div>
            <div class="atm-spec-value">16 GB 2133 MHz LPDDR3</div>
            
            <div class="atm-spec-label">Número de série</div>
            <div class="atm-spec-value">${window.macSerialNumber}</div>
            
            <div class="atm-spec-label">macOS</div>
            <div class="atm-spec-value">Sequoia 15.7.7</div>
          </div>

          <button class="atm-info-btn">Mais Informações...</button>

          <div class="atm-reg-cert">Certificação Reguladora</div>
          <div class="atm-copyright">™ e © 1983-2026 Apple Inc.<br />Todos os Direitos Reservados.</div>

        </div>
      </div>
    `;

    document.getElementById('atm-close')?.addEventListener('click', () => {
      container.style.display = 'none';
      container.innerHTML = '';
    });
    document.getElementById('atm-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'atm-overlay') { container.style.display = 'none'; container.innerHTML = ''; }
    });
  }
}
