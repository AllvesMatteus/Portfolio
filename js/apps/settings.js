import { WindowManager } from '../windowManager.js';
import { WALLPAPER_GROUPS } from '../desktop.js';
import { getSFSymbolHtml } from '../sfSymbols.js';

const SETTINGS_SECTIONS = [
  { id: 'wifi',       label: 'Wi-Fi',           icon: 'assets/icons/Settings_menuSections/Network/Wi-Fi.png' },
  { id: 'bluetooth',  label: 'Bluetooth',       icon: 'assets/icons/Settings_menuSections/Network/Bluetooth.png' },
  { id: 'network',    label: 'Rede',            icon: 'assets/icons/settings icons/network.png' },
  { id: 'battery',    label: 'Bateria',         icon: 'assets/icons/settings icons/battery-toolkit.png' },
  { id: 'about',      label: 'Geral',           icon: 'assets/icons/settings icons/settings-macOS.png', spacer: true },
  { id: 'siri',       label: 'Siri',            icon: 'assets/icons/settings icons/siri.png' },
  { id: 'wallpaper',  label: 'Imagem de Fundo', icon: 'assets/icons/settings icons/background-image.png' },
];

export function renderSettings(contentEl, wm, desktop) {
  contentEl.innerHTML = '';
  contentEl.style.cssText = 'height:100%;width:100%;overflow:hidden;display:flex;flex-direction:column;position:relative;';

  const titlebar = WindowManager.buildTitleBar('settings', '', wm, { disableMinimize: true, disableMaximize: true });
  titlebar.className = 'app-window__titlebar settings-titlebar';
  contentEl.appendChild(titlebar);

  let activeSection = 'about';

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
    <span class="settings-header-title" id="settings-header-title">Geral</span>
  `;
  rightPanel.appendChild(rightHeader);

  const contentBody = document.createElement('div');
  contentBody.className = 'settings-content-body';

  function renderContent() {
    const headerTitle = rightPanel.querySelector('#settings-header-title');
    const secObj = SETTINGS_SECTIONS.find(s => s.id === activeSection);
    if (headerTitle && secObj) {
      headerTitle.textContent = secObj.label;
    }

    contentBody.innerHTML = '';

    if (activeSection === 'about') {
      renderGeralContent();
    } else if (activeSection === 'wallpaper') {
      renderWallpaperContent();
    } else if (activeSection === 'wifi' || activeSection === 'bluetooth' || activeSection === 'network') {
      renderNetworkContent(secObj.label);
    } else {
      renderGenericContent(secObj.label);
    }
  }

  function renderGeralContent() {
    const container = document.createElement('div');
    container.className = 'settings-geral-container';

    const footerCard = document.createElement('div');
    footerCard.className = 'settings-footer-card';
    footerCard.innerHTML = `
      <div class="settings-footer-left">
        <div class="settings-reset-icon-wrap">
          <img src="assets/icons/sf-symbols/white/arrow.clockwise.png" class="settings-reset-icon" alt="Redefinir" />
        </div>
        <span class="settings-footer-label">Transferir ou Redefinir</span>
      </div>
      <span style="display:flex;align-items:center;opacity:0.4;">
        ${getSFSymbolHtml('chevron.right', { size: 12 })}
      </span>
    `;
    container.appendChild(footerCard);
    contentBody.appendChild(container);
  }

  function renderWallpaperContent() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:16px;width:100%;';
    WALLPAPER_GROUPS.forEach(group => {
      const cardEl = document.createElement('div');
      cardEl.className = 'settings-content-card';
      cardEl.innerHTML = `<div class="settings-card-title">${group.title}</div>`;
      const grid = document.createElement('div');
      grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;';
      group.wallpapers.forEach(wp => {
        const img = document.createElement('div');
        img.className = 'settings-wallpaper-thumb';
        img.style.backgroundImage = `url('${wp.thumb}')`;
        img.title = wp.name;
        img.addEventListener('click', () => {
          if (desktop) desktop.setWallpaper(wp.id);
        });
        grid.appendChild(img);
      });
      cardEl.appendChild(grid);
      wrap.appendChild(cardEl);
    });
    contentBody.appendChild(wrap);
  }

  function renderNetworkContent(label) {
    const cardEl = document.createElement('div');
    cardEl.className = 'settings-content-card';
    cardEl.innerHTML = `
      <div class="settings-card-title">${label}</div>
      <div style="font-size:13px;opacity:0.7;margin-top:8px;">Conectado a Kernel Panic Network</div>
    `;
    contentBody.appendChild(cardEl);
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
