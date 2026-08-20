import { getSFSymbolHtml } from '../sfSymbols.js';

class SafariEngine {
  constructor(contentEl, wm) {
    this.contentEl = contentEl;
    this.wm = wm;
    this.historyStack = [];
    this.historyIndex = -1;
    this.init();
  }

  init() {
    this.contentEl.innerHTML = '';

    this.wrapper = document.createElement('div');
    this.wrapper.style.cssText = 'display:flex;flex-direction:column;height:100%;background:#28282b;overflow:hidden;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Roboto,sans-serif;';

    this.titlebar = document.createElement('div');
    this.titlebar.className = 'app-window__titlebar safari-toolbar';
    this.titlebar.style.cssText = 'display:flex;align-items:center;height:52px;padding:0 16px;background:#28282b;border-bottom:none;flex-shrink:0;user-select:none;-webkit-user-select:none;';

    this.titlebar.innerHTML = `
      <div class="app-window__controls traffic-lights-container" style="display:flex;align-items:center;gap:8px;margin-right:14px;">
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

      <div style="display:flex;align-items:center;gap:4px;margin-right:12px;">
        <button class="safari-btn" id="safari-sidebar-btn" style="opacity:0.35;pointer-events:none;" title="Barra Lateral">
          ${getSFSymbolHtml('sidebar.left', { size: 17 })}
        </button>
        <button class="safari-btn" id="safari-back-btn" style="opacity:0.35;" title="Voltar">
          ${getSFSymbolHtml('chevron.left', { size: 13 })}
        </button>
        <button class="safari-btn" id="safari-forward-btn" style="opacity:0.35;" title="Avançar">
          ${getSFSymbolHtml('chevron.right', { size: 13 })}
        </button>
        <button class="safari-btn" id="safari-reload-btn" title="Recarregar">
          ${getSFSymbolHtml('arrow.clockwise', { size: 13 })}
        </button>
      </div>

      <div style="flex:1;max-width:560px;margin:0 auto;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.12);border-radius:8px;padding:3px 10px;position:relative;border:1px solid rgba(255,255,255,0.04);height:28px;box-sizing:border-box;">
        <div id="safari-url-wrapper" style="display:inline-flex;align-items:center;justify-content:center;gap:5px;max-width:calc(100% - 32px);">
          <img id="safari-favicon" src="https://www.google.com/s2/favicons?domain=google.com&sz=32" style="width:14px;height:14px;object-fit:contain;flex-shrink:0;border-radius:2px;display:none;" alt="Favicon" />
          <input id="safari-url-input" type="text" placeholder="Busque ou digite o nome do site" style="background:none;border:none;outline:none;color:#ffffff;font-size:13px;font-weight:400;text-align:center;width:240px;" />
        </div>
        <span style="position:absolute;right:8px;display:flex;align-items:center;opacity:0.6;cursor:pointer;" title="Ajustes de Exibição">
          ${getSFSymbolHtml('slider.horizontal.3', { size: 13 })}
        </span>
      </div>

      <div style="display:flex;align-items:center;gap:4px;margin-left:12px;">
        <button class="safari-btn" id="safari-share-btn" title="Copiar / Compartilhar Link">
          ${getSFSymbolHtml('square.and.arrow.up', { size: 14 })}
        </button>
        <button class="safari-btn" id="safari-newtab-btn" title="Nova Aba">
          ${getSFSymbolHtml('plus', { size: 14 })}
        </button>
        <button class="safari-btn" id="safari-tabs-btn" style="opacity:0.35;pointer-events:none;" title="Visão Geral das Abas">
          ${getSFSymbolHtml('square.on.square', { size: 14 })}
        </button>
      </div>
    `;

    this.bodyEl = document.createElement('div');
    this.bodyEl.style.cssText = 'flex:1;display:flex;flex-direction:column;background:#28282b;position:relative;overflow:hidden;';

    this.wrapper.appendChild(this.titlebar);
    this.wrapper.appendChild(this.bodyEl);
    this.contentEl.appendChild(this.wrapper);

    this.bindWindowControls();
    this.bindToolbarEvents();
    this.renderStartPage();
    this._bindPortfolioEvent();
  }

  _bindPortfolioEvent() {
    this._portfolioListener = (e) => {
      const { section, showAll } = e.detail || {};
      this.loadPortfolioSection(section, showAll);
    };
    window.addEventListener('portfolio:open', this._portfolioListener);
  }

  loadPortfolioSection(section, showAll = false) {
    const base = 'assets/portfolio.html';
    const sectionParam = (showAll || section === 'all' || !section) ? 'all' : section;
    const url = `${base}?section=${sectionParam}`;

    if (this.historyStack[this.historyIndex] !== url) {
      if (this.historyIndex < this.historyStack.length - 1) {
        this.historyStack.splice(this.historyIndex + 1);
      }
      this.historyStack.push(url);
      this.historyIndex = this.historyStack.length - 1;
    }

    const sectionLabels = {
      'about': 'Sobre — Portfólio', 'sobre': 'Sobre — Portfólio',
      'skills': 'Habilidades — Portfólio', 'habilidades': 'Habilidades — Portfólio',
      'projects': 'Projetos — Portfólio', 'projetos': 'Projetos — Portfólio',
      'contact': 'Contato — Portfólio', 'contato': 'Contato — Portfólio',
      'experience': 'Experiência — Portfólio', 'experiencia': 'Experiência — Portfólio',
      'education': 'Formação — Portfólio', 'formacao': 'Formação — Portfólio',
    };
    const displayVal = sectionParam === 'all' ? 'allvesmatteus.github.io/Portfolio' : (sectionLabels[sectionParam] || 'Portfolio');

    this.currentUrl = url;
    this.updateNavButtons();
    this.updateFavicon('https://allvesmatteus.github.io/Portfolio/');
    this.applyThemeColor('#1a1a1f', true);

    if (this.urlInput) {
      this.urlInput.value = displayVal;
      this.adjustInputWidth(displayVal);
    }

    this.bodyEl.innerHTML = `
      <iframe
        id="safari-iframe"
        src="${url}"
        style="width:100%;height:100%;border:none;background:#0d0d0d;"
        title="Portfólio — Mateus Alves"
      ></iframe>
    `;
  }

  bindWindowControls() {
    const closeBtn = this.titlebar.querySelector('.app-window__btn--close');
    const minBtn = this.titlebar.querySelector('.app-window__btn--minimize');
    const maxBtn = this.titlebar.querySelector('.app-window__btn--zoom');

    if (closeBtn) closeBtn.addEventListener('click', () => this.wm.closeWindow('safari'));
    if (minBtn) minBtn.addEventListener('click', () => this.wm.minimizeWindow('safari'));
    if (maxBtn) maxBtn.addEventListener('click', () => this.wm.maximizeWindow('safari'));
  }

  bindToolbarEvents() {
    this.backBtn = this.titlebar.querySelector('#safari-back-btn');
    this.forwardBtn = this.titlebar.querySelector('#safari-forward-btn');
    this.reloadBtn = this.titlebar.querySelector('#safari-reload-btn');
    this.newTabBtn = this.titlebar.querySelector('#safari-newtab-btn');
    this.shareBtn = this.titlebar.querySelector('#safari-share-btn');
    this.urlInput = this.titlebar.querySelector('#safari-url-input');
    this.faviconImg = this.titlebar.querySelector('#safari-favicon');

    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          const target = this.historyStack[this.historyIndex];
          if (target === 'newtab') {
            this.renderStartPage(false);
          } else {
            this.loadUrl(target, false);
          }
        }
      });
    }

    if (this.forwardBtn) {
      this.forwardBtn.addEventListener('click', () => {
        if (this.historyIndex < this.historyStack.length - 1) {
          this.historyIndex++;
          const target = this.historyStack[this.historyIndex];
          if (target === 'newtab') {
            this.renderStartPage(false);
          } else {
            this.loadUrl(target, false);
          }
        }
      });
    }

    if (this.reloadBtn) {
      this.reloadBtn.addEventListener('click', () => {
        if (this.historyIndex >= 0 && this.historyStack[this.historyIndex]) {
          const target = this.historyStack[this.historyIndex];
          if (target === 'newtab') {
            this.renderStartPage(false);
          } else {
            this.loadUrl(target, false);
          }
        } else {
          this.loadUrl('google.com', true);
        }
      });
    }

    if (this.newTabBtn) {
      this.newTabBtn.addEventListener('click', () => {
        this.renderStartPage(true);
      });
    }

    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', () => {
        let urlToCopy = 'https://allvesmatteus.github.io/Portfolio/';
        if (this.urlInput && this.urlInput.value.trim()) {
          urlToCopy = this.urlInput.value.trim();
          if (!/^https?:\/\//i.test(urlToCopy)) {
            urlToCopy = 'https://' + urlToCopy;
          }
        } else if (this.currentUrl) {
          urlToCopy = this.currentUrl;
        }

        if (navigator.clipboard) {
          navigator.clipboard.writeText(urlToCopy);
        }

        this.shareBtn.style.transform = 'scale(0.85)';
        this.shareBtn.style.opacity = '0.5';
        setTimeout(() => {
          this.shareBtn.style.transform = 'scale(1)';
          this.shareBtn.style.opacity = '1';
        }, 180);
      });
    }

    if (this.urlInput) {
      this.urlInput.addEventListener('mousedown', e => e.stopPropagation());
      this.urlInput.addEventListener('click', () => {
        if (this.urlInput.value) {
          this.urlInput.select();
        } else {
          this.urlInput.placeholder = '';
        }
      });
      this.urlInput.addEventListener('focus', () => {
        if (this.urlInput.value) {
          this.urlInput.select();
        } else {
          this.urlInput.placeholder = '';
        }
      });
      this.urlInput.addEventListener('blur', () => {
        if (!this.urlInput.value) {
          this.urlInput.placeholder = 'Busque ou digite o nome do site';
          this.adjustInputWidth('');
        }
      });
      this.urlInput.addEventListener('input', () => this.adjustInputWidth(this.urlInput.value));
      this.urlInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const val = this.urlInput.value.trim();
          if (val) {
            this.loadUrl(val, true);
          }
        }
      });
    }
  }

  applyThemeColor(color, hideBorder = false) {
    this.wrapper.style.background = color;
    this.titlebar.style.background = color;
    this.bodyEl.style.background = color;
    this.titlebar.style.borderBottom = hideBorder ? 'none' : '1px solid rgba(255, 255, 255, 0.08)';

    const windowEl = this.contentEl.closest('.app-window');
    if (windowEl) {
      windowEl.style.background = color;
    }
  }

  updateNavButtons() {
    if (this.backBtn) this.backBtn.style.opacity = this.historyIndex > 0 ? '0.85' : '0.35';
    if (this.forwardBtn) this.forwardBtn.style.opacity = this.historyIndex < this.historyStack.length - 1 ? '0.85' : '0.35';
  }

  extractDomain(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return 'google.com';
    }
  }

  updateFavicon(url) {
    if (!this.faviconImg) return;
    if (!url || url === 'newtab') {
      this.faviconImg.style.display = 'none';
      return;
    }
    this.faviconImg.style.display = 'inline-block';
    const lower = (url || '').toLowerCase();
    if (lower.includes('portfolio') || lower.includes('allvesmatteus') || lower.includes('assets/portfolio') || lower.includes('sobre') || lower.includes('projetos') || lower.includes('habilidades') || lower.includes('contato')) {
      this.faviconImg.src = 'assets/favicons/favicon.png';
      return;
    }
    const domain = this.extractDomain(url);
    this.faviconImg.src = `https://favicone.com/${domain}?s=128`;
  }

  adjustInputWidth(val) {
    if (!this.urlInput) return;
    if (!val) {
      this.urlInput.style.width = '240px';
      this.urlInput.style.textAlign = 'center';
      return;
    }
    this.urlInput.style.textAlign = 'left';
    const len = val.length;
    const width = Math.max(65, Math.min(380, Math.round(len * 7.5 + 10)));
    this.urlInput.style.width = `${width}px`;
  }

  renderStartPage(pushHistory = true) {
    if (pushHistory) {
      if (this.historyIndex < this.historyStack.length - 1) {
        this.historyStack.splice(this.historyIndex + 1);
      }
      this.historyStack.push('newtab');
      this.historyIndex = this.historyStack.length - 1;
    }

    this.currentUrl = null;
    this.updateNavButtons();
    this.updateFavicon(null);

    if (this.urlInput) {
      this.urlInput.value = '';
      this.urlInput.placeholder = 'Busque ou digite o nome do site';
      this.adjustInputWidth('');
    }

    this.applyThemeColor('#28282b', true);

    const favorites = [
      {
        name: 'Portfólio',
        url: 'assets/portfolio.html',
        domain: 'allvesmatteus.github.io',
        primaryIcon: 'assets/favicons/favicon.png',
        secondaryIcon: 'assets/favicons/logo.svg'
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/allves-matteus/',
        domain: 'linkedin.com',
        primaryIcon: 'https://favicone.com/linkedin.com?s=128',
        secondaryIcon: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128'
      },
      {
        name: 'GitHub',
        url: 'https://github.com/AllvesMatteus',
        domain: 'github.com',
        primaryIcon: 'https://favicone.com/github.com?s=128',
        secondaryIcon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128'
      },
      {
        name: 'WhatsApp',
        url: 'https://wa.me/5511948642383?text=Ol%C3%A1%20Mateus!%20Vim%20pelo%20seu%20Portf%C3%B3lio%20e%20gostaria%20de%20conversar.',
        domain: 'whatsapp.com',
        primaryIcon: 'https://favicone.com/whatsapp.com?s=128',
        secondaryIcon: 'https://www.google.com/s2/favicons?domain=whatsapp.com&sz=128'
      }
    ];

    this.bodyEl.innerHTML = `
      <div style="padding:48px 80px 40px 160px;display:flex;flex-direction:column;height:100%;overflow-y:auto;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;user-select:none;position:relative;">
        <h2 style="font-size:18px;font-weight:700;color:#ffffff;margin:0 0 18px 0;letter-spacing:-0.2px;">Preferidos</h2>
        
        <div style="display:flex;align-items:center;gap:22px;flex-wrap:wrap;margin-bottom:38px;">
          ${favorites.map(item => `
            <div class="safari-favorite-item" data-url="${item.url}" style="display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;width:72px;">
              <div class="safari-fav-icon-box" style="width:64px;height:64px;border-radius:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:transform 0.15s ease, background 0.15s ease;">
                <img src="${item.primaryIcon}" style="width:38px;height:38px;object-fit:contain;border-radius:8px;" alt="${item.name}" onError="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${item.secondaryIcon}';}else if(!this.dataset.globe){this.dataset.globe='1';this.src='assets/icons/sf-symbols/white/globe.png';}" />
              </div>
              <span style="font-size:11.5px;font-weight:500;color:rgba(255,255,255,0.85);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${item.name}</span>
            </div>
          `).join('')}
        </div>

        <h2 style="font-size:18px;font-weight:700;color:#ffffff;margin:0 0 18px 0;letter-spacing:-0.2px;">Abas do iCloud</h2>

        <div class="safari-icloud-card" data-url="google.com" style="width:280px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background 0.15s ease;">
          <div style="width:48px;height:48px;border-radius:10px;background:#202124;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(255,255,255,0.08);">
            <img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" style="width:24px;height:24px;object-fit:contain;" alt="Google" />
          </div>
          <div style="display:flex;flex-direction:column;gap:3px;overflow:hidden;">
            <span style="font-size:12.5px;font-weight:600;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Google</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">google.com</span>
            <span style="font-size:10.5px;color:rgba(255,255,255,0.4);margin-top:2px;display:flex;align-items:center;gap:3px;"><img src="assets/icons/sf-symbols/white/iphone.png" alt="iPhone" style="width:14px;height:14px;object-fit:contain;opacity:0.7;vertical-align:middle;" draggable="false"> em iPhone de Mateus</span>
          </div>
        </div>

        <button style="position:absolute;right:28px;bottom:24px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.8);cursor:pointer;">Editar</button>
      </div>
    `;

    this.bodyEl.querySelectorAll('.safari-favorite-item').forEach(el => {
      el.addEventListener('click', () => {
        const url = el.getAttribute('data-url');
        if (url) this.loadUrl(url, true);
      });
    });

    const icloudCard = this.bodyEl.querySelector('.safari-icloud-card');
    if (icloudCard) {
      icloudCard.addEventListener('click', () => {
        const url = icloudCard.getAttribute('data-url');
        if (url) this.loadUrl(url, true);
      });
    }
  }

  isLocalUrl(url) {
    return url.startsWith('assets/') || url.startsWith('./') || url.startsWith('/');
  }

  resolveUrl(query) {
    let q = query.trim();
    if (!q) return 'newtab';
    if (this.isLocalUrl(q)) return q;
    if (q.toLowerCase() === 'google.com' || q.toLowerCase() === 'google') {
      return 'https://www.google.com/search?igu=1';
    }
    if (/^https?:\/\//i.test(q)) {
      return q;
    }
    if (q.includes('.') && !q.includes(' ')) {
      return 'https://' + q;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(q)}&igu=1`;
  }

  loadUrl(targetUrl, pushHistory = true) {
    if (!targetUrl || targetUrl === 'newtab') {
      this.renderStartPage(pushHistory);
      return;
    }

    const finalUrl = this.resolveUrl(targetUrl);

    if (pushHistory) {
      if (this.historyIndex < this.historyStack.length - 1) {
        this.historyStack.splice(this.historyIndex + 1);
      }
      this.historyStack.push(finalUrl);
      this.historyIndex = this.historyStack.length - 1;
    }

    this.currentUrl = finalUrl;
    this.updateNavButtons();
    this.updateFavicon(finalUrl);

    let displayVal = '';
    if (finalUrl.includes('google.com/search')) {
      const match = finalUrl.match(/[?&]q=([^&]+)/);
      displayVal = match ? decodeURIComponent(match[1]) : 'google.com';
    } else {
      displayVal = finalUrl.replace(/^https?:\/\//i, '');
    }

    if (this.urlInput) {
      this.urlInput.value = displayVal;
      this.adjustInputWidth(displayVal);
    }

    if (finalUrl.includes('google.com')) {
      this.applyThemeColor('#22242A', true);
    } else {
      this.applyThemeColor('#28282b', false);
    }

    let embedUrl = finalUrl;
    if (!finalUrl.includes('google.com/search') && !this.isLocalUrl(finalUrl)) {
      embedUrl = `https://corsproxy.io/?${encodeURIComponent(finalUrl)}`;
    }

    const sandboxAttr = this.isLocalUrl(finalUrl) ? '' : 'sandbox="allow-scripts allow-popups allow-forms"';
    this.bodyEl.innerHTML = `
      <iframe id="safari-iframe" src="${embedUrl}" style="width:100%;height:100%;border:none;background:#ffffff;" title="Safari Web Browser" ${sandboxAttr}></iframe>
    `;

    const iframe = this.bodyEl.querySelector('#safari-iframe');
    if (iframe) {
      iframe.addEventListener('error', () => this._showIframeBlockedMessage(finalUrl));
    }
  }

  _showIframeBlockedMessage(url) {
    const existing = this.bodyEl.querySelector('#safari-iframe');
    if (!existing) return;
    const domain = this.extractDomain(url);
    this.bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;background:#1c1c1e;color:rgba(255,255,255,0.85);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;text-align:center;padding:40px;">
        <img src="https://favicone.com/${domain}?s=64" style="width:48px;height:48px;border-radius:12px;opacity:0.6;" alt="${domain}" onerror="this.style.display='none'" />
        <div style="font-size:17px;font-weight:600;color:#ffffff;">${domain}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);max-width:340px;line-height:1.5;">Este site não permite ser exibido dentro de outro aplicativo.<br/>Abra-o diretamente no seu navegador.</div>
        <a href="${url}" target="_blank" style="margin-top:4px;background:rgba(10,132,255,0.18);border:1px solid rgba(10,132,255,0.35);border-radius:8px;padding:8px 20px;font-size:13px;font-weight:500;color:#0a84ff;text-decoration:none;cursor:pointer;">Abrir no Navegador</a>
      </div>
    `;
  }
}

export function renderSafari(contentEl, wm) {
  const engine = new SafariEngine(contentEl, wm);
  window._safariEngine = engine;
}
