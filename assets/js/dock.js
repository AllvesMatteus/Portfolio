import { showMacDialog } from './macDialog.js';

const BASE_ICON_SIZE = 60;
const RADIUS = 110;
const MAX_SCALE = 1.10;
const MAX_LIFT = 7;
const LERP_FACTOR = 0.22;

export const APPS = [
  { id: 'finder',    name: 'Finder',             iconDark: 'assets/icons/dock/finder.png',         iconLight: 'assets/icons/dock/finder.png',         fallback: '🗂' },
  { id: 'launchpad', name: 'Launchpad',          iconDark: 'assets/icons/dock/launchpad.png',      iconLight: 'assets/icons/dock/launchpad.png',      fallback: '🚀', alertMessage: 'Em breve.' },
  { id: 'safari',    name: 'Safari',             iconDark: 'assets/icons/dock/safari.png',         iconLight: 'assets/icons/dock/safari.png',         fallback: '🧭' },
  { id: 'windows11', name: 'Windows 11',          iconDark: 'assets/icons/dock/windows11.png',       iconLight: 'assets/icons/dock/windows11.png',       fallback: '🪟', alertMessage: 'Em breve.' },
  { id: 'github',    name: 'GitHub',             iconDark: 'assets/icons/dock/github-desktop.png', iconLight: 'assets/icons/dock/github-desktop.png', fallback: '🐙', url: 'https://github.com/AllvesMatteus' },
  { id: 'linkedin',  name: 'LinkedIn',           iconDark: 'assets/icons/dock/linkedIn.png',       iconLight: 'assets/icons/dock/linkedIn.png',       fallback: '💼', url: 'https://www.linkedin.com/in/allves-matteus/' },
  { id: 'whatsapp',  name: 'WhatsApp',           iconDark: 'assets/icons/dock/WhatsApp.png',       iconLight: 'assets/icons/dock/WhatsApp.png',       fallback: '💬', url: 'https://wa.me/5511948642383?text=Ol%C3%A1%20Mateus!%20Vim%20pelo%20seu%20Portf%C3%B3lio%20e%20gostaria%20de%20conversar.' },
  { id: 'terminal',  name: 'Terminal',           iconDark: 'assets/icons/dock/terminal.png',       iconLight: 'assets/icons/dock/terminal.png',       fallback: '🖥' },
  { id: 'settings',  name: 'Ajustes do Sistema', iconDark: 'assets/icons/dock/settings.png',       iconLight: 'assets/icons/dock/settings.png',       fallback: '⚙️' },
  { type: 'divider' },
  { id: 'trash',     name: 'Lixo',               iconDark: 'assets/icons/dock/empty-bin.png',      iconLight: 'assets/icons/dock/empty-bin.png',      fallback: '🗑️' },
];

class DockMagnification {
  constructor(container) {
    this.container = container;
    this.items = [];
    this.targetScales = [];
    this.currentScales = [];
    this.targetLifts = [];
    this.currentLifts = [];
    this.centers = [];
    this.mouseX = null;
    this.raf = null;
    this.isHovered = false;
  }

  register(el, index) {
    this.items[index] = el;
    this.targetScales[index] = 1;
    this.currentScales[index] = 1;
    this.targetLifts[index] = 0;
    this.currentLifts[index] = 0;
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

  updateTargets() {
    this.items.forEach((el, i) => {
      if (!el) return;
      if (!this.isHovered || this.mouseX === null) {
        this.targetScales[i] = 1;
        this.targetLifts[i] = 0;
        return;
      }
      const center = this.centers[i] ?? 0;
      const dist = Math.abs(this.mouseX - center);

      if (dist < RADIUS) {
        const cosVal = Math.cos((dist / RADIUS) * (Math.PI / 2));
        const factor = Math.pow(cosVal, 2);
        this.targetScales[i] = 1 + (MAX_SCALE - 1) * factor;
        this.targetLifts[i] = MAX_LIFT * factor;
      } else {
        this.targetScales[i] = 1;
        this.targetLifts[i] = 0;
      }
    });
  }

  animate() {
    this.updateTargets();
    let isMoving = false;

    this.items.forEach((el, i) => {
      if (!el) return;
      const targetS = this.targetScales[i];
      const targetL = this.targetLifts[i];

      this.currentScales[i] += (targetS - this.currentScales[i]) * LERP_FACTOR;
      this.currentLifts[i] += (targetL - this.currentLifts[i]) * LERP_FACTOR;

      const scale = this.currentScales[i];
      const lift = this.currentLifts[i];

      if (Math.abs(targetS - scale) > 0.001 || Math.abs(targetL - lift) > 0.01) {
        isMoving = true;
      }

      if (scale > 1.002) {
        el.style.transform = `translate3d(0, ${-lift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.zIndex = Math.round(scale * 100).toString();
      } else {
        el.style.transform = '';
        el.style.zIndex = '';
      }
    });

    if (isMoving || this.isHovered) {
      this.raf = requestAnimationFrame(() => this.animate());
    } else {
      this.items.forEach((el, i) => {
        if (!el) return;
        el.style.transform = '';
        el.style.zIndex = '';
        this.currentScales[i] = 1;
        this.currentLifts[i] = 0;
      });
      this.raf = null;
    }
  }

  onMouseEnter() {
    this.isHovered = true;
    this.measure();
    this.container.classList.add('dock--interacting');
    if (!this.raf) {
      this.animate();
    }
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    if (!this.raf) {
      this.animate();
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
    this._updateIndicators({ openApps: wm.openApps, minimizedApps: wm.minimizedApps });

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

      let hoverTimer = null;
      wrapper.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          tooltip.classList.add('dock__tooltip--visible');
        }, 200);
      });
      wrapper.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        tooltip.classList.remove('dock__tooltip--visible');
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
