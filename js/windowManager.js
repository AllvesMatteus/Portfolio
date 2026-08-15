const DOCK_HEIGHT = 80;
const MENUBAR_HEIGHT = 28;

export const INITIAL_POSITIONS = {
  finder: { x: 0, y: 0, w: 1020, h: 650 },
  safari: { x: 0, y: 0, w: 850, h: 850 },
  terminal: { x: 0, y: 0, w: 680, h: 440 },
  settings: { x: 0, y: 0, w: 850, h: 580 },
};

export class WindowManager {
  constructor(container) {
    this.container = container;
    this.windows = [];
    this.openApps = [];
    this.minimizedApps = new Set();
    this.activeWin = null;
    this.zCounter = 100;
    this._listeners = [];
    this._appRenderers = {};
  }

  registerApp(appId, renderFn) {
    this._appRenderers[appId] = renderFn;
  }

  openApp(appId, appName) {
    const existing = this.windows.find(w => w.id === appId);

    if (existing) {

      if (this.minimizedApps.has(appId)) {
        this.minimizedApps.delete(appId);
        existing.el.classList.remove('app-window--minimized');
      }
      this.focusWindow(appId);
      return;
    }

    const initialConfig = INITIAL_POSITIONS[appId] || { w: 800, h: 500 };
    const winWidth = Math.min(initialConfig.w, window.innerWidth - 40);
    const winHeight = Math.min(initialConfig.h, window.innerHeight - MENUBAR_HEIGHT - DOCK_HEIGHT - 20);

    const centerX = Math.max(0, Math.round((window.innerWidth - winWidth) / 2));
    const centerY = Math.max(MENUBAR_HEIGHT + 10, Math.round((window.innerHeight - MENUBAR_HEIGHT - DOCK_HEIGHT - winHeight) / 2) + MENUBAR_HEIGHT);

    const p = {
      x: centerX,
      y: centerY,
      w: winWidth,
      h: winHeight
    };
    const zIndex = ++this.zCounter;

    const el = this._createWindowElement(appId, appName || appId, p, zIndex);
    this.container.appendChild(el);

    const win = { id: appId, title: appName || appId, el, x: p.x, y: p.y, w: p.w, h: p.h, zIndex };
    this.windows.push(win);
    if (!this.openApps.includes(appId)) this.openApps.push(appId);
    this.focusWindow(appId);

    const contentEl = el.querySelector('.app-window__content');
    const renderer = this._appRenderers[appId];
    if (renderer) renderer(contentEl, this);

    this._notify();
    this._makeDraggable(el, win);
    this._makeResizable(el, win);
  }

  closeWindow(appId) {
    const win = this.windows.find(w => w.id === appId);
    if (!win) return;

    win.el.classList.add('app-window--closing');
    setTimeout(() => {
      if (win.el.parentNode) win.el.parentNode.removeChild(win.el);
    }, 200);

    this.windows = this.windows.filter(w => w.id !== appId);
    this.openApps = this.openApps.filter(id => id !== appId);
    this.minimizedApps.delete(appId);
    if (this.activeWin === appId) {
      this.activeWin = null;
      const remaining = this.windows.filter(w => !this.minimizedApps.has(w.id));
      if (remaining.length > 0) {
        remaining.sort((a, b) => b.zIndex - a.zIndex);
        this.focusWindow(remaining[0].id);
      }
    }
    this._notify();
  }

  minimizeWindow(appId) {
    const win = this.windows.find(w => w.id === appId);
    if (!win) return;
    this.minimizedApps.add(appId);
    win.el.classList.add('app-window--minimized');
    if (this.activeWin === appId) {
      this.activeWin = null;
      const remaining = this.windows.filter(w => !this.minimizedApps.has(w.id));
      if (remaining.length > 0) {
        remaining.sort((a, b) => b.zIndex - a.zIndex);
        this.focusWindow(remaining[0].id);
      }
    }
    this._notify();
  }

  maximizeWindow(appId) {
    const win = this.windows.find(w => w.id === appId);
    if (!win) return;

    const isMaximized = win._maximized;
    if (isMaximized) {

      win.el.style.transform = `translate3d(${win._prevX}px, ${win._prevY}px, 0)`;
      win.el.style.width = `${win._prevW}px`;
      win.el.style.height = `${win._prevH}px`;
      win._maximized = false;
    } else {

      win._prevX = win.x;
      win._prevY = win.y;
      win._prevW = win.w;
      win._prevH = win.h;

      const newW = window.innerWidth;
      const newH = window.innerHeight - MENUBAR_HEIGHT - DOCK_HEIGHT;
      win.el.style.transform = `translate3d(0px, ${MENUBAR_HEIGHT}px, 0)`;
      win.el.style.width = `${newW}px`;
      win.el.style.height = `${newH}px`;
      win.x = 0;
      win.y = MENUBAR_HEIGHT;
      win.w = newW;
      win.h = newH;
      win._maximized = true;
    }
  }

  focusWindow(appId) {
    if (this.activeWin === appId) return;

    const win = this.windows.find(w => w.id === appId);
    if (!win) return;

    const zIndex = ++this.zCounter;
    win.zIndex = zIndex;
    win.el.style.zIndex = zIndex;

    this.windows.forEach(w => {
      w.el.classList.remove('app-window--active');
      w.el.classList.add('app-window--inactive');
    });
    win.el.classList.add('app-window--active');
    win.el.classList.remove('app-window--inactive');

    this.activeWin = appId;
    this._notify();
  }

  _createWindowElement(appId, title, p, zIndex) {
    const el = document.createElement('div');
    el.className = 'app-window app-window--active';
    el.id = `window-${appId}`;
    el.style.cssText = `
      position: fixed;
      transform: translate3d(${p.x}px, ${p.y}px, 0);
      width: ${p.w}px;
      height: ${p.h}px;
      z-index: ${zIndex};
      will-change: transform;
      contain: layout style paint;
      touch-action: none;
    `;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', `${title} window`);

    el.innerHTML = `
      <div class="app-window__content" style="contain: content; height: 100%; overflow: hidden;"></div>
      <div class="resize-handle" aria-hidden="true"></div>
    `;

    el.addEventListener('mousedown', () => this.focusWindow(appId));
    el.addEventListener('contextmenu', e => e.stopPropagation());

    return el;
  }

  _makeDraggable(el, win) {

    el.addEventListener('mousedown', (e) => {
      const titlebar = e.target.closest('.app-window__titlebar');
      if (!titlebar) return;
      if (e.button !== 0) return;
      if (win._maximized) return;
      if (e.target.closest('button')) return;

      e.preventDefault();
      this.focusWindow(win.id);

      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const winWidth = rect.width;

      el.classList.add('app-window--dragging');
      el.style.willChange = 'transform';
      el.style.transition = 'none';
      el.style.pointerEvents = 'none';

      const onMove = (ev) => {
        const newX = Math.max(0, Math.min(window.innerWidth - winWidth, ev.clientX - offsetX));
        const newY = Math.max(MENUBAR_HEIGHT, ev.clientY - offsetY);
        el.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      };

      const onUp = (ev) => {
        el.classList.remove('app-window--dragging');
        el.style.willChange = '';
        el.style.transition = '';
        el.style.pointerEvents = '';

        const finalX = Math.max(0, Math.min(window.innerWidth - winWidth, ev.clientX - offsetX));
        const finalY = Math.max(MENUBAR_HEIGHT, ev.clientY - offsetY);
        win.x = finalX;
        win.y = finalY;

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseup', onUp, { passive: true });
    });
  }

  _makeResizable(el, win) {
    const handle = el.querySelector('.resize-handle');
    if (!handle) return;

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.focusWindow(win.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = el.offsetWidth;
      const startH = el.offsetHeight;

      el.classList.add('app-window--resizing');
      el.style.willChange = 'width, height';
      el.style.transition = 'none';
      el.style.pointerEvents = 'none';

      const onMove = (ev) => {
        const newW = Math.max(250, startW + (ev.clientX - startX));
        const newH = Math.max(200, startH + (ev.clientY - startY));
        el.style.width = `${newW}px`;
        el.style.height = `${newH}px`;
      };

      const onUp = () => {
        el.classList.remove('app-window--resizing');
        el.style.willChange = '';
        el.style.transition = '';
        el.style.pointerEvents = '';
        win.w = parseFloat(el.style.width) || win.w;
        win.h = parseFloat(el.style.height) || win.h;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseup', onUp, { passive: true });
    });
  }

  onChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  _notify() {
    this._listeners.forEach(fn => fn({
      windows: this.windows,
      openApps: this.openApps,
      minimizedApps: this.minimizedApps,
      activeWin: this.activeWin,
    }));
  }

  static buildTitleBar(appId, title, wm, { showTitle = true, disableMinimize = false, disableMaximize = false, isUnsaved = false } = {}) {
    const bar = document.createElement('div');
    bar.className = 'app-window__titlebar';
    bar.innerHTML = `
      <div class="app-window__controls traffic-lights-container">
        <button class="app-window__btn app-window__btn--close traffic-light traffic-close" aria-label="Close ${title}" title="Close">
          ${isUnsaved
        ? `<svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon close-dot-icon"><circle cx="6" cy="6" r="2.5" fill="#460804"/></svg>`
        : `<svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon close-icon"><line x1="3" y1="3" x2="9" y2="9" stroke="#460804" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="3" x2="3" y2="9" stroke="#460804" stroke-width="1.5" stroke-linecap="round"/></svg>`
      }
        </button>
        <button class="app-window__btn app-window__btn--minimize traffic-light traffic-minimize" aria-label="Minimize ${title}" title="Minimize" ${disableMinimize ? 'disabled' : ''}>
          <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon minimize-icon"><line x1="2" y1="6" x2="10" y2="6" stroke="#90591d" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
        <button class="app-window__btn app-window__btn--zoom traffic-light traffic-maximize" aria-label="Zoom ${title}" title="Zoom" ${disableMaximize ? 'disabled' : ''}>
          <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon maximize-icon"><rect x="3" y="3" width="6" height="6" fill="none" stroke="#2a6218" stroke-width="1.2" rx="1"/></svg>
          <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon maximize-plus-icon" style="display:none;"><line x1="6" y1="2" x2="6" y2="10" stroke="#2a6218" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="6" x2="10" y2="6" stroke="#2a6218" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
      ${showTitle ? `<div class="app-window__title">${title}</div>` : ''}
    `;

    const closeBtn = bar.querySelector('.app-window__btn--close');
    const minBtn = bar.querySelector('.app-window__btn--minimize');
    const zoomBtn = bar.querySelector('.app-window__btn--zoom');

    if (closeBtn) closeBtn.addEventListener('click', () => wm.closeWindow(appId));
    if (minBtn && !disableMinimize) minBtn.addEventListener('click', () => wm.minimizeWindow(appId));
    if (zoomBtn && !disableMaximize) zoomBtn.addEventListener('click', () => wm.maximizeWindow(appId));

    return bar;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.altKey || e.key === 'Alt') {
    document.body.classList.add('alt-key-down');
  }
});
document.addEventListener('keyup', (e) => {
  if (!e.altKey) {
    document.body.classList.remove('alt-key-down');
  }
});
