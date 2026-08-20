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

async function init() {
  await runBoot();

  if (isMobile()) {
    window.location.replace('assets/portfolio.html');
    return;
  }

  const appEl = document.getElementById('app');
  if (appEl) appEl.style.display = 'block';

  document.documentElement.classList.remove('light-theme');
  document.documentElement.classList.add('dark-theme');
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
  localStorage.removeItem('theme');

  const wm = new WindowManager(document.getElementById('window-container'));
  const contextMenu = new ContextMenu();
  const desktop = new Desktop(wm, contextMenu);
  desktop.restoreWallpaper();

  wm.registerApp('terminal',   (el) => renderTerminal(el, wm));
  wm.registerApp('safari',     (el) => renderSafari(el, wm));
  wm.registerApp('finder',     (el) => renderFinder(el, wm));
  wm.registerApp('settings',   (el) => renderSettings(el, wm, desktop));

  const menuBar = new MenuBar(wm);

  const dockEl = document.getElementById('dock');
  if (dockEl) {
    new Dock(dockEl, wm);
  }

  console.log('%cMateus OS 🚀', 'font-size:18px;font-weight:bold;color:#6366f1;');
  console.log('%cFull Stack Software Engineer & Interactive Desktop Portfolio', 'font-size:13px;color:#0a84ff;');
  console.log('%chttps://github.com/AllvesMatteus/Portfolio', 'font-size:12px;color:#34c759;');

  import('./welcomeAlert.js').then(m => m.initWelcomeAlert());
}

document.addEventListener('DOMContentLoaded', init);
