/**
 * Settings App — System Preferences style settings
 */
import { WindowManager } from '../windowManager.js';
import { WALLPAPER_GROUPS } from '../desktop.js';
import { getSFSymbolHtml } from '../sfSymbols.js';

const SETTINGS_SECTIONS = [
  { id: 'appearance', label: 'Appearance', symbol: 'paintbrush' },
  { id: 'wallpaper', label: 'Wallpaper', symbol: 'photo' },
  { id: 'display', label: 'Displays', symbol: 'desktopcomputer' },
  { id: 'network', label: 'Network', symbol: 'network' },
  { id: 'bluetooth', label: 'Bluetooth', symbol: 'bluetooth' },
  { id: 'sound', label: 'Sound', symbol: 'speaker.wave.2' },
  { id: 'users', label: 'Users & Groups', symbol: 'person.2' },
  { id: 'about', label: 'General', symbol: 'info.circle' },
];

export function renderSettings(contentEl, wm, themeManager, desktop) {
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('settings', 'System Settings', wm, { disableMinimize: true, disableMaximize: true });
  contentEl.appendChild(titlebar);

  let activeSection = 'appearance';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;height:calc(100% - 40px);overflow:hidden;background:rgba(24,24,26,0.98);';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'settings-sidebar';
  sidebar.style.cssText = 'width:200px;min-width:160px;border-right:1px solid rgba(255,255,255,0.07);background:rgba(28,28,30,0.98);overflow-y:auto;padding:12px 0;flex-shrink:0;';

  // Search
  const searchWrap = document.createElement('div');
  searchWrap.style.cssText = 'padding:0 12px 8px;';
  searchWrap.innerHTML = `<input type="text" placeholder="Search Settings" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.08);border:none;outline:none;color:currentColor;border-radius:8px;padding:6px 10px;font-size:13px;" />`;
  sidebar.appendChild(searchWrap);

  SETTINGS_SECTIONS.forEach(sec => {
    const row = document.createElement('div');
    row.style.cssText = `display:flex;align-items:center;gap:10px;padding:7px 16px;cursor:pointer;border-radius:6px;margin:0 4px;transition:background 0.12s;${activeSection===sec.id?'background:rgba(10,132,255,0.2);color:#0a84ff;':''}`;
    row.id = `settings-nav-${sec.id}`;
    row.innerHTML = `<span style="display:flex;align-items:center;">${getSFSymbolHtml(sec.symbol, { size: 16 })}</span><span style="font-size:13px;">${sec.label}</span>`;
    row.addEventListener('click', () => {
      activeSection = sec.id;
      document.querySelectorAll('[id^=settings-nav-]').forEach(r => { r.style.background=''; r.style.color=''; });
      row.style.background = 'rgba(10,132,255,0.2)';
      row.style.color = '#0a84ff';
      renderContent();
    });
    sidebar.appendChild(row);
  });

  // Content
  const content = document.createElement('div');
  content.className = 'settings-content';
  content.style.cssText = 'flex:1;overflow-y:auto;padding:24px;';

  function renderContent() {
    content.innerHTML = '';
    switch (activeSection) {
      case 'appearance': renderAppearance(); break;
      case 'wallpaper': renderWallpaper(); break;
      case 'display': renderDisplay(); break;
      case 'network': renderNetwork(); break;
      case 'bluetooth': renderBluetooth(); break;
      case 'sound': renderSound(); break;
      case 'about': renderAbout(); break;
      default: content.innerHTML = `<h2 style="font-size:18px;font-weight:700;margin-bottom:16px;">${SETTINGS_SECTIONS.find(s=>s.id===activeSection)?.label}</h2><p style="opacity:0.5;">Coming soon.</p>`;
    }
  }

  function card(title) {
    const el = document.createElement('div');
    el.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 20px;margin-bottom:16px;';
    if (title) {
      const t = document.createElement('div');
      t.style.cssText = 'font-size:13px;font-weight:700;opacity:0.6;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;';
      t.textContent = title;
      el.appendChild(t);
    }
    return el;
  }

  function toggle(label, checked, onChange) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 0;';
    row.innerHTML = `
      <span style="font-size:14px;">${label}</span>
      <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer;">
        <input type="checkbox" ${checked?'checked':''} style="opacity:0;width:0;height:0;position:absolute;" />
        <span style="position:absolute;inset:0;background:${checked?'#0a84ff':'rgba(255,255,255,0.2)'};border-radius:11px;transition:background 0.2s;">
          <span style="position:absolute;top:2px;left:${checked?'20':'2'}px;width:18px;height:18px;background:#fff;border-radius:50%;transition:left 0.2s;"></span>
        </span>
      </label>
    `;
    const input = row.querySelector('input');
    const track = row.querySelectorAll('span')[1];
    const knob = row.querySelectorAll('span')[2];
    input.addEventListener('change', () => {
      track.style.background = input.checked ? '#0a84ff' : 'rgba(255,255,255,0.2)';
      knob.style.left = input.checked ? '20px' : '2px';
      onChange(input.checked);
    });
    return row;
  }

  function renderAppearance() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Appearance</h2>';
    const c = card('Appearance');

    const modes = document.createElement('div');
    modes.style.cssText = 'display:flex;gap:16px;margin-bottom:16px;';
    ['Light','Dark','Auto'].forEach(mode => {
      const btn = document.createElement('button');
      const isActive = (mode==='Dark' && !themeManager.isLight) || (mode==='Light' && themeManager.isLight);
      btn.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 20px;background:${isActive?'rgba(10,132,255,0.2)':'rgba(255,255,255,0.05)'};border:${isActive?'1px solid #0a84ff':'1px solid rgba(255,255,255,0.1)'};border-radius:12px;cursor:pointer;color:currentColor;font-size:13px;`;
      btn.innerHTML = `<div style="width:48px;height:32px;border-radius:6px;background:${mode==='Light'?'#f5f5f7':'#1c1c1e'};border:1px solid rgba(255,255,255,0.1);"></div>${mode}`;
      btn.addEventListener('click', () => {
        if (mode === 'Light') themeManager.setTheme(true);
        if (mode === 'Dark') themeManager.setTheme(false);
        if (mode === 'Auto') themeManager.setTheme(window.matchMedia('(prefers-color-scheme: light)').matches);
        renderAppearance();
      });
      modes.appendChild(btn);
    });
    c.appendChild(modes);
    content.appendChild(c);
  }

  function renderWallpaper() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Wallpaper</h2>';
    WALLPAPER_GROUPS.forEach(group => {
      const c = card(group.title);
      const grid = document.createElement('div');
      grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;';
      group.wallpapers.forEach(wp => {
        const img = document.createElement('div');
        img.style.cssText = `width:80px;height:52px;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid rgba(255,255,255,0.05);transition:border-color 0.15s;background:url('${wp.thumb}') center/cover no-repeat;flex-shrink:0;`;
        img.title = wp.name;
        img.addEventListener('click', () => {
          if (desktop) desktop.setWallpaper(wp.id);
          img.style.borderColor = '#0a84ff';
        });
        img.addEventListener('mouseenter', () => img.style.borderColor = 'rgba(10,132,255,0.5)');
        img.addEventListener('mouseleave', () => img.style.borderColor = 'rgba(255,255,255,0.05)');
        grid.appendChild(img);
      });
      c.appendChild(grid);
      content.appendChild(c);
    });
  }

  function renderDisplay() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Displays</h2>';
    const c = card('Built-in Display');
    c.innerHTML += `
      <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="width:60px;height:40px;border-radius:6px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:22px;">💻</div>
        <div>
          <div style="font-size:14px;font-weight:600;">Built-in Retina Display</div>
          <div style="font-size:12px;opacity:0.5;">${window.innerWidth} × ${window.innerHeight} (native)</div>
        </div>
      </div>
      <div style="margin-top:12px;">
        <label style="font-size:13px;opacity:0.7;">Brightness</label>
        <input type="range" min="0" max="100" value="75" style="width:100%;margin-top:8px;" />
      </div>
      <div style="margin-top:12px;">
        <label style="font-size:13px;opacity:0.7;">Night Shift</label>
        <select style="background:rgba(255,255,255,0.08);border:none;color:currentColor;border-radius:6px;padding:4px 8px;margin-left:12px;font-size:13px;">
          <option>Off</option><option>Custom</option><option>Sunset to Sunrise</option>
        </select>
      </div>
    `;
    content.appendChild(c);
  }

  function renderNetwork() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Network</h2>';
    const c = card('Network');
    ['Wi-Fi','Ethernet','Firewall','VPN'].forEach((item, i) => {
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:10px 0;${i>0?'border-top:1px solid rgba(255,255,255,0.06);':''}`;
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">${['📶','🔌','🛡','🔒'][i]}</span>
          <div><div style="font-size:14px;">${item}</div><div style="font-size:12px;opacity:0.5;">${i===0?'Kernel Panic Network':i===1?'Not connected':i===2?'Active':'Not configured'}</div></div>
        </div>
        <div style="font-size:12px;color:${i===0?'#34c759':i===2?'#34c759':'rgba(255,255,255,0.3)'};">${i===0?'Connected':i===1?'Not connected':i===2?'Enabled':'Off'}</div>
      `;
      c.appendChild(row);
    });
    content.appendChild(c);
  }

  function renderBluetooth() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Bluetooth</h2>';
    const c = card('Bluetooth');
    c.appendChild(toggle('Bluetooth', true, () => {}));
    content.appendChild(c);

    const c2 = card('My Devices');
    ['AirPods Pro','Magic Mouse','Magic Keyboard'].forEach((device, i) => {
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:8px 0;${i>0?'border-top:1px solid rgba(255,255,255,0.06);':''}`;
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:20px;">${['🎧','🖱','⌨'][i]}</span>
          <div><div style="font-size:14px;">${device}</div><div style="font-size:12px;opacity:0.5;">Connected</div></div>
        </div>
        <div style="font-size:12px;color:#34c759;">Connected</div>
      `;
      c2.appendChild(row);
    });
    content.appendChild(c2);
  }

  function renderSound() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Sound</h2>';
    const c = card('Output');
    c.innerHTML += `
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;opacity:0.6;margin-bottom:8px;">Output Volume</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:14px;">🔈</span>
          <input type="range" min="0" max="100" value="55" style="flex:1;" />
          <span style="font-size:14px;">🔊</span>
        </div>
      </div>
    `;
    c.appendChild(toggle('Show volume in menu bar', true, () => {}));
    content.appendChild(c);
  }

  function renderAbout() {
    content.innerHTML = '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">Sobre este Mac</h2>';
    const c = card();
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:20px;padding:8px 0;">
        <svg viewBox="0 0 200 110" style="width:72px;height:40px;flex-shrink:0;">
          <rect x="25" y="4" width="150" height="92" rx="6" fill="#1e1e1e" stroke="#555" stroke-width="1.5"/>
          <rect x="30" y="9" width="140" height="82" rx="2" fill="#3B99FC"/>
          <rect x="25" y="92" width="150" height="6" fill="#181818"/>
          <path d="M12 98 L188 98 L198 106 L2 106 Z" fill="#b5b5b5" stroke="#777" stroke-width="1"/>
        </svg>
        <div>
          <div style="font-size:18px;font-weight:700;margin-bottom:2px;">MacBook Pro</div>
          <div style="font-size:12px;opacity:0.6;margin-bottom:2px;">13-inch, 2018, Four Thunderbolt 3 Ports</div>
          <div style="font-size:12px;opacity:0.5;">macOS Sequoia 15.7.7</div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:16px;padding-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12.5px;">
        <div><span style="opacity:0.5;">Processador:</span> 2,7 GHz Intel Core i7</div>
        <div><span style="opacity:0.5;">Gráficos:</span> Intel Iris Plus 655</div>
        <div><span style="opacity:0.5;">Memória:</span> 16 GB 2133 MHz</div>
        <div><span style="opacity:0.5;">Nº de série:</span> C02XL18SJHD4</div>
      </div>
    `;
    content.appendChild(c);
  }

  wrapper.appendChild(sidebar);
  wrapper.appendChild(content);
  contentEl.appendChild(wrapper);

  renderContent();
}
