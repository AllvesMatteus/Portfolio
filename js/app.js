import { WindowManager }   from './windowManager.js';
import { Dock }            from './dock.js';
import { MenuBar }         from './menubar.js';
import { Desktop }         from './desktop.js';
import { ContextMenu }     from './contextMenu.js';

import { renderTerminal }   from './apps/terminal.js';
import { renderSafari }     from './apps/safari.js';
import { renderFinder }     from './apps/finder.js';
import { renderSettings }   from './apps/settings.js';

document.addEventListener('contextmenu', (e) => {
  if (e.shiftKey) return;
  e.preventDefault();
}, { capture: true });

function isMobile() {
  const ua = navigator.userAgent;

  if (/Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;

  if (/iPad/i.test(ua) && !window.matchMedia('(pointer: fine)').matches) return true;
  return false;
}

function runBoot() {
  return new Promise(resolve => {
    const bootEl = document.getElementById('boot-screen');
    const barEl = bootEl?.querySelector('.boot-screen__loader-bar');
    if (!bootEl) { resolve(); return; }

    let pct = 0;
    const DURATION = 2500;
    const START = performance.now();

    function step(now) {
      const elapsed = now - START;
      pct = Math.min(100, (elapsed / DURATION) * 100);
      if (barEl) barEl.style.width = `${pct}%`;

      if (pct < 100) {
        requestAnimationFrame(step);
      } else {
        // Fade out boot screen
        bootEl.style.transition = 'opacity 0.4s';
        bootEl.style.opacity = '0';
        setTimeout(() => {
          bootEl.style.display = 'none';
          resolve();
        }, 450);
      }
    }
    requestAnimationFrame(step);
  });
}

// ─── Main init ────────────────────────────────────────────────────────
async function init() {
  // Run boot animation
  await runBoot();

  // Check mobile
  if (isMobile()) {
    document.getElementById('mobile-not-supported').style.display = 'flex';
    return;
  }

  // Show app
  const appEl = document.getElementById('app');
  if (appEl) appEl.style.display = 'block';

  // Apply dark-theme class permanently
  document.documentElement.classList.remove('light-theme');
  document.documentElement.classList.add('dark-theme');
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
  localStorage.removeItem('theme');

  // Init core systems
  const wm = new WindowManager(document.getElementById('window-container'));
  const contextMenu = new ContextMenu();
  const desktop = new Desktop(wm, contextMenu);
  desktop.restoreWallpaper();

  // Register all apps
  wm.registerApp('terminal',   (el) => renderTerminal(el, wm));
  wm.registerApp('safari',     (el) => renderSafari(el, wm));
  wm.registerApp('finder',     (el) => renderFinder(el, wm));
  wm.registerApp('settings',   (el) => renderSettings(el, wm, desktop));

  // Init UI components
  const menuBar = new MenuBar(wm);

  const dockEl = document.getElementById('dock');
  if (dockEl) {
    new Dock(dockEl, wm);
  }

  console.log('%cmacweb.dev 🍎', 'font-size:18px;font-weight:bold;color:#ff375f;');
  console.log('%cBrowser-native macOS desktop environment', 'font-size:13px;color:#0a84ff;');
  console.log('%chttps://github.com/gaminghackintosh/macweb.dev', 'font-size:12px;color:#34c759;');
}

// ─── Start ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
