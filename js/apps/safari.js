/**
 * Safari App — browser placeholder with iframe
 */
import { WindowManager } from '../windowManager.js';
import { getSFSymbolHtml } from '../sfSymbols.js';export function renderSafari(contentEl, wm) {
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('safari', 'Safari', wm, { showTitle: false });
  contentEl.appendChild(titlebar);

  let currentUrl = '';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;flex-direction:column;height:calc(100% - 38px);background:#252528;border-radius:0 0 12px 12px;overflow:hidden;color:#ffffff;';

  // Toolbar matching Image 5
  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'display:flex;align-items:center;gap:12px;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;background:rgba(36,36,40,0.98);';

  toolbar.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;opacity:0.8;">
      <span style="cursor:pointer;">${getSFSymbolHtml('sidebar.left', { size: 14 })}</span>
      <span style="cursor:pointer;">${getSFSymbolHtml('chevron.left', { size: 14 })}</span>
      <span style="cursor:pointer;">${getSFSymbolHtml('chevron.right', { size: 14 })}</span>
      <span style="cursor:pointer;">${getSFSymbolHtml('arrow.clockwise', { size: 13 })}</span>
    </div>

    <div style="flex:1;max-width:560px;margin:0 auto;display:flex;align-items:center;background:rgba(255,255,255,0.08);border-radius:8px;padding:5px 12px;gap:8px;">
      <span style="opacity:0.5;display:flex;align-items:center;">${getSFSymbolHtml('magnifyingglass', { size: 12 })}</span>
      <input id="safari-url-input" type="text" placeholder="Busque ou digite o nome do site" value="${currentUrl}"
        style="background:none;border:none;outline:none;color:#ffffff;font-size:13px;flex:1;text-align:center;" />
    </div>

    <div style="display:flex;align-items:center;gap:14px;opacity:0.8;">
      <span style="cursor:pointer;">${getSFSymbolHtml('square.and.arrow.up', { size: 14 })}</span>
      <span style="cursor:pointer;font-weight:600;font-size:16px;">+</span>
      <span style="cursor:pointer;">${getSFSymbolHtml('square.on.square', { size: 14 })}</span>
    </div>
  `;

  // Start Page Content matching Image 5
  const startPage = document.createElement('div');
  startPage.style.cssText = 'flex:1;overflow-y:auto;padding:32px 48px;position:relative;background:#242426;';

  const FAVORITES = [
    { name: 'WhatsApp', color: '#25D366', icon: '💬' },
    { name: 'YouTube', color: '#FF0000', icon: '▶' },
    { name: 'Hotmail', color: '#0078D4', icon: '✉' },
    { name: 'Gmail', color: '#EA4335', icon: 'M' },
    { name: 'IA', color: '#4A4A4A', icon: '🤖' },
    { name: 'Social', color: '#3B5998', icon: '👥' },
    { name: 'Stream', color: '#6441A5', icon: '📺' },
    { name: 'Mackenzie', color: '#CC0000', icon: 'M' },
  ];

  const ICLOUD_TABS = [
    { title: 'Ajuda com sua conta do X suspensa', url: 'help.x.com', iconText: 'X' },
    { title: 'This may take a few moments', url: 'accounts.google.com', iconText: 'T' },
    { title: 'NoSignups - Open Source Tools. Zero Bullsh*t.', url: 'nosignups.net', iconText: 'N' },
    { title: 'qrstudio.design: gerador de QR Code com logo', url: 'qrstudio.design', iconText: 'QR' },
    { title: 'sr duncan o alto livro - Pesquisa Google', url: 'google.com', iconText: 'S' },
    { title: 'Teacher Igor Ams - Método Accent', url: 'igorams.com', iconText: '🎓' },
    { title: 'Endrick - Pesquisa Google', url: 'google.com', iconText: 'E' },
    { title: 'viserys 1 tinha dragao? - Pesquisa Google', url: 'google.com', iconText: '🐉' },
    { title: 'Ryo Lu', url: 'ryo.lu', iconText: '●' },
  ];

  startPage.innerHTML = `
    <!-- Section 1: Preferidos -->
    <div style="font-size:20px;font-weight:700;margin-bottom:20px;">Preferidos</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(72px, 1fr));gap:24px 16px;margin-bottom:40px;max-width:700px;">
      ${FAVORITES.map(fav => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;">
          <div style="width:54px;height:54px;border-radius:12px;background:${fav.color};display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
            ${fav.icon}
          </div>
          <span style="font-size:11px;opacity:0.85;text-align:center;">${fav.name}</span>
        </div>
      `).join('')}
    </div>

    <!-- Section 2: Abas do iCloud -->
    <div style="font-size:20px;font-weight:700;margin-bottom:20px;">Abas do iCloud</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:14px;margin-bottom:60px;">
      ${ICLOUD_TABS.map(tab => `
        <div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:14px;display:flex;gap:12px;align-items:center;cursor:pointer;transition:background 0.15s;">
          <div style="width:40px;height:40px;border-radius:8px;background:#007AFF;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0;">
            ${tab.iconText}
          </div>
          <div style="display:flex;flex-direction:column;gap:2px;overflow:hidden;">
            <span style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${tab.title}</span>
            <span style="font-size:11px;opacity:0.5;">${tab.url}</span>
            <span style="font-size:10px;opacity:0.4;margin-top:2px;">📱 em iPhone de Mateus</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Bottom Right Edit Button -->
    <button style="position:absolute;bottom:24px;right:32px;background:rgba(255,255,255,0.12);border:none;color:#fff;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;">
      Editar
    </button>
  `;

  wrapper.appendChild(toolbar);
  wrapper.appendChild(startPage);
  contentEl.appendChild(wrapper);
}
