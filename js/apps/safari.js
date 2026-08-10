import { getSFSymbolHtml } from '../sfSymbols.js';

export function renderSafari(contentEl, wm) {
  contentEl.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;flex-direction:column;height:100%;background:#202124;overflow:hidden;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Roboto,sans-serif;';

  const titlebar = document.createElement('div');
  titlebar.className = 'app-window__titlebar safari-toolbar';
  titlebar.style.cssText = 'display:flex;align-items:center;height:52px;padding:0 16px;background:#28282b;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;user-select:none;-webkit-user-select:none;';

  titlebar.innerHTML = `
    <!-- Traffic Lights -->
    <div class="app-window__controls traffic-lights-container" style="display:flex;align-items:center;gap:8px;margin-right:20px;">
      <button class="app-window__btn app-window__btn--close traffic-light traffic-close" aria-label="Fechar" title="Fechar">
        <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon close-icon"><line x1="3" y1="3" x2="9" y2="9" stroke="#460804" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="3" x2="3" y2="9" stroke="#460804" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <button class="app-window__btn app-window__btn--minimize traffic-light traffic-minimize" aria-label="Minimizar" title="Minimizar">
        <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon minimize-icon"><line x1="2" y1="6" x2="10" y2="6" stroke="#90591d" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <button class="app-window__btn app-window__btn--zoom traffic-light traffic-maximize" aria-label="Zoom" title="Zoom">
        <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon maximize-icon"><rect x="3" y="3" width="6" height="6" fill="none" stroke="#2a6218" stroke-width="1.2" rx="1"/></svg>
      </button>
    </div>

    <!-- Navigation Icon Group — Matching Finder Standard -->
    <div style="display:flex;align-items:center;gap:12px;">
      <button style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;margin-right:4px;" title="Mostrar/Ocultar Barra Lateral">
        ${getSFSymbolHtml('sidebar.left', { size: 15, style: 'opacity:0.8;' })}
      </button>
      <button id="safari-back-btn" style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Voltar">
        ${getSFSymbolHtml('chevron.left', { size: 14, style: 'opacity:0.65;' })}
      </button>
      <button id="safari-forward-btn" style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Avançar">
        ${getSFSymbolHtml('chevron.right', { size: 14, style: 'opacity:0.4;' })}
      </button>
      <button id="safari-reload-btn" style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;transition:opacity 0.12s;" title="Recarregar Página">
        ${getSFSymbolHtml('arrow.clockwise', { size: 14, style: 'opacity:0.8;' })}
      </button>
    </div>

    <!-- Central Address Bar -->
    <div style="flex:1;max-width:480px;margin:0 auto;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.09);border-radius:8px;padding:5px 12px;position:relative;border:1px solid rgba(255,255,255,0.05);">
      <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
        <!-- Small Google G Logo -->
        <svg width="14" height="14" viewBox="0 0 24 24" style="flex-shrink:0;">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <input id="safari-url-input" type="text" value="google.com" style="background:none;border:none;outline:none;color:#ffffff;font-size:13px;font-weight:400;text-align:center;width:88px;" />
      </div>
      <!-- Format / Reader Icon on Far Right inside Address Bar -->
      <span style="position:absolute;right:10px;display:flex;align-items:center;opacity:0.6;cursor:pointer;" title="Formatos da Página">
        ${getSFSymbolHtml('slider.horizontal.3', { size: 14 })}
      </span>
    </div>

    <!-- Right Action Icons -->
    <div style="display:flex;align-items:center;gap:16px;">
      <button style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;" title="Compartilhar">
        ${getSFSymbolHtml('square.and.arrow.up', { size: 15, style: 'opacity:0.8;' })}
      </button>
      <button id="safari-newtab-btn" style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;" title="Nova Aba">
        ${getSFSymbolHtml('plus', { size: 14, style: 'opacity:0.8;' })}
      </button>
      <button style="background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;border-radius:4px;" title="Visão Geral das Abas">
        ${getSFSymbolHtml('square.on.square', { size: 15, style: 'opacity:0.8;' })}
      </button>
    </div>
  `;

  const closeBtn = titlebar.querySelector('.app-window__btn--close');
  const minBtn = titlebar.querySelector('.app-window__btn--minimize');
  const maxBtn = titlebar.querySelector('.app-window__btn--zoom');
  if (closeBtn) closeBtn.addEventListener('click', () => wm.closeWindow('safari'));
  if (minBtn) minBtn.addEventListener('click', () => wm.minimizeWindow('safari'));
  if (maxBtn) maxBtn.addEventListener('click', () => wm.maximizeWindow('safari'));

  const bodyEl = document.createElement('div');
  bodyEl.style.cssText = 'flex:1;display:flex;flex-direction:column;background:#202124;overflow-y:auto;position:relative;';

  function renderGoogleHome() {
    bodyEl.innerHTML = `
      <!-- Google Top Right Header -->
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:18px;padding:16px 28px;font-size:13px;color:rgba(255,255,255,0.85);">
        <a href="#" style="color:inherit;text-decoration:none;opacity:0.85;">Gmail</a>
        <a href="#" style="color:inherit;text-decoration:none;opacity:0.85;">Imagens</a>
        <!-- 9 Dots App Launcher -->
        <div style="cursor:pointer;opacity:0.8;display:flex;align-items:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
        <!-- User Avatar Circle -->
        <div style="width:32px;height:32px;border-radius:50%;background:#1a73e8;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:#fff;cursor:pointer;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.3);">
          M
        </div>
      </div>

      <!-- Main Center Content -->
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 20px 60px 20px;">
        <!-- Large Google Logo -->
        <div style="font-size:86px;font-weight:500;color:#ffffff;letter-spacing:-2.5px;font-family:-apple-system,BlinkMacSystemFont,Roboto,sans-serif;margin-bottom:32px;user-select:none;">
          Google
        </div>

        <!-- Search Bar Capsule -->
        <div style="width:100%;max-width:640px;background:#303134;border:1px solid rgba(255,255,255,0.14);border-radius:28px;padding:10px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:background 0.2s, border-color 0.2s;">
          <span style="font-size:22px;color:rgba(255,255,255,0.5);cursor:pointer;line-height:1;margin-top:-2px;">+</span>
          <input id="google-search-input" type="text" placeholder="" autofocus
            style="flex:1;background:none;border:none;outline:none;color:#ffffff;font-size:16px;font-family:inherit;" />

          <div style="display:flex;align-items:center;gap:12px;">
            <img src="assets/icons/sf-symbols/white/keyboard.png" style="width:16px;height:16px;opacity:0.6;cursor:pointer;" title="Teclado virtual" alt="Teclado" />
            <img src="assets/icons/sf-symbols/white/mic.fill.png" style="width:15px;height:15px;opacity:0.6;cursor:pointer;" title="Pesquisa por voz" alt="Voz" />
            <img src="assets/icons/sf-symbols/white/camera.png" style="width:16px;height:16px;opacity:0.6;cursor:pointer;" title="Pesquisa por imagem" alt="Lente" />

            <!-- Modo IA Badge Button -->
            <button style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);border-radius:16px;padding:5px 12px;font-size:12.5px;display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:500;">
              <span style="font-size:11px;">🔍</span> Modo IA
            </button>
          </div>
        </div>

        <!-- Search Action Buttons -->
        <div style="display:flex;gap:12px;margin-top:30px;">
          <button id="google-search-btn" style="background:#303134;border:1px solid transparent;color:#e8eaed;border-radius:6px;padding:10px 18px;font-size:14px;cursor:pointer;transition:background 0.15s, border-color 0.15s;">
            Pesquisa Google
          </button>
          <button id="google-lucky-btn" style="background:#303134;border:1px solid transparent;color:#e8eaed;border-radius:6px;padding:10px 18px;font-size:14px;cursor:pointer;transition:background 0.15s, border-color 0.15s;">
            Estou com sorte
          </button>
        </div>
      </div>

      <!-- Google Footer -->
      <div style="background:#171717;border-top:1px solid rgba(255,255,255,0.08);font-size:13.5px;color:rgba(255,255,255,0.6);margin-top:auto;">
        <!-- Top Footer Row: Country -->
        <div style="padding:14px 30px;border-bottom:1px solid rgba(255,255,255,0.08);">
          Brasil
        </div>
        <!-- Bottom Footer Row: Links -->
        <div style="padding:14px 30px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
          <div style="display:flex;gap:24px;">
            <a href="#" style="color:inherit;text-decoration:none;">Sobre</a>
            <a href="#" style="color:inherit;text-decoration:none;">Publicidade</a>
            <a href="#" style="color:inherit;text-decoration:none;">Negócios</a>
            <a href="#" style="color:inherit;text-decoration:none;">Como funciona a Pesquisa</a>
          </div>
          <div style="display:flex;gap:24px;">
            <a href="#" style="color:inherit;text-decoration:none;">Privacidade</a>
            <a href="#" style="color:inherit;text-decoration:none;">Termos</a>
            <a href="#" style="color:inherit;text-decoration:none;">Configurações</a>
          </div>
        </div>
      </div>
    `;

    const searchInput = bodyEl.querySelector('#google-search-input');
    const searchBtn = bodyEl.querySelector('#google-search-btn');
    const luckyBtn = bodyEl.querySelector('#google-lucky-btn');

    function doSearch() {
      const q = searchInput ? searchInput.value.trim() : '';
      if (q) {
        navigateTo('https://www.google.com/search?q=' + encodeURIComponent(q));
      }
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') doSearch();
      });
    }
    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    if (luckyBtn) luckyBtn.addEventListener('click', doSearch);
  }

  function navigateTo(url) {
    if (!url || url.toLowerCase() === 'google.com' || url.toLowerCase() === 'https://google.com') {
      const input = titlebar.querySelector('#safari-url-input');
      if (input) input.value = 'google.com';
      renderGoogleHome();
      return;
    }

    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        targetUrl = 'https://' + targetUrl;
      } else {
        targetUrl = 'https://www.google.com/search?q=' + encodeURIComponent(targetUrl);
      }
    }

    const input = titlebar.querySelector('#safari-url-input');
    if (input) input.value = targetUrl.replace(/^https?:\/\//i, '');

    bodyEl.innerHTML = `
      <iframe src="${targetUrl}" style="width:100%;height:100%;border:none;background:#ffffff;" title="Safari Web View"></iframe>
    `;
  }

  renderGoogleHome();

  const inputEl = titlebar.querySelector('#safari-url-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        navigateTo(inputEl.value.trim());
      }
    });
    inputEl.addEventListener('focus', () => inputEl.select());
  }

  const reloadBtn = titlebar.querySelector('#safari-reload-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      const val = inputEl ? inputEl.value.trim() : 'google.com';
      navigateTo(val);
    });
  }

  const newTabBtn = titlebar.querySelector('#safari-newtab-btn');
  if (newTabBtn) {
    newTabBtn.addEventListener('click', () => {
      const input = titlebar.querySelector('#safari-url-input');
      if (input) input.value = 'google.com';
      renderGoogleHome();
    });
  }

  wrapper.appendChild(titlebar);
  wrapper.appendChild(bodyEl);
  contentEl.appendChild(wrapper);
}
