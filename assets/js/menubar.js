import { getSFSymbolHtml } from './sfSymbols.js';
import { showNotification } from './notificationManager.js';

const APPLE_MENU_OPTIONS = [
  { id: 'about', label: 'Sobre Este Mac' },
  { type: 'divider' },
  { id: 'settings', label: 'Ajustes do Sistema…' },
  { id: 'appstore', label: 'App Store' },
  { type: 'divider' },
  { id: 'recent', label: 'Itens Recentes', hasSubmenu: true },
  { type: 'divider' },
  { id: 'force', label: 'Forçar Encerrar…', shortcut: '⌥⇧⌘⎋' },
  { type: 'divider' },
  { id: 'sleep', label: 'Repousar' },
  { id: 'restart', label: 'Reiniciar…' },
  { id: 'shutdown', label: 'Desligar…' },
  { type: 'divider' },
  { id: 'lock', label: 'Bloquear Tela', shortcut: '⌃⌘Q' },
  { id: 'logout', label: 'Finalizar Sessão de Mateus Alves…', shortcut: '⇧⌘Q' },
];

const APP_MENUS = {
  finder: ['Finder', 'Arquivo', 'Editar', 'Visualizar', 'Ir', 'Janela', 'Ajuda'],
  terminal: ['Terminal', 'Shell', 'Editar', 'Visualizar', 'Janela', 'Ajuda'],
  settings: ['Ajustes do Sistema', 'Editar', 'Visualizar', 'Janela', 'Ajuda'],
  safari: ['Safari', 'Arquivo', 'Editar', 'Visualizar', 'Histórico', 'Favoritos', 'Desenvolvedor', 'Janela', 'Ajuda'],
};

const MENU_OPTIONS = {
  Arquivo: [
    { id: 'finder-new-win', label: 'Nova Janela do Finder', shortcut: '⌘N' },
    { id: 'new-folder', label: 'Nova Pasta', shortcut: '⇧⌘N' },
    { id: 'new-folder-sel', label: 'Nova Pasta com Seleção', shortcut: '⌃⌘N', disabled: true },
    { id: 'new-smart-folder', label: 'Nova Pasta Inteligente' },
    { id: 'new-tab', label: 'Nova Aba', shortcut: '⌘T' },
    { id: 'open', label: 'Abrir', shortcut: '⌘O', disabled: true },
    { id: 'open-with', label: 'Abrir com', hasSubmenu: true, disabled: true },
    { id: 'close-win', label: 'Fechar Janela', shortcut: '⌘W', disabled: true },
    { type: 'divider' },
    { id: 'info', label: 'Obter Informações', shortcut: '⌘I' },
    { id: 'rename', label: 'Renomear', disabled: true },
    { id: 'compress', label: 'Comprimir', disabled: true },
    { id: 'duplicate', label: 'Duplicar', shortcut: '⌘D', disabled: true },
    { id: 'alias', label: 'Criar Atalho', shortcut: '⌃⌘A', disabled: true },
    { id: 'quicklook', label: 'Visualização Rápida', shortcut: '⌘Y', disabled: true },
    { id: 'print', label: 'Imprimir', shortcut: '⌘P', disabled: true },
    { type: 'divider' },
    { id: 'share', label: 'Compartilhar…', disabled: true },
    { type: 'divider' },
    { id: 'show-original', label: 'Mostrar Original', shortcut: '⌘R', disabled: true },
    { id: 'add-sidebar', label: 'Adicionar à Barra Lateral', shortcut: '⌃⌘T', disabled: true },
    { type: 'divider' },
    { id: 'trash', label: 'Mover para o Lixo', shortcut: '⌘⌫', disabled: true },
    { id: 'eject', label: 'Ejetar', shortcut: '⌘E', disabled: true },
    { type: 'divider' },
    { type: 'tags' },
    { id: 'tags-btn', label: 'Etiquetas…', disabled: true },
    { type: 'divider' },
    { id: 'search', label: 'Buscar', shortcut: '⌘F' },
  ],
  Editar: [
    { id: 'undo', label: 'Desfazer', shortcut: '⌘Z', disabled: true },
    { id: 'redo', label: 'Refazer', shortcut: '⇧⌘Z', disabled: true },
    { type: 'divider' },
    { id: 'cut', label: 'Recortar', shortcut: '⌘X', disabled: true },
    { id: 'copy', label: 'Copiar', shortcut: '⌘C', disabled: true },
    { id: 'paste', label: 'Colar', shortcut: '⌘V', disabled: true },
    { id: 'select-all', label: 'Selecionar Tudo', shortcut: '⌘A' },
    { type: 'divider' },
    { id: 'show-clipboard', label: 'Mostrar Área de Transferência' },
    { type: 'divider' },
    { id: 'dictation', label: 'Iniciar Ditado…', shortcut: 'fn fn' },
    { id: 'emoji', label: 'Emoji e Símbolos', shortcut: '⌃⌘Espaço' },
  ],
  Visualizar: [
    { id: 'view-icons', label: 'como Ícones', shortcut: '⌘1', disabled: true },
    { id: 'view-list', label: 'como Lista', shortcut: '⌘2', disabled: true },
    { id: 'view-columns', label: 'como Colunas', shortcut: '⌘3', disabled: true },
    { id: 'view-gallery', label: 'como Galeria', shortcut: '⌘4', disabled: true },
    { type: 'divider' },
    { id: 'use-stacks', label: 'Usar Conjuntos', shortcut: '⌃⌘0', checked: true },
    { id: 'group-by', label: 'Agrupar Conjuntos por', hasSubmenu: true },
    { id: 'sort-by', label: 'Ordenar', disabled: true },
    { id: 'align-by', label: 'Alinhar por', hasSubmenu: true },
    { type: 'divider' },
    { id: 'hide-tab-bar', label: 'Ocultar Barra de Abas', shortcut: '⇧⌘T', disabled: true },
    { id: 'show-all-tabs', label: 'Mostrar Todas as Abas', shortcut: '⇧⌘\\', disabled: true },
    { type: 'divider' },
    { id: 'hide-sidebar', label: 'Ocultar Barra Lateral', shortcut: '⌥⌘S', disabled: true },
    { id: 'hide-preview', label: 'Ocultar Pré-visualização', shortcut: '⇧⌘P', disabled: true },
    { type: 'divider' },
    { id: 'hide-toolbar', label: 'Ocultar Barra de Ferramentas', shortcut: '⌥⌘T', disabled: true },
    { id: 'hide-path', label: 'Ocultar Barra de Caminho', shortcut: '⌥⌘P', disabled: true },
    { id: 'hide-status', label: 'Ocultar Barra de Estado', shortcut: '⌘/', disabled: true },
    { type: 'divider' },
    { id: 'cust-toolbar', label: 'Personalizar Barra de Ferramentas…', disabled: true },
    { id: 'cust-touchbar', label: 'Personalizar Touch Bar…' },
    { type: 'divider' },
    { id: 'view-options', label: 'Mostrar Opções de Visualização', shortcut: '⌘J' },
    { id: 'preview-options', label: 'Mostrar Opções de Pré-Visualização', disabled: true },
    { type: 'divider' },
    { id: 'fullscreen', label: 'Entrar em Tela Cheia', shortcut: 'fn F' },
  ],
  Ir: [
    { id: 'go-back', label: 'Voltar', shortcut: '⌘[', disabled: true },
    { id: 'go-forward', label: 'Avançar', shortcut: '⌘]', disabled: true },
    { id: 'go-startup-disk', label: 'Selecionar Disco de Inicialização', shortcut: '⇧⌘A', disabled: true },
    { type: 'divider' },
    { id: 'go-recents', label: 'Recentes', shortcut: '⇧⌘F', icon: 'clock' },
    { id: 'go-docs', label: 'Documentos', shortcut: '⇧⌘O', icon: 'doc.text' },
    { id: 'go-desktop', label: 'Mesa', shortcut: '⇧⌘D', icon: 'desktopcomputer' },
    { id: 'go-downloads', label: 'Downloads', shortcut: '⌥⌘L', icon: 'arrow.down.circle' },
    { id: 'go-home', label: 'Pasta Pessoal', shortcut: '⇧⌘H', icon: 'house' },
    { id: 'go-computer', label: 'Computador', shortcut: '⇧⌘C', icon: 'laptopcomputer' },
    { id: 'go-airdrop', label: 'AirDrop', shortcut: '⇧⌘R', icon: 'airdrop' },
    { id: 'go-network', label: 'Rede', shortcut: '⇧⌘K', icon: 'globe' },
    { id: 'go-icloud', label: 'iCloud Drive', shortcut: '⇧⌘I', icon: 'icloud' },
    { id: 'go-shared', label: 'Compartilhado', shortcut: '⇧⌘S', icon: 'folder.badge.person.crop' },
    { id: 'go-apps', label: 'Aplicativos', shortcut: '⇧⌘A', icon: 'app' },
    { id: 'go-utils', label: 'Utilitários', shortcut: '⇧⌘U', icon: 'wrench.and.screwdriver' },
    { id: 'go-onedrive', label: 'OneDrive', icon: 'cloud' },
    { type: 'divider' },
    { id: 'recent-folders', label: 'Pastas Recentes', hasSubmenu: true },
    { type: 'divider' },
    { id: 'go-to-folder', label: 'Ir para Pasta…', shortcut: '⇧⌘G' },
    { id: 'connect-server', label: 'Conectar ao Servidor…', shortcut: '⌘K' },
  ],
  Janela: [
    { id: 'win-minimize', label: 'Minimizar', shortcut: '⌘M', disabled: true },
    { id: 'win-zoom', label: 'Zoom', disabled: true },
    { id: 'win-fill', label: 'Preencher', shortcut: '⌃fn F', disabled: true },
    { id: 'win-center', label: 'Centralizar', shortcut: '⌃fn C', disabled: true },
    { type: 'divider' },
    { id: 'win-move-resize', label: 'Mover e Redimensionar', hasSubmenu: true },
    { id: 'win-tile', label: 'Mosaico em Tela Cheia', hasSubmenu: true, disabled: true },
    { type: 'divider' },
    { id: 'win-remove-group', label: 'Remover Janela do Grupo', disabled: true },
    { id: 'win-cycle', label: 'Percorrer Janelas', shortcut: '⌘`' },
    { id: 'win-progress', label: 'Mostrar Janela de Progresso', disabled: true },
    { type: 'divider' },
    { id: 'win-front', label: 'Trazer Todas para a Frente' },
    { type: 'divider' },
    { id: 'win-prev-tab', label: 'Mostrar Aba Anterior', shortcut: '⌃⇧⇥', disabled: true },
    { id: 'win-next-tab', label: 'Mostrar Aba Seguinte', shortcut: '⌃⇥', disabled: true },
    { id: 'win-move-tab', label: 'Mover Aba para Nova Janela', disabled: true },
    { id: 'win-merge-tabs', label: 'Combinar Todas as Janelas', disabled: true },
  ],
  Ajuda: [
    { id: 'search-help', label: 'Buscar' },
    { type: 'divider' },
    { id: 'mac-help', label: 'Ajuda do macOS' },
  ],
  Shell: [
    { id: 'shell-new', label: 'Novo Terminal', shortcut: '⌘N' },
    { id: 'shell-tab', label: 'Nova Aba', shortcut: '⌘T' },
    { type: 'divider' },
    { id: 'shell-close-tab', label: 'Fechar Aba', shortcut: '⌘W' },
    { id: 'shell-close-win', label: 'Fechar Janela', shortcut: '⇧⌘W' },
  ],
  Histórico: [
    { id: 'hist-back', label: 'Voltar', shortcut: '⌘[' },
    { id: 'hist-forward', label: 'Avançar', shortcut: '⌘]' },
    { type: 'divider' },
    { id: 'hist-show', label: 'Mostrar Todo o Histórico', shortcut: '⌥⌘B' },
    { id: 'hist-clear', label: 'Limpar Histórico…' },
  ],
  Favoritos: [
    { id: 'fav-add', label: 'Adicionar Favorito…', shortcut: '⌘D' },
    { id: 'fav-show', label: 'Mostrar Favoritos', shortcut: '⌥⌘B' },
  ],
  Desenvolvedor: [
    { id: 'inspect', label: 'Inspecionar Elemento', shortcut: '⌥⌘I' },
    { id: 'console', label: 'Console JavaScript', shortcut: '⌥⌘J' },
    { id: 'source', label: 'Exibir Código-Fonte', shortcut: '⌥⌘U' },
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
    this._initAppleMenu();
    this._initCC();
    this._initMenubarIcons();

    document.addEventListener('mousedown', e => {
      const bar = document.getElementById('menubar');
      const cc = document.getElementById('control-center');
      if (bar && !bar.contains(e.target) && cc && !cc.contains(e.target)) {
        this._closeAll();
      }
    });

    wm.onChange(({ activeWin }) => {
      this.updateMenuBarForApp(activeWin);
    });

    this.updateMenuBarForApp('finder');
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

  _initAppleMenu() {
    const wrapper = document.getElementById('menubar-apple');
    const overlay = document.getElementById('menubar-apple-overlay');
    const dropdown = document.getElementById('menubar-apple-dropdown');

    if (!wrapper || !overlay || !dropdown) return;

    this._populateAppleMenu(dropdown);

    overlay.addEventListener('click', e => {
      e.stopPropagation();
      this._toggleMenu('apple');
    });

    wrapper.addEventListener('mouseenter', () => {
      if (this.activeMenu && this.activeMenu !== 'apple') {
        this._openMenu('apple');
      }
    });
  }

  updateMenuBarForApp(appId) {
    const appKey = (appId || 'finder').toLowerCase();
    let appName = 'Finder';

    if (appKey === 'finder') appName = 'Finder';
    else if (appKey === 'terminal') appName = 'Terminal';
    else if (appKey === 'settings') appName = 'Ajustes do Sistema';
    else if (appKey === 'safari') appName = 'Safari';
    else appName = appId.charAt(0).toUpperCase() + appId.slice(1);

    this.currentAppName = appName;
    const titles = APP_MENUS[appKey] || [appName, 'Arquivo', 'Editar', 'Visualizar', 'Janela', 'Ajuda'];

    this._renderDynamicMenuItems(titles, appName);
  }

  _renderDynamicMenuItems(titles, appName) {
    const container = document.getElementById('menubar-dynamic-items');
    if (!container) return;

    container.innerHTML = '';
    this.activeMenu = null;

    titles.forEach((title, index) => {
      const isAppName = index === 0;
      const key = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

      const wrapper = document.createElement('div');
      wrapper.className = 'menuBar__itemWrapper';
      wrapper.id = `menubar-${key}-wrapper`;

      const span = document.createElement('span');
      span.className = `menuBar__item isClickable ${isAppName ? 'isBold' : ''}`;
      span.id = `menubar-${key}`;
      span.textContent = title;

      const overlay = document.createElement('div');
      overlay.className = 'menuBar__item-click-overlay';
      overlay.id = `menubar-${key}-overlay`;

      const dropdown = document.createElement('div');
      dropdown.className = 'menuBar__dropdown';
      dropdown.id = `menubar-${key}-dropdown`;
      dropdown.style.display = 'none';

      wrapper.appendChild(span);
      wrapper.appendChild(overlay);
      wrapper.appendChild(dropdown);
      container.appendChild(wrapper);

      if (isAppName) {
        this._populateAppMenuDropdown(dropdown, appName);
      } else if (MENU_OPTIONS[title]) {
        this._populateMenu(dropdown, MENU_OPTIONS[title]);
      } else {
        dropdown.innerHTML = `<div class="menuBar__dropdownItem"><span>${title}</span></div>`;
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

  _populateAppMenuDropdown(dropdown, appName) {
    if (appName === 'Finder') {
      const items = [
        { id: 'about-app', label: 'Sobre o Finder' },
        { type: 'divider' },
        { id: 'app-settings', label: 'Configurações…', shortcut: '⌘,' },
        { type: 'divider' },
        { id: 'empty-trash', label: 'Esvaziar Lixo…', shortcut: '⇧⌘⌫' },
        { type: 'divider' },
        { id: 'services', label: 'Serviços', hasSubmenu: true },
        { type: 'divider' },
        { id: 'hide-app', label: 'Ocultar Finder', shortcut: '⌘H' },
        { id: 'hide-others', label: 'Ocultar Outros', shortcut: '⌥⌘H' },
        { id: 'show-all', label: 'Mostrar Tudo', disabled: true },
      ];
      this._populateMenu(dropdown, items);
      return;
    }

    const items = [
      { id: 'about-app', label: `Sobre o ${appName}` },
      { type: 'divider' },
      { id: 'app-settings', label: 'Configurações…', shortcut: '⌘,' },
      { type: 'divider' },
      { id: 'services', label: 'Serviços', hasSubmenu: true },
      { type: 'divider' },
      { id: 'hide-app', label: `Ocultar ${appName}`, shortcut: '⌘H' },
      { id: 'hide-others', label: 'Ocultar Outros', shortcut: '⌥⌘H' },
      { id: 'show-all', label: 'Mostrar Tudo', disabled: true },
      { type: 'divider' },
      { id: 'quit-app', label: `Encerrar ${appName}`, shortcut: '⌘Q' },
    ];

    this._populateMenu(dropdown, items);
  }

  _populateAppleMenu(dropdown) {
    this._populateMenu(dropdown, APPLE_MENU_OPTIONS);
  }

  _populateMenu(dropdown, items) {
    dropdown.innerHTML = items.map(opt => {
      if (opt.type === 'divider') return `<div class="menuBar__dropdownDivider"></div>`;
      if (opt.type === 'tags') {
        const tagColors = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#0a84ff', '#bf5af2', '#8e8e93'];
        return `
          <div class="menuBar__tag-row">
            ${tagColors.map(c => `<span class="menuBar__tag-dot" style="background:${c};"></span>`).join('')}
          </div>
        `;
      }

      const disabledClass = opt.disabled ? 'is-disabled' : '';
      let leftHtml = '';
      if (opt.checked) {
        leftHtml += `<span class="menuBar__dropdownCheckmark">✓</span>`;
      }
      if (opt.icon) {
        leftHtml += `<span class="menuBar__dropdownItemIcon">${getSFSymbolHtml(opt.icon, { size: 13, style: 'opacity:0.85;' })}</span>`;
      }
      leftHtml += `<span class="menuBar__dropdownLabel">${opt.label}</span>`;

      let rightHtml = '';
      if (opt.shortcut) {
        rightHtml = `<span class="menuBar__dropdownShortcut">${opt.shortcut}</span>`;
      } else if (opt.hasSubmenu) {
        rightHtml = `<span class="menuBar__dropdownSubmenuArrow">›</span>`;
      }

      return `
        <div class="menuBar__dropdownItem ${disabledClass}" data-id="${opt.id || ''}">
          <div class="menuBar__dropdownItemLeft">${leftHtml}</div>
          ${rightHtml}
        </div>
      `;
    }).join('');

    dropdown.querySelectorAll('.menuBar__dropdownItem:not(.is-disabled)').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        const id = item.dataset.id;
        this._closeAll();

        if (id === 'about') {
          this._showAbout();
        } else if (id === 'settings' || id === 'app-settings') {
          this.wm.openWindow('settings');
        } else if (id === 'finder-new-win' || id === 'new-win') {
          this.wm.openApp('finder', 'Finder');
        } else if (id === 'close-win') {
          if (this.wm.activeWinId) this.wm.closeWindow(this.wm.activeWinId, false);
        } else if (id === 'quit-app') {
          if (this.wm.activeWinId) this.wm.quitApp(this.wm.activeWinId);
        } else if (id === 'minimize' || id === 'hide-app') {
          if (this.wm.activeWinId) this.wm.minimizeWindow(this.wm.activeWinId);
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
      : document.getElementById(`menubar-${key}`);
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

  _showAbout() {
    const overlay = document.getElementById('about-this-mac');
    if (!overlay) return;

    if (!this._serialNumber) {
      this._serialNumber = 'C02' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    overlay.innerHTML = `
      <div class="atm-window">
        <div class="atm-titlebar">
          <button class="traffic-light traffic-close" id="atm-close-btn" aria-label="Fechar"></button>
          <span class="atm-disabled-dot"></span>
          <span class="atm-disabled-dot"></span>
        </div>

        <img src="assets/icons/settings icons/Macbook-settings.png" alt="MacBook Pro" class="atm-mac-img" />

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
          <div class="atm-spec-value">${this._serialNumber}</div>

          <div class="atm-spec-label">macOS</div>
          <div class="atm-spec-value">Sequoia 15.7.7</div>
        </div>

        <button class="atm-info-btn" id="atm-more-info-btn">Mais Informações...</button>

        <div class="atm-reg-cert">Certificação Reguladora</div>
        <div class="atm-copyright">™ e © 1983-2026 Apple Inc.<br>Todos os Direitos Reservados.</div>
      </div>
    `;

    overlay.style.display = 'flex';
    overlay.className = 'atm-overlay';

    const closeBtn = overlay.querySelector('#atm-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => { overlay.style.display = 'none'; };
    }

    const moreBtn = overlay.querySelector('#atm-more-info-btn');
    if (moreBtn) {
      moreBtn.onclick = () => {
        overlay.style.display = 'none';
        this.wm.openWindow('settings');
      };
    }
  }

  _initCC() {
    const btn = document.getElementById('menubar-cc-btn');
    const cc = document.getElementById('control-center');
    if (!btn || !cc) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (this.state.ccOpen) {
        cc.classList.remove('is-open');
        cc.style.display = 'none';
        this.state.ccOpen = false;
      } else {
        this._closeAll();
        this._renderCCContent(cc);
        cc.style.display = 'flex';
        cc.classList.add('is-open');
        this.state.ccOpen = true;
      }
    });
  }

  _initMenubarIcons() {
    const batteryBtn = document.getElementById('menubar-battery-btn');
    if (batteryBtn) {
      batteryBtn.addEventListener('click', e => {
        e.stopPropagation();
        this._closeAll();
        showNotification({
          title: 'Bateria',
          desc: 'Painel de energia disponível em breve.',
          icon: 'assets/icons/menuBar/battery.100.png',
          duration: 3500
        });
      });
    }

    const wifiBtn = document.getElementById('menubar-wifi-btn');
    if (wifiBtn) {
      wifiBtn.addEventListener('click', e => {
        e.stopPropagation();
        this._closeAll();
        showNotification({
          title: 'Wi-Fi',
          desc: 'Seleção de redes disponível em breve.',
          icon: 'assets/icons/menuBar/wi-fi.png',
          duration: 3500
        });
      });
    }

    const btBtn = document.getElementById('menubar-bluetooth-btn');
    if (btBtn) {
      btBtn.addEventListener('click', e => {
        e.stopPropagation();
        this._closeAll();
        showNotification({
          title: 'Bluetooth',
          desc: 'Pareamento de dispositivos disponível em breve.',
          icon: 'assets/icons/menuBar/bluetooth.png',
          duration: 3500
        });
      });
    }

    const siriBtn = document.getElementById('menubar-siri-btn');
    if (siriBtn) {
      siriBtn.addEventListener('click', e => {
        e.stopPropagation();
        this._closeAll();
        showNotification({
          title: 'Siri',
          desc: 'Assistente de voz disponível em breve.',
          icon: 'assets/icons/menuBar/siri-2018.png',
          duration: 3500
        });
      });
    }

    const searchBtn = document.getElementById('menubar-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', e => {
        e.stopPropagation();
        this._closeAll();
        showNotification({
          title: 'Spotlight',
          desc: 'Busca do sistema disponível em breve.',
          icon: 'assets/icons/sf-symbols/white/magnifyingglass.png',
          duration: 3500
        });
      });
    }
  }

  _renderCCContent(cc) {
    const s = this.state;
    cc.innerHTML = `
      <div class="cc-grid-main">
        <div class="cc-card cc-card--connectivity">
          <div class="cc-conn-item" id="cc-wifi">
            <div class="cc-icon-circle ${s.wifi ? 'active-blue' : ''}">
              ${getSFSymbolHtml('wifi', { size: 20 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">Wi-Fi</span>
              <span class="cc-label-sub">${s.wifi ? 'Casa' : 'Desativado'}</span>
            </div>
          </div>
          <div class="cc-conn-item" id="cc-bluetooth">
            <div class="cc-icon-circle ${s.bluetooth ? 'active-blue' : ''}">
              ${getSFSymbolHtml('bluetooth', { size: 20 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">Bluetooth</span>
              <span class="cc-label-sub">${s.bluetooth ? 'Ativado' : 'Desativado'}</span>
            </div>
          </div>
          <div class="cc-conn-item" id="cc-airdrop">
            <div class="cc-icon-circle ${s.airdrop ? 'active-blue' : ''}">
              ${getSFSymbolHtml('airdrop', { size: 20 })}
            </div>
            <div class="cc-conn-text">
              <span class="cc-label-main">AirDrop</span>
              <span class="cc-label-sub">${s.airdrop ? 'Todos' : 'Desativado'}</span>
            </div>
          </div>
        </div>

        <div class="cc-right-column">
          <button class="cc-focus-row" id="cc-focus">
            <div class="cc-icon-circle ${s.focus ? 'active-purple' : ''}">
              ${getSFSymbolHtml('moon.fill', { size: 20 })}
            </div>
            <span class="cc-label-main">Foco</span>
          </button>
          <div class="cc-utilities-row">
            <button class="cc-utility-square ${s.stageManager ? 'active-opaque' : ''}" id="cc-stage">
              <img src="assets/icons/menuBar/rectagle.png" alt="Organizador Visual" class="sf-symbol" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;display:inline-block;" draggable="false" />
              <span class="cc-utility-label">Organiz.<br/>Visual</span>
            </button>
            <button class="cc-utility-square ${s.screenMirror ? 'active-opaque' : ''}" id="cc-mirror">
              ${getSFSymbolHtml('square.on.square', { size: 20 })}
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
              ${getSFSymbolHtml('sun.max.fill', { size: 14 })}
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
              ${getSFSymbolHtml(s.volume === 0 ? 'speaker.slash.fill' : 'speaker.3.fill', { size: 14 })}
            </div>
            <input type="range" class="cc-slider-input" id="cc-volume" min="0" max="100" value="${s.volume}" aria-label="Som" />
          </div>
          <button class="cc-airplay-btn" title="Saída de Áudio" id="cc-airplay">
            ${getSFSymbolHtml('airplayaudio', { size: 14 })}
          </button>
        </div>
      </div>
    `;

    cc.querySelector('#cc-wifi')?.addEventListener('click', () => { s.wifi = !s.wifi; this._renderCCContent(cc); });
    cc.querySelector('#cc-bluetooth')?.addEventListener('click', () => { s.bluetooth = !s.bluetooth; this._renderCCContent(cc); });
    cc.querySelector('#cc-airdrop')?.addEventListener('click', () => { s.airdrop = !s.airdrop; this._renderCCContent(cc); });
    cc.querySelector('#cc-focus')?.addEventListener('click', () => { s.focus = !s.focus; this._renderCCContent(cc); });
    cc.querySelector('#cc-stage')?.addEventListener('click', () => { s.stageManager = !s.stageManager; this._renderCCContent(cc); });
    cc.querySelector('#cc-mirror')?.addEventListener('click', () => { s.screenMirror = !s.screenMirror; this._renderCCContent(cc); });
    
    cc.querySelector('#cc-brightness')?.addEventListener('input', e => {
      s.brightness = +e.target.value;
      const fill = cc.querySelector('#cc-brightness-fill');
      if (fill) fill.style.width = s.brightness + '%';
    });
    
    cc.querySelector('#cc-volume')?.addEventListener('input', e => {
      s.volume = +e.target.value;
      const fill = cc.querySelector('#cc-volume-fill');
      if (fill) fill.style.width = s.volume + '%';
      const iconWrap = cc.querySelector('.cc-card--slider-wrapper:last-child .cc-slider-icon-wrap');
      if (iconWrap) {
        iconWrap.innerHTML = getSFSymbolHtml(s.volume === 0 ? 'speaker.slash.fill' : 'speaker.3.fill', { size: 15 });
      }
    });
  }
}
