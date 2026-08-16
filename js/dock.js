import { showMacDialog } from './macDialog.js';

const BASE_ICON_SIZE = 60;
const RADIUS = 145;
const MAX_SCALE = 2.0;
const MAX_LIFT = 30;
const STIFFNESS = 280;
const DAMPING = 22;

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
    this.wrappers = [];
    this.items = [];
    this.targetScales = [];
    this.currentScales = [];
    this.velocityScales = [];
    this.targetLifts = [];
    this.currentLifts = [];
    this.velocityLifts = [];
    this.targetWidths = [];
    this.currentWidths = [];
    this.velocityWidths = [];
    this.centers = [];
    this.mouseX = null;
    this.raf = null;
    this.isHovered = false;
    this.lastTime = null;
  }

  register(wrapperEl, itemEl, index) {
    this.wrappers[index] = wrapperEl;
    this.items[index] = itemEl;
    this.targetScales[index] = 1;
    this.currentScales[index] = 1;
    this.velocityScales[index] = 0;
    this.targetLifts[index] = 0;
    this.currentLifts[index] = 0;
    this.velocityLifts[index] = 0;
    this.targetWidths[index] = BASE_ICON_SIZE;
    this.currentWidths[index] = BASE_ICON_SIZE;
    this.velocityWidths[index] = 0;
  }

  measure() {
    if (!this.container) return;
    const cRect = this.container.getBoundingClientRect();
    this.centers = this.wrappers.map(el => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return (r.left + r.right) / 2 - cRect.left;
    });
  }

  updateTargets() {
    this.items.forEach((el, i) => {
      if (!el) return;
      if (!this.isHovered || this.mouseX === null) {
        this.targetScales[i] = 1;
        this.targetLifts[i] = 0;
        this.targetWidths[i] = BASE_ICON_SIZE;
        return;
      }
      const center = this.centers[i] ?? 0;
      const dist = Math.abs(this.mouseX - center);

      if (dist < RADIUS) {
        const cosVal = Math.cos((dist / RADIUS) * (Math.PI / 2));
        const factor = Math.pow(cosVal, 2);
        this.targetScales[i] = 1 + (MAX_SCALE - 1) * factor;
        this.targetLifts[i] = MAX_LIFT * factor;
        this.targetWidths[i] = BASE_ICON_SIZE + (BASE_ICON_SIZE * (MAX_SCALE - 1) * 0.75) * factor;
      } else {
        this.targetScales[i] = 1;
        this.targetLifts[i] = 0;
        this.targetWidths[i] = BASE_ICON_SIZE;
      }
    });
  }

  animate(now) {
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min(0.032, (now - this.lastTime) / 1000 || 0.016);
    this.lastTime = now;

    this.updateTargets();
    let isMoving = false;

    this.items.forEach((el, i) => {
      if (!el) return;
      const wrapper = this.wrappers[i];

      const ts = this.targetScales[i];
      const tl = this.targetLifts[i];
      const tw = this.targetWidths[i];

      const fs = (ts - this.currentScales[i]) * STIFFNESS - this.velocityScales[i] * DAMPING;
      this.velocityScales[i] += fs * dt;
      this.currentScales[i] += this.velocityScales[i] * dt;

      const fl = (tl - this.currentLifts[i]) * STIFFNESS - this.velocityLifts[i] * DAMPING;
      this.velocityLifts[i] += fl * dt;
      this.currentLifts[i] += this.velocityLifts[i] * dt;

      const fw = (tw - this.currentWidths[i]) * STIFFNESS - this.velocityWidths[i] * DAMPING;
      this.velocityWidths[i] += fw * dt;
      this.currentWidths[i] += this.velocityWidths[i] * dt;

      const scale = this.currentScales[i];
      const lift = this.currentLifts[i];
      const width = this.currentWidths[i];

      if (Math.abs(ts - scale) > 0.001 || Math.abs(tl - lift) > 0.01 || Math.abs(this.velocityScales[i]) > 0.01) {
        isMoving = true;
      }

      if (wrapper) {
        wrapper.style.width = `${width.toFixed(2)}px`;
      }

      if (scale > 1.002 || lift > 0.1) {
        el.style.transform = `translate3d(0, ${-lift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.zIndex = Math.round(scale * 100).toString();
      } else {
        el.style.transform = '';
        el.style.zIndex = '';
      }
    });

    if (isMoving || this.isHovered) {
      this.raf = requestAnimationFrame(t => this.animate(t));
    } else {
      this.items.forEach((el, i) => {
        if (!el) return;
        el.style.transform = '';
        el.style.zIndex = '';
        if (this.wrappers[i]) this.wrappers[i].style.width = '';
        this.currentScales[i] = 1;
        this.velocityScales[i] = 0;
        this.currentLifts[i] = 0;
        this.velocityLifts[i] = 0;
        this.currentWidths[i] = BASE_ICON_SIZE;
        this.velocityWidths[i] = 0;
      });
      this.raf = null;
      this.lastTime = null;
    }
  }

  onMouseEnter() {
    this.isHovered = true;
    this.measure();
    this.container.classList.add('dock--interacting');
    if (!this.raf) {
      this.lastTime = performance.now();
      this.raf = requestAnimationFrame(t => this.animate(t));
    }
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    if (!this.raf) {
      this.lastTime = performance.now();
      this.raf = requestAnimationFrame(t => this.animate(t));
    }
  }

  onMouseLeave() {
    this.isHovered = false;
    this.mouseX = null;
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

    wm.onChange(state => this._updateIndicators(state));

    dockEl.addEventListener('mouseenter', e => this.mainMag.onMouseEnter(e));
    dockEl.addEventListener('mousemove',  e => this.mainMag.onMouseMove(e));
    dockEl.addEventListener('mouseleave', e => this.mainMag.onMouseLeave(e));
  }

  _build() {
    this.dockEl.innerHTML = '';
    this._itemEls = [];
    let itemIndex = 0;

    APPS.forEach((app) => {
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

      const tooltip = document.createElement('div');
      tooltip.className = 'dock__tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.textContent = app.name;

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

      this.mainMag.register(wrapper, item, itemIndex);
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
