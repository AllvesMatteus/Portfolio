/**
 * Terminal App — full terminal emulator
 * Ported from Terminal.jsx
 */

import { WindowManager } from '../windowManager.js';

const FORTUNES = [
  "The best way to predict the future is to invent it.",
  "When in doubt, use brute force.",
  "Start small, think big.",
  "The code is not the problem. The comment is.",
  "sudo make me a sandwich.",
  "git commit -m 'Fixed everything'",
  "The only thing constant in life is change... and bugs.",
];

function randomMatrixStr(len = 20) {
  const chars = "01アイウエオカキクケコサシスセソタチツテト";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ANSI escape codes → HTML spans
function ansiToHtml(text) {
  const map = {
    '30': 'color:#1d1d1f', '31': 'color:#ff3b30', '32': 'color:#34c759',
    '33': 'color:#ffd60a', '34': 'color:#0a84ff', '35': 'color:#bf5af2',
    '36': 'color:#5ac8fa', '37': 'color:#ebebf0',
    '39': '', '0': '',
    '40': 'background:#1d1d1f', '41': 'background:#ff3b30',
    '42': 'background:#34c759', '43': 'background:#ffd60a',
    '44': 'background:#0a84ff', '45': 'background:#bf5af2',
    '46': 'background:#5ac8fa', '47': 'background:#ebebf0',
  };

  // Handle 256-color codes like \x1b[38;5;39m
  let result = text
    .replace(/\x1b\[38;5;(\d+)m/g, (_, code) => `<span style="color:var(--ansi-${code},currentColor)">`)
    .replace(/\x1b\[(\d+)m/g, (_, code) => {
      if (code === '0') return '</span>';
      const style = map[code] || '';
      return style ? `<span style="${style}">` : '';
    });

  // Escape any remaining HTML chars that weren't in spans
  return result;
}

export function renderTerminal(contentEl, wm) {
  const nowStr = new Date().toString().split(' GMT')[0];
  let history = [
    { text: `Last login: ${nowStr} on ttys008` },
  ];
  let cmdHistory = [];
  let cmdIdx = -1;
  let matrixInterval = null;
  let gitLogLines = null;
  let gitLogLoading = true;

  contentEl.style.cssText = 'display:flex;flex-direction:column;height:100%;overflow:hidden;background:transparent;';

  // Re-create titlebar with exact macOS Terminal title from Image 4
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('terminal', '📁 mateus — -zsh — 80x24', wm, { showTitle: true });
  contentEl.appendChild(titlebar);

  const termWin = document.createElement('div');
  termWin.style.cssText = 'display:flex;flex-direction:column;height:calc(100% - 38px);overflow:hidden;background:#1e1e1e;';

  const outputEl = document.createElement('div');
  outputEl.style.cssText = 'flex:1;overflow-y:auto;padding:12px 16px;font-family:"SF Mono",Menlo,"Courier New",monospace;font-size:13px;line-height:1.55;color:#ffffff;';
  outputEl.setAttribute('aria-live', 'polite');

  const inputRow = document.createElement('div');
  inputRow.style.cssText = 'display:flex;align-items:center;padding:4px 16px 12px 16px;flex-shrink:0;';

  const prompt = document.createElement('span');
  prompt.style.cssText = 'color:#ffffff;white-space:nowrap;font-family:"SF Mono",Menlo,"Courier New",monospace;font-size:13px;font-weight:500;';
  prompt.textContent = 'mateus@MacBook-Pro-de-Mateus ~ % ';

  const input = document.createElement('input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.style.cssText = 'flex:1;background:transparent;border:none;outline:none;color:#ffffff;font-family:"SF Mono",Menlo,"Courier New",monospace;font-size:13px;caret-color:#ffffff;';
  input.setAttribute('aria-label', 'Terminal input');

  inputRow.appendChild(prompt);
  inputRow.appendChild(input);
  termWin.appendChild(outputEl);
  termWin.appendChild(inputRow);
  contentEl.appendChild(termWin);

  // Focus input on click
  contentEl.addEventListener('click', () => input.focus());
  input.focus();

  function renderHistory() {
    outputEl.innerHTML = history.map(h => `<div>${ansiToHtml(h.text)}</div>`).join('');
    outputEl.scrollTop = outputEl.scrollHeight;
  }
  renderHistory();

  // Fetch git log in background
  fetch('https://api.github.com/repos/gaminghackintosh/macweb.dev/commits?sha=code-root&per_page=10')
    .then(r => r.json())
    .then(commits => {
      gitLogLines = commits.flatMap(commit => {
        const author = commit.commit.author || {};
        const date = author.date ? new Date(author.date) : new Date();
        const message = commit.commit.message?.split('\n')[0] || '(no message)';
        return [
          `\x1b[33mcommit ${commit.sha.slice(0, 7)}\x1b[0m`,
          `Author: ${author.name || 'Unknown'}`,
          `Date:   ${date.toUTCString()}`,
          '',
          `    ${message}`,
          '',
        ];
      });
      gitLogLoading = false;
    })
    .catch(() => {
      gitLogLines = ['\x1b[31merror:\x1b[0m Could not fetch commit history. Check your internet connection.'];
      gitLogLoading = false;
    });

  function runCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const joinArgs = args.join(' ');

    if (!cmd) return [];

    switch (cmd) {
      case 'help':
        return [
          '\x1b[36mAvailable commands:\x1b[0m',
          '  ls          – list directory contents',
          '  pwd         – print working directory',
          '  whoami      – current user',
          '  uname       – system information',
          '  date        – current date & time',
          '  echo        – print text',
          '  cat         – print file contents',
          '  neofetch    – system info with ASCII art',
          '  clear       – clear the terminal',
          '  open <app>  – open application (e.g., open finder)',
          '  git log     – repository commit history',
          '  history     – show command history',
          '  fortune     – show a random quote',
          '  cowsay      – display a cow saying something',
          '  matrix      – matrix rain effect (type again to stop)',
          '  weather     – mock weather forecast',
          '  figlet      – ASCII art text',
          '  ping <host> – ping a host (mock)',
          '  df          – disk space usage',
          '  top         – process list (mock)',
        ];

      case 'ls':
        return ['Desktop    Documents  Downloads  Movies', 'Music      Pictures   Projects   Public', 'readme.md  .git       .config    .local'];

      case 'pwd': return ['/Users/mateus'];
      case 'whoami': return ['mateus'];
      case 'date': return [new Date().toString()];
      case 'echo': return [joinArgs || ''];
      case 'fortune': return [`\x1b[35m${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}\x1b[0m`];
      case 'hi': return ['\x1b[33mOlá! Bem-vindo ao Terminal do Mateus PC! 🍏\x1b[0m'];

      case 'uname':
        if (args[0] === '-a') return ['Darwin MacBook-Pro-de-Mateus 24.6.0 Darwin Kernel Version 24.6.0; root:xnu-11215/RELEASE_X86_64 x86_64'];
        return ['Darwin'];

      case 'cat':
        if (joinArgs === 'readme.md') {
          return ['# Mateus PC', '', 'Ambiente macOS nativo da web.', '', '## Especificações', '- MacBook Pro (13-inch, 2018)', '- 2,7 GHz Intel Core i7 Quad-Core', '- Intel Iris Plus Graphics 655', '- 16 GB 2133 MHz LPDDR3'];
        }
        return [`\x1b[31mcat: ${joinArgs}: No such file or directory\x1b[0m`];

      case 'git':
        if (args[0] === 'log') {
          if (gitLogLoading) return ['\x1b[33mFetching commit history...\x1b[0m'];
          return gitLogLines || ['No commit history available.'];
        }
        return [`\x1b[31mgit: '${args[0]}' is not a git command\x1b[0m`];

      case 'clear':
        history = [];
        renderHistory();
        return null; // null = no additional lines

      case 'history':
        if (!cmdHistory.length) return ['No command history.'];
        return cmdHistory.map((c, i) => `  ${i + 1}  ${c}`);

      case 'open': {
        const appMap = { finder: 'finder', settings: 'settings', notes: 'notes', terminal: 'terminal', music: 'music', safari: 'safari', calendar: 'calendar', calculator: 'calculator' };
        const appId = appMap[args[0]?.toLowerCase()];
        if (appId) { wm.openApp(appId, appId.charAt(0).toUpperCase() + appId.slice(1)); return [`Opening ${args[0]}...`]; }
        return [`\x1b[31mError:\x1b[0m Application '${args[0]}' not found.`];
      }

      case 'cowsay': {
        const text = joinArgs || 'Moo!';
        const f = text.length > 40 ? text.slice(0, 40) + '...' : text;
        return [` ${'_'.repeat(f.length + 2)}`, `< ${f} >`, ` ${'-'.repeat(f.length + 2)}`, '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||'];
      }

      case 'matrix':
        if (matrixInterval) {
          clearInterval(matrixInterval);
          matrixInterval = null;
          return ['\x1b[31mMatrix effect stopped.\x1b[0m'];
        }
        matrixInterval = setInterval(() => {
          history.push({ text: `\x1b[32m${randomMatrixStr()}\x1b[0m` });
          renderHistory();
        }, 150);
        return ['\x1b[32mMatrix rain started. (Type "matrix" again to stop)\x1b[0m'];

      case 'weather':
        return ['\x1b[36mWeather for Mateus PC:\x1b[0m', '  ☀️  Temperature: 24°C', '  🌬️  Wind: 12 km/h', '  💧  Humidity: 45%'];

      case 'figlet':
        return [
          '  __  __       _                     ____   ____',
          ' |  \\/  | __ _| |_ ___ _    ___    |  _ \\ / ___|',
          " | |\\/| |/ _` | __/ _ \\ | | / __|   | |_) | |",
          ' | |  | | (_| | ||  __/ |_| \\__ \\   |  __/| |___',
          ' |_|  |_|\\__,_|\\__\\___|\\__,_|___/   |_|    \\____|',
        ];

      case 'ping': {
        const host = joinArgs || 'localhost';
        return [`PING ${host}: 56 data bytes`, `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.042 ms`, `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.038 ms`, '--- ping statistics ---', `2 packets transmitted, 2 received, 0% packet loss`];
      }

      case 'df':
        return ['Filesystem      Size   Used  Avail Capacity', '/dev/disk0s1   500G   120G   380G    32%', 'tmpfs          8.0G   1.2G   6.8G    15%'];

      case 'top':
        return ['\x1b[36mProcesses: 312 total, 3 running  \x1b[0m', '', '  PID CMD              %CPU %MEM', '  1   kernel_task       0.0  0.5', '  2   launchd           0.0  0.1', '  89  Safari            1.2  2.3', ' 120  Terminal          0.3  0.8', ' 221  Mateus PC         2.1  1.9', '', '(mock output)'];

      case 'neofetch': {
        const res = `${window.innerWidth}x${window.innerHeight}`;
        const uptime = Math.floor(performance.now() / 1000);
        return [
          '',
          `         \x1b[32mmateus\x1b[0m@\x1b[36mMacBook-Pro-de-Mateus\x1b[0m`,
          '         ──────────────────────────────',
          `         OS:         \x1b[37mmacOS Sequoia 15.7.7\x1b[0m`,
          `         Host:       \x1b[37mMacBook Pro (13-inch, 2018)\x1b[0m`,
          `         CPU:        \x1b[37m2,7 GHz Intel Core i7 Quad-Core\x1b[0m`,
          `         GPU:        \x1b[37mIntel Iris Plus Graphics 655\x1b[0m`,
          `         Memory:     \x1b[37m16 GB 2133 MHz LPDDR3\x1b[0m`,
          `         Serial:     \x1b[37mC02XL18SJHD4\x1b[0m`,
          `         Shell:      \x1b[37mzsh 5.9\x1b[0m`,
          `         Resolution: \x1b[37m${res}\x1b[0m`,
          `         Uptime:     \x1b[37m${uptime}s\x1b[0m`,
          '',
          ' \x1b[40m   \x1b[0m\x1b[41m   \x1b[0m\x1b[42m   \x1b[0m\x1b[43m   \x1b[0m\x1b[44m   \x1b[0m\x1b[45m   \x1b[0m\x1b[46m   \x1b[0m\x1b[47m   \x1b[0m',
          '',
        ];
      }

      default:
        return [`\x1b[31mCommand not found: ${cmd}\x1b[0m — type "help" for available commands`];
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      input.value = '';

      // Add to cmd history
      if (raw) {
        cmdHistory.unshift(raw);
        cmdIdx = -1;
      }

      // Push command echo to history
      history.push({ text: `\x1b[32mghost@macweb:~$\x1b[0m \x1b[37m${raw}\x1b[0m` });

      const lines = runCommand(raw);
      if (lines !== null && lines !== undefined) {
        lines.forEach(t => history.push({ text: t }));
        history.push({ text: '' });
      }

      renderHistory();

    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdIdx < cmdHistory.length - 1) {
        cmdIdx++;
        input.value = cmdHistory[cmdIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIdx > 0) {
        cmdIdx--;
        input.value = cmdHistory[cmdIdx] || '';
      } else {
        cmdIdx = -1;
        input.value = '';
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      if (matrixInterval) { clearInterval(matrixInterval); matrixInterval = null; }
      history.push({ text: '\x1b[31m^C\x1b[0m' });
      input.value = '';
      renderHistory();
    }
  });
}
