import { showMacDialog } from './macDialog.js';

const BASE_ICON_SIZE = 60;
const MAX_SCALE = 1.1;
const SIGMA = 62;
const LIFT = 22;

export const APPS = [
  { id: 'finder',    name: 'Finder',             iconDark: 'assets/icons/dock/finder.png',         iconLight: 'assets/icons/dock/finder.png',         fallback: '🗂' },
  { id: 'safari',    name: 'Safari',             iconDark: 'assets/icons/dock/safari.png',         iconLight: 'assets/icons/dock/safari.png',         fallback: '🧭' },
  { id: 'windows11', name: 'Windows 11',          iconDark: 'assets/icons/dock/windows11.png',       iconLight: 'assets/icons/dock/windows11.png',       fallback: '🪟', alertMessage: 'Em breve.' },
  { id: 'github',    name: 'GitHub',             iconDark: 'assets/icons/dock/github-desktop.png', iconLight: 'assets/icons/dock/github-desktop.png', fallback: '🐙', url: 'https://github.com/AllvesMatteus' },
  { id: 'terminal',  name: 'Terminal',           iconDark: 'assets/icons/dock/terminal.png',       iconLight: 'assets/icons/dock/terminal.png',       fallback: '🖥' },
  { id: 'settings',  name: 'Ajustes do Sistema', iconDark: 'assets/icons/dock/settings.png',       iconLight: 'assets/icons/dock/settings.png',       fallback: '⚙️' },
  { type: 'divider' },
  { id: 'trash',     name: 'Lixeira',            iconDark: 'assets/icons/dock/empty-bin.png',      iconLight: 'assets/icons/dock/empty-bin.png',      fallback: '🗑️', noOpen: true },
];

class DockMagnification {
  constructor(container) {
    this.container = container;
    this.items = [];
    this.centers = [];
    this.mouseX = null;
    this.raf = null;
  }

  register(el, index) {
    this.items[index] = el;
  }

  measure() {
    if (!this.container) return;
    const cRect = this.container.getBoundingClientRect();
    this.centers = this.items.map(el => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return (r.left + r.right) / 2 - cRect.left;
    });
  }

  apply() {
    this.raf = null;
    const mouseX = this.mouseX;
    this.items.forEach((el, i) => {
      if (!el) return;
      if (mouseX == null) {
        el.style.transform = '';
        el.style.zIndex = '';
        return;
      }
      const center = this.centers[i] ?? 0;
      const d = mouseX - center;
      const scale = 1 + (MAX_SCALE - 1) * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
      const lift = (LIFT * (scale - 1)) / (MAX_SCALE - 1);
      el.style.transform = `translateZ(0) scale(${scale.toFixed(3)}) translateY(${-lift.toFixed(2)}px)`;
      el.style.zIndex = scale > 1.015 ? '50' : '';
    });
  }

  schedule() {
    if (this.raf != null) return;
    this.raf = requestAnimationFrame(() => this.apply());
  }

  onMouseEnter() {
    this.measure();
    this.container.classList.add('dock--interacting');
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.schedule();
  }

  onMouseLeave() {
    this.mouseX = null;
    this.schedule();
    this.container.classList.remove('dock--interacting');
  }
}

export class Dock {
  constructor(dockEl, wm) {
    this.dockEl = dockEl;
    this.wm = wm;

    this.mainMag = new DockMagnification(dockEl);

    this._itemEls = [];
    this._build();

    // Listen to window manager changes
    wm.onChange(state => this._updateIndicators(state));

    // Bind magnification events
    dockEl.addEventListener('mouseenter', e => this.mainMag.onMouseEnter(e));
    dockEl.addEventListener('mousemove',  e => this.mainMag.onMouseMove(e));
    dockEl.addEventListener('mouseleave', e => this.mainMag.onMouseLeave(e));
  }

  _build() {
    this.dockEl.innerHTML = '';
    this._itemEls = [];
    let itemIndex = 0;

    APPS.forEach((app, idx) => {
      if (app.type === 'divider') {
        const sep = document.createElement('div');
        sep.className = 'dock__separator';
        sep.setAttribute('aria-hidden', 'true');
        this.dockEl.appendChild(sep);
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'dock__item-wrapper';

      const item = document.createElement('div');
      item.className = 'dock__item';
      item.dataset.appId = app.id;
      item.role = 'button';
      item.setAttribute('aria-label', `Launch ${app.name} app`);
      item.tabIndex = 0;
      item.style.contain = 'layout style';

      // Tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'dock__tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.textContent = app.name;

      // Icon
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'dock__icon-wrapper';

      const img = document.createElement('img');
      img.src = app.iconDark;
      img.alt = app.name;
      img.draggable = false;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.cssText = `width:${BASE_ICON_SIZE}px;height:${BASE_ICON_SIZE}px;`;
      img.onerror = () => {
        iconWrapper.innerHTML = `<span style="font-size:42px;line-height:${BASE_ICON_SIZE}px;">${app.fallback}</span>`;
      };
      img.dataset.darkSrc = app.iconDark;
      img.dataset.lightSrc = app.iconLight;

      iconWrapper.appendChild(img);

      const indicator = document.createElement('div');
      indicator.className = 'dock__indicator';
      indicator.dataset.appId = app.id;
      const dot = document.createElement('div');
      dot.className = 'dock__indicator-dot';
      dot.style.display = 'none';
      indicator.appendChild(dot);

      item.appendChild(tooltip);
      item.appendChild(iconWrapper);
      item.appendChild(indicator);
      wrapper.appendChild(item);
      this.dockEl.appendChild(wrapper);

      item.addEventListener('click', () => {
        if (app.alertMessage) {
          showMacDialog({ icon: app.iconDark, title: app.name, message: app.alertMessage });
          return;
        }
        if (app.url) { window.open(app.url, '_blank'); return; }
        if (app.noOpen) return;
        this.wm.openApp(app.id, app.name);
      });
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (app.alertMessage) {
            showMacDialog({ icon: app.iconDark, title: app.name, message: app.alertMessage });
            return;
          }
          if (app.url) { window.open(app.url, '_blank'); return; }
          if (app.noOpen) return;
          this.wm.openApp(app.id, app.name);
        }
      });

      this.mainMag.register(item, itemIndex);
      this._itemEls.push({ item, img, app, dot });
      itemIndex++;
    });
  }

  _updateIndicators({ openApps, minimizedApps }) {
    this._itemEls.forEach(({ dot, app }) => {
      if (!dot) return;
      const isOpen = openApps.includes(app.id);
      const isMinimized = minimizedApps.has(app.id);
      dot.style.display = isOpen ? 'block' : 'none';
      if (isMinimized) {
        dot.classList.add('dock__indicator-dot--minimized');
      } else {
        dot.classList.remove('dock__indicator-dot--minimized');
      }
    });
  }
}
