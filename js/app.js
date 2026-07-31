/**
 * app.js — Entry point: Boot screen, mobile check, and init
 * Ports AppInner/App from App.jsx and main.jsx
 */

import { ThemeManager }    from './themeManager.js';
import { WindowManager }   from './windowManager.js';
import { Dock }            from './dock.js';
import { MenuBar }         from './menubar.js';
import { Desktop }         from './desktop.js';
import { ContextMenu }     from './contextMenu.js';

import { renderTerminal }   from './apps/terminal.js';
import { renderNotes }      from './apps/notes.js';
import { renderCalculator } from './apps/calculator.js';
import { renderCalendar }   from './apps/calendar.js';
import { renderSafari }     from './apps/safari.js';
import { renderMusic }      from './apps/music.js';
import { renderFinder }     from './apps/finder.js';
import { renderSettings }   from './apps/settings.js';

// ─── Prevent default context menu (allow shift+right-click) ────────────
document.addEventListener('contextmenu', (e) => {
  if (e.shiftKey) return;
  e.preventDefault();
}, { capture: true });

// ─── Mobile detection ─────────────────────────────────────────────────
function isMobile() {
  const ua = navigator.userAgent;
  // Only flag actual mobile/phone user agents (not tablets or small windows)
  if (/Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;
  // iPad with no pointer (true touch-only)
  if (/iPad/i.test(ua) && !window.matchMedia('(pointer: fine)').matches) return true;
  return false;
}

// ─── Boot sequence ────────────────────────────────────────────────────
function runBoot() {
  return new Promise(resolve => {
    const bootEl = document.getElementById('boot-screen');
    const barEl = bootEl?.querySelector('.boot-screen__loader-bar');
    if (!bootEl) { resolve(); return; }

    // Animate progress bar over ~2.5 seconds
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

  // Init core systems
  const themeManager = new ThemeManager();
  const wm = new WindowManager(document.getElementById('window-container'));
  const contextMenu = new ContextMenu();
  const desktop = new Desktop(wm, contextMenu, themeManager);
  desktop.restoreWallpaper();

  // Register all apps
  wm.registerApp('terminal',   (el) => renderTerminal(el, wm));
  wm.registerApp('notes',      (el) => renderNotes(el, wm));
  wm.registerApp('calculator', (el) => renderCalculator(el, wm));
  wm.registerApp('calendar',   (el) => renderCalendar(el, wm));
  wm.registerApp('safari',     (el) => renderSafari(el, wm));
  wm.registerApp('music',      (el) => renderMusic(el, wm));
  wm.registerApp('finder',     (el) => renderFinder(el, wm));
  wm.registerApp('settings',   (el) => renderSettings(el, wm, themeManager, desktop));

  // Init UI components
  const menuBar = new MenuBar(wm, themeManager);

  const dockEl   = document.getElementById('dock');
  const githubEl = document.getElementById('dock-github');
  if (dockEl && githubEl) {
    new Dock(dockEl, githubEl, wm, themeManager);
  }

  console.log('%cmacweb.dev 🍎', 'font-size:18px;font-weight:bold;color:#ff375f;');
  console.log('%cBrowser-native macOS desktop environment', 'font-size:13px;color:#0a84ff;');
  console.log('%chttps://github.com/gaminghackintosh/macweb.dev', 'font-size:12px;color:#34c759;');
}

// ─── Start ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
