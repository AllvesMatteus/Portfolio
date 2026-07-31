/**
 * Calendar App — interactive monthly calendar
 */
import { WindowManager } from '../windowManager.js';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function renderCalendar(contentEl, wm) {
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('calendar', 'Calendar', wm);
  contentEl.appendChild(titlebar);

  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();

  const wrapper = document.createElement('div');
  wrapper.className = 'calendar-window';
  wrapper.style.cssText = 'display:flex;height:calc(100% - 40px);overflow:hidden;background:rgba(24,24,26,0.98);';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'width:200px;min-width:160px;border-right:1px solid rgba(255,255,255,0.08);padding:16px 0;background:rgba(28,28,30,0.95);flex-shrink:0;overflow-y:auto;';
  sidebar.innerHTML = `
    <div style="padding:0 16px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.4;">Calendars</div>
    ${['Work','Personal','Birthdays','Holidays'].map(c => `
      <div style="display:flex;align-items:center;gap:10px;padding:6px 16px;cursor:pointer;">
        <div style="width:10px;height:10px;border-radius:50%;background:${c==='Work'?'#0a84ff':c==='Personal'?'#34c759':c==='Birthdays'?'#ff375f':'#ff9f0a'};flex-shrink:0;"></div>
        <span style="font-size:13px;">${c}</span>
      </div>
    `).join('')}
  `;

  // Main content
  const main = document.createElement('div');
  main.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;';

  const monthTitle = document.createElement('div');
  monthTitle.style.cssText = 'font-size:20px;font-weight:700;';

  const navBtns = document.createElement('div');
  navBtns.style.cssText = 'display:flex;gap:8px;align-items:center;';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '‹';
  prevBtn.style.cssText = 'background:none;border:1px solid rgba(255,255,255,0.15);color:currentColor;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px;';

  const todayBtn = document.createElement('button');
  todayBtn.textContent = 'Today';
  todayBtn.style.cssText = 'background:rgba(10,132,255,0.2);border:1px solid rgba(10,132,255,0.4);color:#0a84ff;border-radius:6px;padding:4px 12px;cursor:pointer;font-size:13px;';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '›';
  nextBtn.style.cssText = 'background:none;border:1px solid rgba(255,255,255,0.15);color:currentColor;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px;';

  navBtns.appendChild(prevBtn);
  navBtns.appendChild(todayBtn);
  navBtns.appendChild(nextBtn);
  header.appendChild(monthTitle);
  header.appendChild(navBtns);

  const grid = document.createElement('div');
  grid.style.cssText = 'flex:1;display:grid;grid-template-rows:auto 1fr;overflow:hidden;padding:0 12px 12px;';

  function render() {
    monthTitle.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';

    // Day headers
    const dayHeaders = document.createElement('div');
    dayHeaders.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px;';
    DAYS.forEach(d => {
      const cell = document.createElement('div');
      cell.style.cssText = 'text-align:center;font-size:11px;font-weight:700;opacity:0.4;padding:8px 0;';
      cell.textContent = d;
      dayHeaders.appendChild(cell);
    });

    // Days grid
    const daysGrid = document.createElement('div');
    daysGrid.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:2px;align-content:start;';

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = new Date();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      daysGrid.appendChild(document.createElement('div'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const cell = document.createElement('div');
      cell.style.cssText = `
        text-align:center;padding:6px 4px;border-radius:8px;cursor:pointer;font-size:13px;
        ${isToday ? 'background:#0a84ff;color:#fff;font-weight:700;' : ''}
        transition:background 0.12s;
      `;
      cell.textContent = d;
      if (!isToday) {
        cell.addEventListener('mouseenter', () => cell.style.background = 'rgba(255,255,255,0.08)');
        cell.addEventListener('mouseleave', () => cell.style.background = '');
      }
      daysGrid.appendChild(cell);
    }

    grid.appendChild(dayHeaders);
    grid.appendChild(daysGrid);
  }

  prevBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });
  nextBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });
  todayBtn.addEventListener('click', () => {
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    render();
  });

  main.appendChild(header);
  main.appendChild(grid);
  wrapper.appendChild(sidebar);
  wrapper.appendChild(main);
  contentEl.appendChild(wrapper);
  render();
}
