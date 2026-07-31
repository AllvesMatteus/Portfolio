/**
 * MenuBar — top macOS menu bar with clock, dropdowns and Control Center
 * Ports MenuBar.jsx to vanilla JS
 */

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
  Histórico: [
    { id: 'back', label: 'Voltar', shortcut: '⌘[' },
    { id: 'forward', label: 'Avançar', shortcut: '⌘]' },
    { id: 'reopen-tab', label: 'Reabrir Última Aba Fechada', shortcut: '⇧⌘T' },
  ],
  Favoritos: [
    { id: 'add-bookmark', label: 'Adicionar Favorito…', shortcut: '⌘D' },
    { id: 'show-bookmarks', label: 'Mostrar Todos os Favoritos', shortcut: '⌥⌘B' },
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
  constructor(wm, themeManager) {
    this.wm = wm;
    this.themeManager = themeManager;
    this.activeMenu = null;
    this.currentAppName = 'Finder';

    // State
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

    // Close menus on outside click
    document.addEventListener('mousedown', e => {
      const bar = document.getElementById('menubar');
      if (bar && !bar.contains(e.target)) this._closeAll();
    });

    // Track active window name
    wm.onChange(({ activeWin }) => {
      this.currentAppName = activeWin
        ? activeWin.charAt(0).toUpperCase() + activeWin.slice(1)
        : 'Finder';
      const el = document.getElementById('menubar-appname');
      if (el) el.textContent = this.currentAppName;
      this._updateAppMenuDropdown();
    });
  }

  // ── Clock ─────────────────────────────────────────────────────────────
  _initClock() {
    const clockEl = document.getElementById('menubar-clock');
    if (!clockEl) return;

    const update = () => {
      const now = new Date();
      const days = ['dom','seg','ter','qua','qui','sex','sáb'];
      const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
      const day = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = hours % 12 || 12;
      clockEl.textContent = `${day} ${date} de ${month} ${h12}:${mins} ${ampm}`;
    };
    update();
    setInterval(update, 1000);
  }

  // ── Menu dropdowns ─────────────────────────────────────────────────────
  _initMenus() {
    const allMenuKeys = ['apple', 'appname', ...Object.keys(MENU_OPTIONS).map(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))];

    allMenuKeys.forEach(key => {
      const wrapper = document.getElementById(key === 'apple' ? 'menubar-apple' : `menubar-${key}-wrapper`);
      const overlay = document.getElementById(key === 'apple' ? 'menubar-apple-overlay' : `menubar-${key}-overlay`);
      const dropdown = document.getElementById(`menubar-${key}-dropdown`);

      if (!wrapper || !overlay || !dropdown) return;

      // Populate content
      if (key === 'apple') {
        this._populateAppleMenu(dropdown);
      } else if (key === 'appname') {
        this._updateAppMenuDropdown();
      } else {
        const origKey = Object.keys(MENU_OPTIONS).find(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === key);
        if (origKey) this._populateMenu(dropdown, MENU_OPTIONS[origKey]);
      }

      // Click to toggle
      overlay.addEventListener('click', e => {
        e.stopPropagation();
        this._toggleMenu(key);
      });

      // HIG Behavior: Hover to switch menu when any menu is open
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
    if (cc) cc.style.display = 'none';
    this.state.ccOpen = false;
  }

  // ── Control Center ────────────────────────────────────────────────────
  _initCC() {
    const ccBtn = document.getElementById('menubar-cc-btn');
    if (!ccBtn) return;

    ccBtn.addEventListener('click', e => {
      e.stopPropagation();
      this.state.ccOpen = !this.state.ccOpen;
      if (this.state.ccOpen) {
        this._renderCC();
      } else {
        const cc = document.getElementById('control-center');
        if (cc) cc.style.display = 'none';
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

    cc.style.cssText = `
      display: block;
      position: fixed;
      top: 32px;
      right: 8px;
      z-index: 9000;
    `;

    const s = this.state;

    cc.innerHTML = `
      <div class="cc-now-context">
        <span class="cc-context-icon" style="display:flex;align-items:center;">
          ${getSFSymbolHtml('camera.fill', { size: 13 })}
        </span>
        <span style="font-weight:500;">Captura de Tela recentemente</span>
      </div>

      <div class="cc-grid-main">
        <div class="cc-card cc-card--connectivity">
          <div class="cc-conn-item" id="cc-wifi">
            <div class="cc-icon-circle ${s.wifi ? 'active-blue' : ''}" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('wifi', { size: 14 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">Wi-Fi</span>
              <span class="cc-label-sub">${s.wifi ? 'Edson' : 'Desativado'}</span>
            </div>
          </div>
          <div class="cc-conn-item" id="cc-bluetooth">
            <div class="cc-icon-circle ${s.bluetooth ? 'active-blue' : ''}" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('bluetooth', { size: 14 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">Bluetooth</span>
              <span class="cc-label-sub">${s.bluetooth ? 'Ativado' : 'Desativado'}</span>
            </div>
          </div>
          <div class="cc-conn-item" id="cc-airdrop">
            <div class="cc-icon-circle ${s.airdrop ? 'active-blue' : ''}" style="display:flex;align-items:center;justify-content:center;">
              ${getSFSymbolHtml('airdrop', { size: 14 })}
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
              ${getSFSymbolHtml('moon.fill', { size: 14 })}
            </div>
            <span class="cc-label-main">Foco</span>
          </button>
          <div class="cc-utilities-row">
            <button class="cc-utility-square ${s.stageManager ? 'active-opaque' : ''}" id="cc-stage">
              ${getSFSymbolHtml('rectangle.grid.1x2.fill', { size: 16 })}
              <span class="cc-utility-label">Organiz.<br/>Visual</span>
            </button>
            <button class="cc-utility-square ${s.screenMirror ? 'active-opaque' : ''}" id="cc-mirror">
              ${getSFSymbolHtml('desktopcomputer', { size: 16 })}
              <span class="cc-utility-label">Espelham.<br/>de Tela</span>
            </button>
          </div>
        </div>
      </div>

      <div class="cc-card cc-card--slider-wrapper">
        <div class="cc-slider-header" style="display:flex;align-items:center;gap:6px;">
          ${getSFSymbolHtml('sun.max.fill', { size: 12 })}
          <span class="cc-slider-title">Tela</span>
        </div>
        <div class="cc-slider-track">
          <input type="range" class="cc-slider-input" id="cc-brightness" min="0" max="100" value="${s.brightness}" aria-label="Tela" />
        </div>
      </div>

      <div class="cc-card cc-card--slider-wrapper">
        <div class="cc-slider-header" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
          <div style="display:flex;align-items:center;gap:6px;">
            ${getSFSymbolHtml('speaker.wave.3.fill', { size: 12 })}
            <span class="cc-slider-title">Som</span>
          </div>
          ${getSFSymbolHtml('airplayaudio', { size: 12 })}
        </div>
        <div class="cc-slider-track">
          <input type="range" class="cc-slider-input" id="cc-volume" min="0" max="100" value="${s.volume}" aria-label="Som" />
        </div>
      </div>

      <div class="cc-card cc-media-player" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:6px;background:#FF2D55;display:flex;align-items:center;justify-content:center;">
            ${getSFSymbolHtml('music.note', { size: 16, isDark: false })}
          </div>
          <span style="font-weight:600;font-size:13px;">Música</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;opacity:0.8;">
          <span style="cursor:pointer;font-size:14px;">▶</span>
          <span style="cursor:pointer;font-size:14px;">▶▶</span>
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
    cc.querySelector('#cc-brightness')?.addEventListener('input', e => { s.brightness = +e.target.value; });
    cc.querySelector('#cc-volume')?.addEventListener('input', e => { s.volume = +e.target.value; });
  }

  // ── About This Mac ─────────────────────────────────────────────────────
  _showAbout() {
    const container = document.getElementById('about-this-mac');
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML = `
      <div class="atm-overlay" id="atm-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);z-index:10000;display:flex;align-items:center;justify-content:center;">
        <div class="atm-window app-window app-window--active" style="width:350px;padding:20px 22px 14px 22px;border-radius:14px;background:#474747;color:#ffffff;box-shadow:0 25px 60px rgba(0,0,0,0.65);border:1px solid rgba(255,255,255,0.18);display:flex;flex-direction:column;align-items:center;position:relative;">
          
          <div class="atm-titlebar" style="position:absolute;top:12px;left:14px;display:flex;align-items:center;gap:8px;">
            <button class="app-window__btn app-window__btn--close traffic-light traffic-close" id="atm-close" aria-label="Fechar" title="Fechar"></button>
            <button class="app-window__btn traffic-light nofocus" disabled style="background:#666 !important;border-color:#555 !important;"></button>
            <button class="app-window__btn traffic-light nofocus" disabled style="background:#666 !important;border-color:#555 !important;"></button>
          </div>

          <!-- MacBook Pro Graphic -->
          <div style="margin-top:10px;margin-bottom:14px;display:flex;justify-content:center;">
            <svg viewBox="0 0 200 110" width="150" height="82" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="4" width="150" height="92" rx="6" fill="#1e1e1e" stroke="#555" stroke-width="1.5"/>
              <rect x="30" y="9" width="140" height="82" rx="2" fill="#3B99FC"/>
              <rect x="25" y="92" width="150" height="6" fill="#181818"/>
              <path d="M12 98 L188 98 L198 106 L2 106 Z" fill="#b5b5b5" stroke="#777" stroke-width="1"/>
              <rect x="85" y="98" width="30" height="3" rx="1.5" fill="#666"/>
            </svg>
          </div>

          <div style="font-size:21px;font-weight:700;margin-bottom:2px;letter-spacing:-0.2px;">MacBook Pro</div>
          <div style="font-size:11px;opacity:0.65;margin-bottom:18px;text-align:center;">13-inch, 2018, Four Thunderbolt 3 Ports</div>

          <div style="width:100%;font-size:11.5px;line-height:1.75;margin-bottom:18px;padding:0 4px;">
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <span style="font-weight:600;opacity:0.9;white-space:nowrap;">Processador</span>
              <span style="opacity:0.85;text-align:right;">2,7 GHz Intel Core i7 Quad-Core</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <span style="font-weight:600;opacity:0.9;white-space:nowrap;">Gráficos</span>
              <span style="opacity:0.85;text-align:right;">Intel Iris Plus Graphics 655 1536 MB</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <span style="font-weight:600;opacity:0.9;white-space:nowrap;">Memória</span>
              <span style="opacity:0.85;text-align:right;">16 GB 2133 MHz LPDDR3</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <span style="font-weight:600;opacity:0.9;white-space:nowrap;">Número de série</span>
              <span style="opacity:0.85;text-align:right;">C02XL18SJHD4</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <span style="font-weight:600;opacity:0.9;white-space:nowrap;">macOS</span>
              <span style="opacity:0.85;text-align:right;">Sequoia 15.7.7</span>
            </div>
          </div>

          <button style="background:rgba(255,255,255,0.22);border:1px solid rgba(255,255,255,0.28);color:#fff;border-radius:14px;padding:5px 20px;font-size:12px;font-weight:500;cursor:pointer;margin-bottom:14px;transition:background 0.15s;">
            Mais Informações...
          </button>

          <div style="font-size:10.5px;opacity:0.55;text-decoration:underline;cursor:pointer;margin-bottom:4px;">
            Certificação Reguladora
          </div>
          <div style="font-size:9.5px;opacity:0.4;text-align:center;">
            ™ e © 1983-2026 Apple Inc. Todos os Direitos Reservados.
          </div>

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
