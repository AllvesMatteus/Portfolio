import { WindowManager } from '../windowManager.js';
import { WALLPAPER_GROUPS, ALL_WALLPAPERS } from '../desktop.js';
import { getSFSymbolHtml } from '../sfSymbols.js';
import { showMacAlert } from '../macDialog.js';
import { showNotification } from '../notificationManager.js';

const SETTINGS_SECTIONS = [
  { id: 'wifi', label: 'Wi-Fi', icon: 'assets/icons/Settings_menuSections/Network/Wi-Fi.png' },
  { id: 'bluetooth', label: 'Bluetooth', icon: 'assets/icons/Settings_menuSections/Network/Bluetooth.png' },
  { id: 'network', label: 'Rede', icon: 'assets/icons/settings icons/network.png' },
  { id: 'battery', label: 'Bateria', icon: 'assets/icons/settings icons/battery-toolkit.png' },
  { id: 'about', label: 'Geral', icon: 'assets/icons/settings icons/settings-macOS.png', spacer: true },
  { id: 'siri', label: 'Siri', icon: 'assets/icons/settings icons/siri.png' },
  { id: 'wallpaper', label: 'Imagem de Fundo', icon: 'assets/icons/settings icons/background-image.png' },
];

export function renderSettings(contentEl, wm, desktop) {
  contentEl.innerHTML = '';
  contentEl.style.cssText = 'height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;position:relative;';

  const titlebar = WindowManager.buildTitleBar('settings', '', wm);
  titlebar.className = 'app-window__titlebar settings-titlebar';
  contentEl.appendChild(titlebar);

  let activeSection = 'wifi';
  let activeSubpage = null;

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'settings-main-wrapper';

  const sidebar = document.createElement('div');
  sidebar.className = 'settings-sidebar';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'settings-search-wrap';
  searchWrap.innerHTML = `
    <div class="settings-search-box">
      <img src="assets/icons/sf-symbols/white/magnifyingglass.png" class="settings-search-icon" alt="Buscar" />
      <input type="text" placeholder="Buscar" class="settings-search-input" />
    </div>
  `;
  sidebar.appendChild(searchWrap);

  const profileCard = document.createElement('div');
  profileCard.className = 'settings-profile-card';
  profileCard.innerHTML = `
    <img src="assets/icons/settings icons/avatar.jpg" class="settings-profile-avatar" alt="Mateus Alves" />
    <div class="settings-profile-info">
      <span class="settings-profile-name">Mateus Alves</span>
      <span class="settings-profile-sub">Conta Apple</span>
    </div>
  `;
  sidebar.appendChild(profileCard);

  const icloudAlert = document.createElement('div');
  icloudAlert.className = 'settings-icloud-alert';
  icloudAlert.innerHTML = `
    <span class="settings-icloud-text">Armazenamento do<br/>iCloud cheio</span>
    <span class="settings-badge-red">1</span>
  `;
  sidebar.appendChild(icloudAlert);

  const navContainer = document.createElement('div');
  navContainer.className = 'settings-nav-container';

  function renderSidebarItems() {
    navContainer.innerHTML = '';
    SETTINGS_SECTIONS.forEach(sec => {
      const row = document.createElement('div');
      const isActive = activeSection === sec.id;
      row.className = `settings-nav-item ${isActive ? 'is-active' : ''}`;
      if (sec.spacer) {
        row.style.marginTop = '12px';
      }
      row.id = `settings-nav-${sec.id}`;
      row.innerHTML = `
        <img src="${sec.icon}" class="settings-nav-icon" alt="${sec.label}" />
        <span class="settings-nav-label">${sec.label}</span>
      `;
      row.addEventListener('click', () => {
        activeSection = sec.id;
        activeSubpage = null;
        renderSidebarItems();
        renderContent();
      });
      navContainer.appendChild(row);
    });
  }
  sidebar.appendChild(navContainer);

  const rightPanel = document.createElement('div');
  rightPanel.className = 'settings-right-panel';

  const rightHeader = document.createElement('div');
  rightHeader.className = 'settings-right-header';
  rightHeader.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <button id="settings-back" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Voltar">
        ${getSFSymbolHtml('chevron.left', { size: 14, style: 'opacity:0.65;' })}
      </button>
      <button id="settings-fwd" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Avançar">
        ${getSFSymbolHtml('chevron.right', { size: 14, style: 'opacity:0.4;' })}
      </button>
    </div>
    <span class="settings-header-title" id="settings-header-title">Wi-Fi</span>
  `;
  rightPanel.appendChild(rightHeader);

  rightHeader.querySelector('#settings-back')?.addEventListener('click', () => {
    if (activeSubpage) {
      activeSubpage = null;
      renderContent();
    }
  });

  const contentBody = document.createElement('div');
  contentBody.className = 'settings-content-body';

  function renderContent() {
    const headerTitle = rightPanel.querySelector('#settings-header-title');
    const backBtn = rightPanel.querySelector('#settings-back');

    if (activeSubpage) {
      if (backBtn) {
        backBtn.style.opacity = '1';
        backBtn.style.cursor = 'pointer';
      }
      if (headerTitle) {
        if (activeSubpage === 'language_region') headerTitle.textContent = 'Idioma e Região';
        else headerTitle.textContent = activeSubpage;
      }
      contentBody.innerHTML = '';
      if (activeSubpage === 'language_region') {
        renderLanguageRegionContent();
      }
      return;
    }

    if (backBtn) {
      backBtn.style.opacity = '0.35';
      backBtn.style.cursor = 'default';
    }

    const secObj = SETTINGS_SECTIONS.find(s => s.id === activeSection);
    if (headerTitle && secObj) {
      headerTitle.textContent = secObj.label;
    }

    contentBody.innerHTML = '';

    if (activeSection === 'wifi') {
      renderWifiContent();
    } else if (activeSection === 'bluetooth') {
      renderBluetoothContent();
    } else if (activeSection === 'network') {
      renderNetworkContent();
    } else if (activeSection === 'siri') {
      renderSiriContent();
    } else if (activeSection === 'about') {
      renderGeralContent();
    } else if (activeSection === 'wallpaper') {
      renderWallpaperContent();
    } else {
      renderGenericContent(secObj.label);
    }
  }

  const btDevicesState = {
    mouse: { name: 'MX Master 3S', icon: 'assets/icons/settings icons/mouse.png', connected: false },
    buds: { name: 'QCY AilyBuds Lite', icon: 'assets/icons/settings icons/headphone.png', connected: false }
  };

  function renderBluetoothContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';

    function buildBtView() {
      container.innerHTML = `
        <div class="settings-card" style="display:flex;flex-direction:column;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div style="display:flex;align-items:flex-start;gap:12px;flex:1;">
              <img src="assets/icons/Settings_menuSections/Network/Bluetooth.png" alt="Bluetooth" style="width:28px;height:28px;object-fit:contain;flex-shrink:0;" draggable="false" />
              <div style="display:flex;flex-direction:column;gap:2px;">
                <span style="font-size:13px;font-weight:600;color:#ffffff;line-height:1.2;">Bluetooth</span>
                <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;max-width:440px;">
                  Conecte-se a acessórios que você pode usar para atividades como streaming de música, digitação e jogos. <span style="font-size:11px;color:#0a84ff;text-decoration:none;cursor:pointer;">Saiba mais...</span>
                </span>
              </div>
            </div>
            <div class="mac-switch is-on">
              <div class="mac-switch-knob"></div>
            </div>
          </div>

          <div class="settings-card-divider"></div>

          <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;">
            Este Mac pode ser encontrado como “MacBook Pro de Mateus” enquanto os Ajustes de Bluetooth estiverem abertos.
          </span>
        </div>

        <div class="settings-section-title">Meus Dispositivos</div>
        <div class="settings-card settings-card-no-padding">
          ${Object.entries(btDevicesState).map(([key, dev]) => `
            <div class="settings-list-item" style="height:44px;">
              <div style="display:flex;align-items:center;">
                <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <img src="${dev.icon}" alt="${dev.name}" style="width:22px;height:22px;object-fit:contain;" draggable="false" />
                </div>
                <div style="margin-left:10px;display:flex;flex-direction:column;gap:1px;">
                  <span style="font-size:13px;font-weight:400;color:#ffffff;line-height:1.2;">${dev.name}</span>
                  <div style="display:flex;align-items:center;gap:4px;">
                    ${dev.connected ? '<span class="settings-status-dot"></span>' : ''}
                    <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.2;">${dev.connected ? 'Conectado' : 'Não Conectado'}</span>
                  </div>
                </div>
              </div>
              <div style="display:flex;align-items:center;">
                <button class="settings-btn settings-hover-btn bt-toggle-btn" data-key="${key}">
                  ${dev.connected ? 'Desconectar' : 'Conectar'}
                </button>
                <span style="display:inline-flex;">
                  ${getSFSymbolHtml('info.circle', { size: 15, style: 'opacity:0.65;' })}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="settings-actions-row">
          <button class="settings-btn" style="padding:0 10px;">Avançado...</button>
          <button class="settings-btn settings-help-btn">?</button>
        </div>

        <div class="settings-section-title">Dispositivos Próximos</div>
      `;

      container.querySelectorAll('.bt-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = btn.dataset.key;
          const dev = btDevicesState[key];
          if (dev) {
            dev.connected = !dev.connected;
            showNotification({
              title: 'Bluetooth',
              desc: dev.connected ? `Conectado a "${dev.name}".` : `"${dev.name}" desconectado.`,
              icon: 'assets/icons/Settings_menuSections/Network/Bluetooth.png',
              duration: 3000
            });
            buildBtView();
          }
        });
      });
    }

    buildBtView();
    contentBody.appendChild(container);
  }

  let connectedWifi = 'Casa';

  function renderWifiContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';

    const isConnectedNoPass = connectedWifi === 'Não sei por senha';

    function buildHtml() {
      container.innerHTML = `
        <div class="settings-card" style="display:flex;flex-direction:column;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div style="display:flex;align-items:flex-start;gap:12px;flex:1;">
              <img src="assets/icons/Settings_menuSections/Network/Wi-Fi.png" alt="Wi-Fi" style="width:28px;height:28px;object-fit:contain;flex-shrink:0;" draggable="false" />
              <div style="display:flex;flex-direction:column;gap:2px;">
                <span style="font-size:13px;font-weight:600;color:#ffffff;line-height:1.2;">Wi-Fi</span>
                <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;max-width:440px;">
                  Configure o Wi-Fi para estabelecer uma conexão sem fio do Mac com a internet automaticamente. Ative o Wi-Fi e escolha uma rede para entrar.
                </span>
                <span style="font-size:11px;color:#0a84ff;text-decoration:none;margin-top:1px;">Saiba Mais...</span>
              </div>
            </div>
            <div class="mac-switch is-on">
              <div class="mac-switch-knob"></div>
            </div>
          </div>

          <div class="settings-card-divider"></div>

          <div style="display:flex;align-items:center;justify-content:space-between;padding:1px 0;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:400;color:#ffffff;line-height:1.2;">${connectedWifi}</span>
              <div style="display:flex;align-items:center;gap:5px;">
                <span class="settings-status-dot"></span>
                <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);">Conectado</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              ${!isConnectedNoPass ? getSFSymbolHtml('lock.fill', { size: 11, style: 'opacity:0.55;' }) : ''}
              ${getSFSymbolHtml('wifi', { size: 13, style: 'opacity:0.85;' })}
              <button class="settings-btn">Detalhes...</button>
            </div>
          </div>
        </div>

        <div class="settings-section-title">Acessos Pessoais</div>
        <div class="settings-card" style="padding:0;overflow:hidden;">
          <div class="settings-list-item">
            <span style="font-size:13px;font-weight:400;color:#ffffff;padding-left:20px;">iPhone</span>
            <div style="display:flex;align-items:center;gap:10px;">
              ${getSFSymbolHtml('lock.fill', { size: 11, style: 'opacity:0.55;' })}
              ${getSFSymbolHtml('link', { size: 13, style: 'opacity:0.8;' })}
            </div>
          </div>
        </div>

        <div class="settings-section-title">Rede Conhecida</div>
        <div class="settings-card settings-card-no-padding">
          <div class="settings-list-item wifi-selectable-row" data-name="Casa">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:14px;font-size:11px;font-weight:600;color:#ffffff;display:inline-block;text-align:center;">${connectedWifi === 'Casa' ? '✓' : ''}</span>
              <span style="font-size:13px;font-weight:400;color:#ffffff;">Casa</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              ${connectedWifi !== 'Casa' ? `<button class="settings-btn settings-hover-btn">Conectar</button>` : ''}
              ${getSFSymbolHtml('lock.fill', { size: 11, style: 'opacity:0.55;' })}
              ${getSFSymbolHtml('wifi', { size: 13, style: 'opacity:0.85;' })}
              <span style="display:inline-flex;">
                ${getSFSymbolHtml('ellipsis.circle', { size: 14, style: 'opacity:0.65;' })}
              </span>
            </div>
          </div>
          <div class="settings-list-item wifi-selectable-row" data-name="Casa_Wi-Fi5">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:14px;font-size:11px;font-weight:600;color:#ffffff;display:inline-block;text-align:center;">${connectedWifi === 'Casa_Wi-Fi5' ? '✓' : ''}</span>
              <span style="font-size:13px;font-weight:400;color:#ffffff;">Casa_Wi-Fi5</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              ${connectedWifi !== 'Casa_Wi-Fi5' ? `<button class="settings-btn settings-hover-btn">Conectar</button>` : ''}
              ${getSFSymbolHtml('lock.fill', { size: 11, style: 'opacity:0.55;' })}
              ${getSFSymbolHtml('wifi', { size: 13, style: 'opacity:0.85;' })}
              <span style="display:inline-flex;">
                ${getSFSymbolHtml('ellipsis.circle', { size: 14, style: 'opacity:0.65;' })}
              </span>
            </div>
          </div>
          ${connectedWifi === 'Não sei por senha' ? `
            <div class="settings-list-item wifi-selectable-row" data-name="Não sei por senha">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:14px;font-size:11px;font-weight:600;color:#ffffff;display:inline-block;text-align:center;">✓</span>
                <span style="font-size:13px;font-weight:400;color:#ffffff;">Não sei por senha</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="width:11px;display:inline-block;"></span>
                ${getSFSymbolHtml('wifi', { size: 13, style: 'opacity:0.85;' })}
                <span style="display:inline-flex;">
                  ${getSFSymbolHtml('ellipsis.circle', { size: 14, style: 'opacity:0.65;' })}
                </span>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="settings-section-title">Outras Redes</div>
        <div class="settings-card settings-card-no-padding">
          ${[
          { name: 'Vizinho', locked: true },
          { name: 'Quem conectar é corno', locked: true },
          ...(connectedWifi !== 'Não sei por senha' ? [{ name: 'Não sei por senha', locked: false }] : [])
        ].map(item => `
            <div class="settings-list-item wifi-selectable-row" data-name="${item.name}">
              <span style="font-size:13px;font-weight:400;color:#ffffff;padding-left:20px;">${item.name}</span>
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="settings-btn settings-hover-btn">Conectar</button>
                ${item.locked ? getSFSymbolHtml('lock.fill', { size: 11, style: 'opacity:0.55;' }) : '<span style="width:11px;display:inline-block;"></span>'}
                ${getSFSymbolHtml('wifi', { size: 13, style: 'opacity:0.85;' })}
                <span style="display:inline-flex;">
                  ${getSFSymbolHtml('ellipsis.circle', { size: 14, style: 'opacity:0.65;' })}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:flex-end;margin-top:6px;margin-bottom:4px;">
          <button class="settings-btn" style="padding:0 10px;">Outra...</button>
        </div>

        <div class="settings-card" style="margin-top:20px;margin-bottom:24px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:400;color:#ffffff;line-height:1.2;">Solicitar conexão</span>
              <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;max-width:440px;margin-top:2px;">
                A conexão a redes conhecidas será automática. Se não houver redes conhecidas, você terá que selecionar uma rede manualmente.
              </span>
            </div>
            <div class="mac-switch">
              <div class="mac-switch-knob"></div>
            </div>
          </div>

          <div class="settings-card-divider"></div>

          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:400;color:#ffffff;line-height:1.2;">Solicitar conexão a acessos pessoais</span>
              <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;max-width:440px;margin-top:2px;">
                Permitir que este Mac descubra automaticamente um acesso pessoal por perto quando não houver uma rede Wi-Fi disponível.
              </span>
            </div>
            <div class="mac-switch is-on">
              <div class="mac-switch-knob"></div>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.wifi-selectable-row').forEach(row => {
        row.addEventListener('click', () => {
          const name = row.dataset.name;
          if (name === 'Não sei por senha') {
            connectedWifi = 'Não sei por senha';
            showNotification({
              title: 'Wi-Fi',
              desc: 'Conectado a "Não sei por senha".',
              icon: 'assets/icons/Settings_menuSections/Network/Wi-Fi.png',
              duration: 3000
            });
            buildHtml();
          } else if (name === 'Casa' || name === 'Casa_Wi-Fi5') {
            connectedWifi = name;
            showNotification({
              title: 'Wi-Fi',
              desc: `Conectado a "${name}".`,
              icon: 'assets/icons/Settings_menuSections/Network/Wi-Fi.png',
              duration: 3000
            });
            buildHtml();
          }
        });
      });
    }

    buildHtml();
    contentBody.appendChild(container);
  }

  function renderGeralContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';

    container.innerHTML = `
      <div class="settings-card" style="display:flex;flex-direction:column;align-items:center;padding:16px 20px;margin-bottom:12px;">
        <img src="assets/icons/settings icons/settings-macOS.png" style="width:54px;height:54px;object-fit:contain;margin-bottom:8px;" draggable="false" alt="Geral" />
        <span style="font-size:16px;font-weight:700;color:#ffffff;line-height:1.2;margin-bottom:4px;">Geral</span>
        <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;text-align:center;max-width:440px;">
          Gerencie configurações e preferências gerais do Mac, como atualizações de software, idioma do dispositivo, AirDrop e outras.
        </span>
      </div>
    `;

    const groups = [
      [
        { name: 'Sobre', bg: '#8e8e93', icon: 'laptop', sf: true },
        { name: 'Atualização de Software', bg: '#8e8e93', icon: 'gear', sf: true },
        {
          name: 'Armazenamento',
          bg: '#8e8e93',
          svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="3" fill="white"/><circle cx="17" cy="12" r="1.5" fill="#8e8e93"/></svg>'
        }
      ],
      [
        {
          name: 'AppleCare e Garantia',
          bg: '#ff3b30',
          img: 'assets/icons/desktop/apple_icon.png'
        }
      ],
      [
        { name: 'AirDrop e Handoff', bg: '#007aff', icon: 'airdrop', sf: true }
      ],
      [
        {
          name: 'Compartilhamento',
          bg: '#8e8e93',
          svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="2" width="14" height="14" rx="2" transform="rotate(45 12 2)" fill="white"/><circle cx="12" cy="10" r="2.2" fill="#8e8e93"/><path d="M12 13.5C10 13.5 8.2 15 8.2 17.5H15.8C15.8 15 14 13.5 12 13.5Z" fill="#8e8e93"/></svg>'
        },
        { name: 'Data e Hora', bg: '#007aff', icon: 'calendar', sf: true },
        {
          name: 'Disco de Inicialização',
          bg: '#8e8e93',
          svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="3" fill="white"/><circle cx="17" cy="12" r="1.5" fill="#8e8e93"/></svg>'
        },
        { name: 'Idioma e Região', bg: '#007aff', icon: 'globe', sf: true },
        { name: 'Itens de Início de Sessão e Extensões', bg: '#8e8e93', icon: 'list.bullet', sf: true },
        {
          name: 'Preenchimento Automático e Senhas',
          bg: '#8e8e93',
          icon: 'creditcard.fill',
          sf: true
        },
        {
          name: 'Time Machine',
          bg: '#34c759',
          svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="white" stroke-width="2.5"/><path d="M12 7V12L15.5 14" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M7 6L5 3.5M7 6L4 7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        }
      ],
      [
        { name: 'Gerenciamento de Dispositivo', bg: '#8e8e93', icon: 'checkmark.shield', sf: true }
      ],
      [
        { name: 'Transferir ou Redefinir', bg: '#8e8e93', icon: 'arrow.counterclockwise', sf: true, isReset: true }
      ]
    ];

    groups.forEach(grp => {
      const card = document.createElement('div');
      card.className = 'settings-card settings-card-no-padding';
      card.style.marginBottom = '8px';

      grp.forEach((item, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'settings-list-item';
        itemEl.style.height = '38px';
        if (idx === grp.length - 1) {
          itemEl.style.borderBottom = 'none';
        }
        itemEl.style.cursor = item.isReset ? 'pointer' : 'default';

        itemEl.innerHTML = `
          <div style="display:flex;align-items:center;">
            <div style="width:20px;height:20px;background:${item.bg};border-radius:4.5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${item.sf ? getSFSymbolHtml(item.icon, { size: 12, style: 'opacity:1;' }) : (item.img ? `<img src="${item.img}" style="width:12px;height:12px;object-fit:contain;" draggable="false" />` : item.svg)}
            </div>
            <span style="font-size:13px;font-weight:400;color:#ffffff;margin-left:10px;">${item.name}</span>
          </div>
          <span style="display:flex;align-items:center;opacity:0.35;">
            ${getSFSymbolHtml('chevron.right', { size: 12 })}
          </span>
        `;

        if (item.name === 'Idioma e Região') {
          itemEl.style.cursor = 'pointer';
          itemEl.addEventListener('click', () => {
            activeSubpage = 'language_region';
            renderContent();
          });
        }

        if (item.isReset) {
          itemEl.addEventListener('click', () => {
            showMacAlert({
              messageText: 'Apagar Todo o Conteúdo e Ajustes?',
              informativeText: 'O sistema será redefinido para as configurações originais de fábrica. Todos os ajustes personalizados, janelas e arquivos locais serão restaurados para o padrão.',
              iconSrc: 'assets/icons/settings icons/settings-macOS.png',
              buttons: ['Cancelar', 'Redefinir'],
              callback: (btn) => {
                if (btn === 'Redefinir') {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }
              }
            });
          });
        }

        card.appendChild(itemEl);
      });

      container.appendChild(card);
    });

    contentBody.appendChild(container);
  }

  function renderLanguageRegionContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';
    container.style.gap = '12px';

    let selectedLang = 'pt';
    let liveTextEnabled = true;
    let shareWithApps = false;
    let tempUnit = 'celsius';
    let measureSystem = 'metric';

    let regionValue = 'Brasil';
    let calendarValue = 'Gregoriano';
    let firstDayValue = 'Domingo';
    let dateFormatValue = '19/08/2026';
    let numberFormatValue = '1.234.567,89';
    let treatmentValue = 'Masculino';

    function buildView() {
      container.innerHTML = `
        <div class="settings-section-title" style="margin-top:0;">Idiomas Preferidos</div>
        <div class="settings-card settings-card-no-padding">
          <div class="settings-lang-row ${selectedLang === 'pt' ? 'is-selected' : ''}" data-lang="pt">
            <span style="font-size:13px;font-weight:500;color:#ffffff;">Português</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.65);">Português (Brasil) — Principal</span>
          </div>
          <div class="settings-lang-row ${selectedLang === 'en' ? 'is-selected' : ''}" data-lang="en">
            <span style="font-size:13px;font-weight:500;color:#ffffff;">English</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.65);">English (US)</span>
          </div>
          <div class="settings-lang-toolbar">
            <button class="settings-lang-tool-btn" id="btn-add-lang" title="Adicionar Idioma">+</button>
            <button class="settings-lang-tool-btn" id="btn-remove-lang" title="Remover Idioma">—</button>
          </div>
        </div>

        <div class="settings-card settings-card-no-padding">
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:12px 14px 10px 14px;border-bottom:0.5px solid rgba(255,255,255,0.06);text-align:center;">
            <span style="font-size:12px;color:rgba(255,255,255,0.65);">sexta-feira, 21 de agosto de 2026 às 20:25:28 BRT</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.65);">21/08/2026, 20:25 &nbsp;&nbsp;&nbsp; R$ 12.345,67 &nbsp;&nbsp;&nbsp; 4.567,89</span>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Região</span>
            <div class="mac-popup-btn">
              <span class="mac-popup-text">${regionValue}</span>
              <div class="mac-popup-badge">
                ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.85;' })}
              </div>
              <select class="mac-popup-select-overlay" id="sel-region">
                <option value="Brasil" ${regionValue === 'Brasil' ? 'selected' : ''}>Brasil</option>
                <option value="Estados Unidos" ${regionValue === 'Estados Unidos' ? 'selected' : ''}>Estados Unidos</option>
                <option value="Portugal" ${regionValue === 'Portugal' ? 'selected' : ''}>Portugal</option>
              </select>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Calendário</span>
            <div class="mac-popup-btn">
              <span class="mac-popup-text">${calendarValue}</span>
              <div class="mac-popup-badge">
                ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.85;' })}
              </div>
              <select class="mac-popup-select-overlay" id="sel-calendar">
                <option value="Gregoriano" ${calendarValue === 'Gregoriano' ? 'selected' : ''}>Gregoriano</option>
                <option value="Budista" ${calendarValue === 'Budista' ? 'selected' : ''}>Budista</option>
                <option value="Japonês" ${calendarValue === 'Japonês' ? 'selected' : ''}>Japonês</option>
                <option value="Islâmico" ${calendarValue === 'Islâmico' ? 'selected' : ''}>Islâmico</option>
              </select>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Temperatura</span>
            <div class="mac-radio-group">
              <label class="mac-radio-label">
                <input type="radio" name="temp_unit" value="celsius" ${tempUnit === 'celsius' ? 'checked' : ''} />
                <span>Celsius (°C)</span>
              </label>
              <label class="mac-radio-label">
                <input type="radio" name="temp_unit" value="fahrenheit" ${tempUnit === 'fahrenheit' ? 'checked' : ''} />
                <span>Fahrenheit (°F)</span>
              </label>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Sistema de medidas</span>
            <div class="mac-radio-group">
              <label class="mac-radio-label">
                <input type="radio" name="measure_sys" value="metric" ${measureSystem === 'metric' ? 'checked' : ''} />
                <span>Métrico</span>
              </label>
              <label class="mac-radio-label">
                <input type="radio" name="measure_sys" value="us" ${measureSystem === 'us' ? 'checked' : ''} />
                <span>EUA</span>
              </label>
              <label class="mac-radio-label">
                <input type="radio" name="measure_sys" value="uk" ${measureSystem === 'uk' ? 'checked' : ''} />
                <span>Reino Unido</span>
              </label>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Primeiro dia da semana</span>
            <div class="mac-popup-btn">
              <span class="mac-popup-text">${firstDayValue}</span>
              <div class="mac-popup-badge">
                ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.85;' })}
              </div>
              <select class="mac-popup-select-overlay" id="sel-firstday">
                <option value="Domingo" ${firstDayValue === 'Domingo' ? 'selected' : ''}>Domingo</option>
                <option value="Segunda-feira" ${firstDayValue === 'Segunda-feira' ? 'selected' : ''}>Segunda-feira</option>
                <option value="Sábado" ${firstDayValue === 'Sábado' ? 'selected' : ''}>Sábado</option>
              </select>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Formato da data</span>
            <div class="mac-popup-btn">
              <span class="mac-popup-text">${dateFormatValue}</span>
              <div class="mac-popup-badge">
                ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.85;' })}
              </div>
              <select class="mac-popup-select-overlay" id="sel-dateformat">
                <option value="19/08/2026" ${dateFormatValue === '19/08/2026' ? 'selected' : ''}>19/08/2026</option>
                <option value="2026-08-19" ${dateFormatValue === '2026-08-19' ? 'selected' : ''}>2026-08-19</option>
                <option value="08/19/2026" ${dateFormatValue === '08/19/2026' ? 'selected' : ''}>08/19/2026</option>
                <option value="19.08.2026" ${dateFormatValue === '19.08.2026' ? 'selected' : ''}>19.08.2026</option>
              </select>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Formato de número</span>
            <div class="mac-popup-btn">
              <span class="mac-popup-text">${numberFormatValue}</span>
              <div class="mac-popup-badge">
                ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.85;' })}
              </div>
              <select class="mac-popup-select-overlay" id="sel-numberformat">
                <option value="1.234.567,89" ${numberFormatValue === '1.234.567,89' ? 'selected' : ''}>1.234.567,89</option>
                <option value="1,234,567.89" ${numberFormatValue === '1,234,567.89' ? 'selected' : ''}>1,234,567.89</option>
                <option value="1 234 567,89" ${numberFormatValue === '1 234 567,89' ? 'selected' : ''}>1 234 567,89</option>
              </select>
            </div>
          </div>
        </div>

        <div class="settings-card settings-card-no-padding">
          <div class="settings-list-item" style="height:38px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Tratamento</span>
            <div class="mac-popup-btn">
              <span class="mac-popup-text">${treatmentValue}</span>
              <div class="mac-popup-badge">
                ${getSFSymbolHtml('chevron.up.chevron.down', { size: 9, style: 'opacity:0.85;' })}
              </div>
              <select class="mac-popup-select-overlay" id="sel-treatment">
                <option value="Masculino" ${treatmentValue === 'Masculino' ? 'selected' : ''}>Masculino</option>
                <option value="Feminino" ${treatmentValue === 'Feminino' ? 'selected' : ''}>Feminino</option>
                <option value="Neutro" ${treatmentValue === 'Neutro' ? 'selected' : ''}>Neutro</option>
              </select>
            </div>
          </div>
          <div style="padding:10px 14px;border-top:0.5px solid rgba(255,255,255,0.06);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div style="display:flex;flex-direction:column;gap:3px;">
              <span style="font-size:13px;color:#ffffff;">Compartilhar com todos os aplicativos</span>
              <span style="font-size:11px;color:rgba(255,255,255,0.55);line-height:1.35;max-width:480px;">
                Os aplicativos podem personalizar a forma como se dirigem a você com base no tratamento que você escolheu.
              </span>
            </div>
            <div class="mac-switch ${shareWithApps ? 'is-on' : ''}" id="switch-share-apps" style="cursor:pointer;margin-top:2px;">
              <div class="mac-switch-knob"></div>
            </div>
          </div>
        </div>

        <div class="settings-card" style="padding:12px 14px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div style="display:flex;flex-direction:column;gap:3px;">
            <span style="font-size:13px;color:#ffffff;">Texto ao Vivo</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.55);line-height:1.35;">
              Selecione texto em imagens para copiar ou realizar ações.
            </span>
          </div>
          <div class="mac-switch ${liveTextEnabled ? 'is-on' : ''}" id="switch-live-text" style="cursor:pointer;margin-top:2px;">
            <div class="mac-switch-knob"></div>
          </div>
        </div>

        <div class="settings-card" style="padding:12px 14px;display:flex;flex-direction:column;gap:4px;">
          <span style="font-size:13px;font-weight:600;color:#ffffff;">Aplicativos</span>
          <span style="font-size:11px;color:rgba(255,255,255,0.55);">Personalize ajustes de idioma para os seguintes aplicativos:</span>
        </div>
      `;

      container.querySelectorAll('.settings-lang-row').forEach(row => {
        row.addEventListener('click', () => {
          selectedLang = row.dataset.lang;
          buildView();
        });
      });

      container.querySelector('#switch-share-apps')?.addEventListener('click', () => {
        shareWithApps = !shareWithApps;
        buildView();
      });

      container.querySelector('#switch-live-text')?.addEventListener('click', () => {
        liveTextEnabled = !liveTextEnabled;
        buildView();
      });

      container.querySelectorAll('input[name="temp_unit"]').forEach(r => {
        r.addEventListener('change', (e) => {
          tempUnit = e.target.value;
        });
      });

      container.querySelectorAll('input[name="measure_sys"]').forEach(r => {
        r.addEventListener('change', (e) => {
          measureSystem = e.target.value;
        });
      });

      container.querySelector('#sel-region')?.addEventListener('change', (e) => {
        regionValue = e.target.value;
        buildView();
      });

      container.querySelector('#sel-calendar')?.addEventListener('change', (e) => {
        calendarValue = e.target.value;
        buildView();
      });

      container.querySelector('#sel-firstday')?.addEventListener('change', (e) => {
        firstDayValue = e.target.value;
        buildView();
      });

      container.querySelector('#sel-dateformat')?.addEventListener('change', (e) => {
        dateFormatValue = e.target.value;
        buildView();
      });

      container.querySelector('#sel-numberformat')?.addEventListener('change', (e) => {
        numberFormatValue = e.target.value;
        buildView();
      });

      container.querySelector('#sel-treatment')?.addEventListener('change', (e) => {
        treatmentValue = e.target.value;
        buildView();
      });
    }

    buildView();
    contentBody.appendChild(container);
  }

  function renderWallpaperContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';

    function buildWallpaperView() {
      container.innerHTML = '';

      const currentWp = desktop?.currentWallpaper || ALL_WALLPAPERS[0];
      const previewThumb = currentWp?.thumb || currentWp?.image || 'assets/images/wallpapers/landscape/sequoia-ao-amanhecer.jpg';

      const topSection = document.createElement('div');
      topSection.className = 'settings-wallpaper-top-section';
      topSection.innerHTML = `
        <div class="settings-wallpaper-preview-box">
          <img src="${previewThumb}" class="settings-wallpaper-preview-img" alt="Preview" draggable="false" />
        </div>
        <div class="settings-wallpaper-top-controls">
          <div class="settings-card settings-wallpaper-name-card">
            <span>${currentWp?.name || 'Sequoia ao Amanhecer'}</span>
          </div>
          <div class="settings-card settings-card-no-padding">
            <div class="settings-list-item" style="height:28px;padding:0 10px;">
              <span>Mostrar como protetor de tela</span>
              <div class="mac-switch">
                <div class="mac-switch-knob"></div>
              </div>
            </div>
            <div class="settings-list-item" style="height:28px;padding:0 10px;border-bottom:none;">
              <span>Mostrar em todos os Spaces</span>
              <div class="mac-switch">
                <div class="mac-switch-knob"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(topSection);

      const actionRow = document.createElement('div');
      actionRow.className = 'settings-actions-row';
      actionRow.style.marginBottom = '12px';
      actionRow.innerHTML = `
        <button class="settings-btn" style="gap:4px;font-size:12px;padding:0 8px;">
          <span>Adicionar Foto</span>
          ${getSFSymbolHtml('chevron.down', { size: 7, style: 'opacity:0.8;' })}
        </button>
        <button class="settings-btn" style="gap:4px;font-size:12px;padding:0 8px;">
          <span>Adicionar Pasta ou Álbum</span>
          ${getSFSymbolHtml('chevron.down', { size: 7, style: 'opacity:0.8;' })}
        </button>
      `;
      container.appendChild(actionRow);

      WALLPAPER_GROUPS.forEach(group => {
        const header = document.createElement('div');
        header.className = 'settings-wallpaper-section-header';
        header.innerHTML = `
          <span class="settings-wallpaper-section-title">${group.title}</span>
          <span class="settings-wallpaper-section-count">Mostrar Tudo (${group.totalCount})</span>
        `;
        container.appendChild(header);

        const row = document.createElement('div');
        row.className = 'settings-wallpaper-scroll-row';

        group.wallpapers.forEach(wp => {
          const isActive = currentWp?.id === wp.id;
          const card = document.createElement('div');
          card.className = `settings-wallpaper-card ${isActive ? 'is-active' : ''}`;

          const thumbUrl = wp.thumb || wp.image || 'assets/images/wallpapers/placeholder.png';

          let badgeHtml = '';
          if (group.badgeType === 'dynamic') {
            badgeHtml = `
              <div class="settings-wallpaper-card-badge is-circle">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22V2Z" fill="white"/>
                </svg>
              </div>
            `;
          } else if (group.badgeType === 'video') {
            badgeHtml = `
              <div class="settings-wallpaper-card-badge">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5V19L19 12L8 5Z"/>
                </svg>
              </div>
            `;
          }

          card.innerHTML = `
            <div class="settings-wallpaper-card-thumb">
              <img src="${thumbUrl}" class="settings-wallpaper-card-img" alt="${wp.name}" draggable="false" />
              ${badgeHtml}
            </div>
            <span class="settings-wallpaper-card-label" title="${wp.name}">${wp.name}${wp.arrow ? ' ⇣' : ''}</span>
          `;

          card.addEventListener('click', () => {
            if (desktop) {
              desktop.setWallpaper(wp.id);
              buildWallpaperView();
            }
          });

          row.appendChild(card);
        });

        container.appendChild(row);
      });

      const colorsHeader = document.createElement('div');
      colorsHeader.className = 'settings-wallpaper-section-header';
      colorsHeader.innerHTML = `
        <span class="settings-wallpaper-section-title">Cores</span>
        <span class="settings-wallpaper-section-count">Mostrar Tudo (19)</span>
      `;
      container.appendChild(colorsHeader);

      const colorsRow = document.createElement('div');
      colorsRow.className = 'settings-wallpaper-colors-row';

      const refreshBtn = document.createElement('button');
      refreshBtn.className = 'settings-btn';
      refreshBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
      refreshBtn.innerHTML = getSFSymbolHtml('arrow.clockwise', { size: 14, style: 'opacity:0.8;' });
      colorsRow.appendChild(refreshBtn);

      const addColorBtn = document.createElement('button');
      addColorBtn.className = 'settings-btn';
      addColorBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;font-weight:300;';
      addColorBtn.textContent = '+';
      colorsRow.appendChild(addColorBtn);

      const colorPalette = ['#1c1c1e', '#5e5ce6', '#00a3ff', '#ff453a', '#304ffe', '#ffd1b3', '#e6c8a0', '#d4af37'];
      colorPalette.forEach(c => {
        const swatch = document.createElement('div');
        swatch.className = 'settings-color-swatch';
        swatch.style.backgroundColor = c;
        swatch.addEventListener('click', () => {
          if (desktop && desktop.el) {
            desktop.el.style.backgroundImage = 'none';
            desktop.el.style.backgroundColor = c;
          }
        });
        colorsRow.appendChild(swatch);
      });
      container.appendChild(colorsRow);

      const folderHeader = document.createElement('div');
      folderHeader.className = 'settings-wallpaper-section-header';
      folderHeader.style.marginTop = '18px';
      folderHeader.innerHTML = `
        <span class="settings-wallpaper-section-title" style="display:flex;align-items:center;gap:6px;">
          ${getSFSymbolHtml('folder.fill', { size: 14, style: 'color:#0a84ff;' })}
          Imagens
        </span>
      `;
      container.appendChild(folderHeader);

      const helpRow = document.createElement('div');
      helpRow.className = 'settings-actions-row';
      helpRow.style.marginTop = '14px';
      helpRow.innerHTML = `<button class="settings-btn settings-help-btn">?</button>`;
      container.appendChild(helpRow);
    }

    buildWallpaperView();
    contentBody.appendChild(container);
  }

  function renderNetworkContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';

    container.innerHTML = `
      <div class="settings-card settings-card-no-padding" style="margin-bottom:8px;">
        <div class="settings-list-item" style="height:48px;" id="net-row-wifi">
          <div style="display:flex;align-items:center;">
            <img src="assets/icons/Settings_menuSections/Network/Wi-Fi.png" alt="Wi-Fi" style="width:28px;height:28px;object-fit:contain;flex-shrink:0;" draggable="false" />
            <div style="margin-left:12px;display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:500;color:#ffffff;line-height:1.2;">Wi-Fi</span>
              <div style="display:flex;align-items:center;gap:5px;">
                <span class="settings-status-dot"></span>
                <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);">Conectado</span>
              </div>
            </div>
          </div>
          <span style="display:flex;align-items:center;opacity:0.35;">
            ${getSFSymbolHtml('chevron.right', { size: 12 })}
          </span>
        </div>
      </div>

      <div class="settings-card settings-card-no-padding" style="margin-bottom:8px;">
        <div class="settings-list-item" style="height:48px;">
          <div style="display:flex;align-items:center;">
            <div style="width:28px;height:28px;background:#ff9500;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="18" rx="4" fill="white"/>
                <path d="M7 9H17M17 9L14 6.5M17 9L14 11.5M17 15H7M7 15L10 12.5M7 15L10 17.5" stroke="#ff9500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="margin-left:12px;display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:500;color:#ffffff;line-height:1.2;">Firewall</span>
              <div style="display:flex;align-items:center;gap:5px;">
                <span style="width:6.5px;height:6.5px;border-radius:50%;background:#8e8e93;display:inline-block;"></span>
                <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);">Inativo</span>
              </div>
            </div>
          </div>
          <span style="display:flex;align-items:center;opacity:0.35;">
            ${getSFSymbolHtml('chevron.right', { size: 12 })}
          </span>
        </div>
      </div>

      <div class="settings-section-title">Outros Serviços</div>
      <div class="settings-card settings-card-no-padding">
        <div class="settings-list-item" style="height:48px;">
          <div style="display:flex;align-items:center;">
            <div style="width:28px;height:28px;background:#8e8e93;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${getSFSymbolHtml('bolt.fill', { size: 16, style: 'opacity:1;' })}
            </div>
            <div style="margin-left:12px;display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:500;color:#ffffff;line-height:1.2;">Ponte Thunderbolt</span>
              <div style="display:flex;align-items:center;gap:5px;">
                <span style="width:6.5px;height:6.5px;border-radius:50%;background:#ff453a;display:inline-block;"></span>
                <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);">Não conectado</span>
              </div>
            </div>
          </div>
          <span style="display:flex;align-items:center;opacity:0.35;">
            ${getSFSymbolHtml('chevron.right', { size: 12 })}
          </span>
        </div>
      </div>

      <div class="settings-actions-row">
        <button class="settings-btn" style="padding:0 8px;gap:4px;">
          <span>•••</span>
          ${getSFSymbolHtml('chevron.down', { size: 8, style: 'opacity:0.6;' })}
        </button>
        <button class="settings-btn settings-help-btn">?</button>
      </div>
    `;

    const wifiRow = container.querySelector('#net-row-wifi');
    if (wifiRow) {
      wifiRow.addEventListener('click', () => {
        activeSection = 'wifi';
        renderSidebarItems();
        renderContent();
      });
    }

    contentBody.appendChild(container);
  }

  function renderSiriContent() {
    const container = document.createElement('div');
    container.className = 'settings-page-container';

    let siriEnabled = true;
    let heySiriEnabled = false;

    function buildSiriView() {
      container.innerHTML = `
        <div class="settings-card" style="display:flex;flex-direction:column;">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <img src="assets/icons/settings icons/siri.png" alt="Siri" style="width:28px;height:28px;object-fit:contain;flex-shrink:0;" draggable="false" />
            <div style="display:flex;flex-direction:column;gap:2px;">
              <span style="font-size:13px;font-weight:600;color:#ffffff;line-height:1.2;">Siri</span>
              <span style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;max-width:440px;">
                A Siri é uma assistente inteligente que ajuda você a buscar informações e realizar tarefas. <span style="font-size:11px;color:#0a84ff;text-decoration:none;cursor:pointer;">Saiba mais...</span>
              </span>
            </div>
          </div>
        </div>

        <div class="settings-section-title">Pedidos à Siri</div>
        <div class="settings-card settings-card-no-padding">
          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Siri</span>
            <div class="mac-switch ${siriEnabled ? 'is-on' : ''}" id="siri-main-toggle">
              <div class="mac-switch-knob"></div>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Ouvir “E aí Siri”</span>
            <div class="mac-switch ${heySiriEnabled ? 'is-on' : ''}" id="siri-hey-toggle">
              <div class="mac-switch-knob"></div>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Atalho de teclado</span>
            <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,0.75);">
              <span>Manter Command e Espaço Pressionadas</span>
              ${getSFSymbolHtml('chevron.up.chevron.down', { size: 11, style: 'opacity:0.6;' })}
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Idioma</span>
            <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,0.75);">
              <span>Português (Brasil)</span>
              ${getSFSymbolHtml('chevron.up.chevron.down', { size: 11, style: 'opacity:0.6;' })}
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Voz</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:13px;color:rgba(255,255,255,0.65);">Brasileira (Voz 2)</span>
              <button class="settings-btn" style="padding:0 10px;">Selecionar...</button>
            </div>
          </div>

          <div class="settings-list-item" style="height:36px;">
            <span style="font-size:13px;font-weight:400;color:#ffffff;">Histórico da Siri</span>
            <button class="settings-btn" style="padding:0 10px;">Apagar Histórico da Siri e do Ditado...</button>
          </div>

          <div style="padding:10px 14px;font-size:11px;font-weight:400;color:rgba(255,255,255,0.55);line-height:1.35;border-top:0.5px solid rgba(255,255,255,0.06);">
            Os dados de voz são processados no Mac, mas as transcrições dos seus pedidos são enviadas à Apple.<br/>
            <span style="color:#0a84ff;cursor:pointer;">Sobre Pedir à Siri, Ditado e Privacidade...</span>
          </div>
        </div>

        <div class="settings-actions-row" style="margin-top:10px;">
          <button class="settings-btn" style="padding:0 12px;">Sobre Pedir à Siri, Ditado e Privacidade...</button>
          <button class="settings-btn" style="padding:0 12px;">Respostas da Siri...</button>
        </div>

        <div class="settings-actions-row" style="margin-top:2px;">
          <button class="settings-btn settings-help-btn">?</button>
        </div>
      `;

      const siriToggle = container.querySelector('#siri-main-toggle');
      if (siriToggle) {
        siriToggle.addEventListener('click', () => {
          siriEnabled = !siriEnabled;
          buildSiriView();
        });
      }

      const heyToggle = container.querySelector('#siri-hey-toggle');
      if (heyToggle) {
        heyToggle.addEventListener('click', () => {
          heySiriEnabled = !heySiriEnabled;
          buildSiriView();
        });
      }
    }

    buildSiriView();
    contentBody.appendChild(container);
  }

  function renderGenericContent(label) {
    const cardEl = document.createElement('div');
    cardEl.className = 'settings-content-card';
    cardEl.innerHTML = `
      <div class="settings-card-title">${label}</div>
      <div style="font-size:13px;opacity:0.5;margin-top:8px;">Configurações ativas do sistema.</div>
    `;
    contentBody.appendChild(cardEl);
  }

  rightPanel.appendChild(contentBody);

  mainWrapper.appendChild(sidebar);
  mainWrapper.appendChild(rightPanel);
  contentEl.appendChild(mainWrapper);

  renderSidebarItems();
  renderContent();
}
