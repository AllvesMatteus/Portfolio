/**
 * Dock — macOS Dock with Gaussian spring magnification
 * Ports Dock.jsx to vanilla JS
 */

const BASE_ICON_SIZE = 58;
const MAX_SCALE = 1.1;
const SIGMA = 62;
const LIFT = 22;

export const APPS = [
  { id: 'finder',     name: 'Finder',     iconDark: 'assets/icons/custom/finder.png',     iconLight: 'assets/icons/custom/finder.png',     fallback: '🗂' },
  { id: 'safari',     name: 'Safari',     iconDark: 'assets/icons/custom/safari.png',     iconLight: 'assets/icons/custom/safari.png',     fallback: '🧭' },
  { id: 'calendar',   name: 'Calendar',   iconDark: 'assets/icons/apps/Dark_Themes/Calendrier_Dark.png', iconLight: 'assets/icons/apps/Light_Themes/Calendrier.png', fallback: '📅' },
  { id: 'music',      name: 'Music',      iconDark: 'assets/icons/apps/Dark_Themes/Music_Dark.png',      iconLight: 'assets/icons/apps/Light_Themes/apple_music.ico', fallback: '🎵' },
  { type: 'divider' },
  { id: 'notes',      name: 'Notes',      iconDark: 'assets/icons/apps/Dark_Themes/Notes_Dark.png',      iconLight: 'assets/icons/apps/Light_Themes/Notes.png',      fallback: '📒' },
  { id: 'calculator', name: 'Calculator', iconDark: 'assets/icons/apps/Dark_Themes/Calculator_Dark.png', iconLight: 'assets/icons/apps/Light_Themes/Calculator.png', fallback: '🧮' },
  { id: 'terminal',   name: 'Terminal',   iconDark: 'assets/icons/custom/terminal.png',   iconLight: 'assets/icons/custom/terminal.png',   fallback: '🖥' },
  { id: 'settings',   name: 'Settings',   iconDark: 'assets/icons/custom/settings.png',   iconLight: 'assets/icons/custom/settings.png',   fallback: '⚙️' },
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
  constructor(dockEl, githubEl, wm, themeManager) {
    this.dockEl = dockEl;
    this.githubEl = githubEl;
    this.wm = wm;
    this.themeManager = themeManager;
    this.isLight = themeManager.isLight;

    this.mainMag = new DockMagnification(dockEl);
    this.githubMag = new DockMagnification(githubEl);

    this._itemEls = [];
    this._build();

    // Listen to theme changes
    themeManager.onChange(isLight => {
      this.isLight = isLight;
      this._updateIcons();
    });

    // Listen to window manager changes
    wm.onChange(state => this._updateIndicators(state));

    // Bind magnification events
    dockEl.addEventListener('mouseenter', e => this.mainMag.onMouseEnter(e));
    dockEl.addEventListener('mousemove', e => this.mainMag.onMouseMove(e));
    dockEl.addEventListener('mouseleave', e => this.mainMag.onMouseLeave(e));

    githubEl.addEventListener('mouseenter', e => this.githubMag.onMouseEnter(e));
    githubEl.addEventListener('mousemove', e => this.githubMag.onMouseMove(e));
    githubEl.addEventListener('mouseleave', e => this.githubMag.onMouseLeave(e));

    // GitHub button
    const ghBtn = document.getElementById('dock-github-btn');
    if (ghBtn) {
      ghBtn.addEventListener('click', () => window.open('https://github.com/gaminghackintosh/macweb.dev', '_blank'));
      ghBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open('https://github.com/gaminghackintosh/macweb.dev', '_blank'); } });
      this.githubMag.register(ghBtn, 0);
    }
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
      img.src = this.isLight ? app.iconLight : app.iconDark;
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

      // Indicator
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

      // Click handler
      item.addEventListener('click', () => this.wm.openApp(app.id, app.name));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.wm.openApp(app.id, app.name); }
      });

      // Register for magnification
      this.mainMag.register(item, itemIndex);
      this._itemEls.push({ item, img, app, dot });
      itemIndex++;
    });
  }

  _updateIcons() {
    this._itemEls.forEach(({ img, app }) => {
      if (!img) return;
      img.src = this.isLight ? app.iconLight : app.iconDark;
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
