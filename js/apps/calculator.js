/**
 * Calculator App — functional macOS-style calculator
 */
import { WindowManager } from '../windowManager.js';

export function renderCalculator(contentEl, wm) {
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('calculator', 'Calculator', wm, { showTitle: false });
  contentEl.appendChild(titlebar);

  let display = '0';
  let prev = null;
  let op = null;
  let resetNext = false;

  const wrapper = document.createElement('div');
  wrapper.className = 'calculator-window';
  wrapper.style.cssText = 'display:flex;flex-direction:column;height:calc(100% - 40px);background:rgba(24,24,26,0.98);border-radius:0 0 12px 12px;overflow:hidden;user-select:none;';

  const displayEl = document.createElement('div');
  displayEl.style.cssText = 'padding:20px 24px 12px;text-align:right;font-size:52px;font-weight:300;color:white;letter-spacing:-1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;';
  displayEl.textContent = '0';

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:1px;flex:1;background:rgba(255,255,255,0.05);';

  const BUTTONS = [
    ['AC', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const BTN_COLORS = {
    'AC': '#a1a1a1', '±': '#a1a1a1', '%': '#a1a1a1',
    '÷': '#ff9f0a', '×': '#ff9f0a', '−': '#ff9f0a', '+': '#ff9f0a', '=': '#ff9f0a',
  };

  function updateDisplay() {
    let t = display;
    if (t.length > 9) t = parseFloat(t).toExponential(4);
    displayEl.textContent = t;
    displayEl.style.fontSize = t.length > 9 ? '32px' : t.length > 6 ? '40px' : '52px';
  }

  function calcResult() {
    const a = parseFloat(prev);
    const b = parseFloat(display);
    if (isNaN(a) || isNaN(b)) return;
    let result;
    switch (op) {
      case '÷': result = b === 0 ? 'Error' : a / b; break;
      case '×': result = a * b; break;
      case '−': result = a - b; break;
      case '+': result = a + b; break;
      default: result = b;
    }
    display = result === 'Error' ? 'Error' : String(parseFloat(result.toFixed(10)));
    prev = null;
    op = null;
    resetNext = true;
    updateDisplay();
  }

  function handleBtn(val) {
    if (val === 'AC') {
      display = '0'; prev = null; op = null; resetNext = false;
    } else if (val === '±') {
      display = String(-parseFloat(display));
    } else if (val === '%') {
      display = String(parseFloat(display) / 100);
    } else if (['÷', '×', '−', '+'].includes(val)) {
      if (op && !resetNext) calcResult();
      prev = display; op = val; resetNext = true;
    } else if (val === '=') {
      if (op) calcResult();
    } else if (val === '.') {
      if (resetNext) { display = '0.'; resetNext = false; }
      else if (!display.includes('.')) display += '.';
    } else {
      // digit
      if (resetNext || display === '0') { display = val; resetNext = false; }
      else if (display.length < 12) display += val;
    }
    updateDisplay();
  }

  BUTTONS.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const btn = document.createElement('button');
      const isWide = val === '0';
      btn.style.cssText = `
        background:${BTN_COLORS[val] || 'rgba(58,58,60,0.95)'};
        border:none;
        color:${['AC','±','%'].includes(val) ? '#000' : '#fff'};
        font-size:${['÷','×','−','+','='].includes(val) ? '28px' : '20px'};
        font-weight:${['÷','×','−','+','='].includes(val) ? '300' : '400'};
        cursor:pointer;
        padding:0;
        aspect-ratio:${isWide ? '2/1' : '1/1'};
        ${isWide ? 'grid-column:span 2;' : ''}
        display:flex;align-items:center;justify-content:${isWide ? 'flex-start' : 'center'};
        ${isWide ? 'padding-left:28px;' : ''}
        transition:filter 0.08s;
      `;
      btn.textContent = val;
      btn.setAttribute('aria-label', val);
      btn.addEventListener('click', () => handleBtn(val));
      btn.addEventListener('mousedown', () => btn.style.filter = 'brightness(1.25)');
      btn.addEventListener('mouseup', () => btn.style.filter = '');
      btn.addEventListener('mouseleave', () => btn.style.filter = '');
      grid.appendChild(btn);
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    const keyMap = {
      '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
      '.':'.', '/':'÷', '*':'×', '-':'−', '+':'+', 'Enter':'=', '=':'=',
      'Backspace': () => { if (display.length > 1) display = display.slice(0, -1); else display = '0'; updateDisplay(); return; },
      'Escape': () => handleBtn('AC'),
    };
    const mapped = keyMap[e.key];
    if (mapped) {
      if (typeof mapped === 'function') mapped();
      else handleBtn(mapped);
    }
  });

  wrapper.appendChild(displayEl);
  wrapper.appendChild(grid);
  contentEl.appendChild(wrapper);
}
