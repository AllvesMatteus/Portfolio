import { WindowManager } from '../windowManager.js';
import { showMacAlert } from '../macDialog.js';
import { showNotification } from '../notificationManager.js';

const FORTUNES = [
  "The best way to predict the future is to invent it.",
  "When in doubt, use brute force.",
  "sudo make me a sandwich.",
  "git commit -m 'Fixed everything'",
  "The only thing constant in life is change... and bugs.",
  "Turning coffee into logic since 2020.",
];

const VFS = {
  '/': { type: 'dir', children: ['Applications', 'Library', 'System', 'Users', 'Volumes', 'bin', 'cores', 'dev', 'etc', 'private', 'sbin', 'tmp', 'usr', 'var'] },
  '/Applications': { type: 'dir', children: ['Safari.app', 'Terminal.app', 'Finder.app', 'Portfolio.app'] },
  '/Library': { type: 'dir', children: ['Preferences', 'Logs'] },
  '/System': { type: 'dir', children: ['Library'] },
  '/Users': { type: 'dir', children: ['mateus', 'guest', 'shared'] },
  '/Users/mateus': { type: 'dir', children: ['about.md', 'skills.md', 'projects.md', 'experience.md', 'education.md', 'contact.md', 'Desktop', 'Documents', 'Downloads'] },
  '/Users/mateus/Desktop': { type: 'dir', children: ['macOS-Web'] },
  '/Users/mateus/Documents': { type: 'dir', children: ['Currículo.pdf'] },
  '/Users/mateus/Downloads': { type: 'dir', children: ['macOS-Sequoia.dmg'] },
  '/var': { type: 'dir', children: ['root', 'log', 'tmp'] },
  '/var/root': { type: 'dir', children: ['.zshrc', '.ssh'] },
  '/tmp': { type: 'dir', children: [] },
  '/etc': { type: 'dir', children: ['hosts', 'zshrc'] },
};

const VFS_FILES = {
  '/Users/mateus/about.md': `
# Sobre Mateus Alves
Olá! Sou o Mateus Alves, Desenvolvedor Web e Engenheiro de Software focado no ecossistema Apple e tecnologias modernas.
Gosto de criar interfaces fluidas, rápidas e com alto nível de fidelidade visual.
  `,
  '/Users/mateus/skills.md': `
# Habilidades Técnicas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React, Next.js, TailwindCSS
- **Backend**: Node.js, Express, Python
- **Outros**: Git, Docker, Arquitetura Apple (HIG), UX/UI Design
  `,
  '/Users/mateus/projects.md': `
# Projetos em Destaque
- **MateusOS**: Esta simulação incrível do macOS Sequoia em Web.
- **Portfólio Interativo**: Um design premium com foco em experiência do usuário e animações.
- **DevTools**: Extensões e ferramentas de terminal para desenvolvedores.
  `,
  '/Users/mateus/experience.md': `
# Experiência Profissional
- **Desenvolvedor Frontend Sênior** (Freelance)
- **Criador de Soluções Web Interativas**
- Focado na otimização de performance e interfaces pixel-perfect.
  `,
  '/Users/mateus/education.md': `
# Formação Acadêmica
- **Engenharia de Software**
- Diversos cursos avançados em desenvolvimento web, arquiteturas de sistemas e UX/UI.
  `,
  '/Users/mateus/contact.md': `
# Contato
- **Email**: allves.matteus@hotmail.com
- **LinkedIn**: linkedin.com/in/allves-matteus/
- **GitHub**: github.com/AllvesMatteus
  `,
  '/etc/hosts': `
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
127.0.0.1       mateusos.local
  `,
  '/etc/zshrc': `
# System-wide .zshrc file for ZSH
# MateusOS v2.5 configuration
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
  `,
  '/var/root/.zshrc': `
# Root shell configuration
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export PS1="root@MacBook-Pro ~ # "
alias rm='rm -i'
  `,
  '/var/root/.ssh/id_ed25519.pub': `
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDH...[demonstrativa]...mateus@MacBook-Pro.local
  `
};

const ASCII_LOGO = `<pre style="margin:2px 0 10px 0;padding:0;font-family:'Courier New',Courier,monospace;font-size:10px;line-height:1.05;letter-spacing:0;white-space:pre;overflow-x:auto;user-select:none;">
<span style="color:#818cf8">███╗   ███╗ █████╗ ████████╗ ████████╗ ███████╗ ██╗   ██╗ ███████╗</span>
<span style="color:#6366f1">████╗ ████║██╔══██╗╚══██╔══╝ ╚══██╔══╝ ██╔════╝ ██║   ██║ ██╔════╝</span>
<span style="color:#4f46e5">██╔████╔██║███████║   ██║       ██║    █████╗  ██║   ██║ ███████╗</span>
<span style="color:#4338ca">██║╚██╔╝██║██╔══██║   ██║       ██║    ██╔══╝  ██║   ██║ ╚════██║</span>
<span style="color:#3730a3">██║ ╚═╝ ██║██║  ██║   ██║       ██║    ███████╗╚██████╔╝ ███████║</span>
<span style="color:#312e81">╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝    ╚══════╝ ╚═════╝  ╚══════╝</span></pre>`;

const NAV_MAP = {
  'sobre': 'about', 'about': 'about',
  'habilidades': 'skills', 'skills': 'skills',
  'projetos': 'projects', 'projects': 'projects',
  'contato': 'contact', 'contact': 'contact',
  'experiencia': 'experience', 'experience': 'experience',
  'formacao': 'education', 'education': 'education',
  'portfolio': 'all', 'gui': 'all',
};

const SECTION_LABELS = {
  'about': 'Sobre', 'skills': 'Habilidades', 'projects': 'Projetos',
  'contact': 'Contato', 'experience': 'Experiência', 'education': 'Formação',
};

const AUTOCOMPLETE_CMDS = [
  'help', 'man', 'man intro', 'open', 'ls', 'cd', 'pwd', 'cat', 'echo', 'clear', 'history',
  'whoami', 'id', 'uname', 'date', 'fortune', 'neofetch', 'omz', 'matrix',
  'cowsay', 'figlet', 'ping', 'df', 'top', 'git', 'reset', 'lang', 'github',
  'linkedin', 'sudo', 'sudo -i', 'npm', 'npm run dev', 'exit', 'logout', 'gui',
  'sw_vers', 'pbcopy', 'system_profiler', 'defaults', 'caffeinate', 'tail',
  'defaults write com.apple.Theme Dark', 'defaults write com.apple.Theme Light',
  'tail -f system.log', 'git log', 'pbcopy email', 'pbcopy linkedin', 'pbcopy github',
  'cat /etc/hosts', 'cat ~/.ssh/id_ed25519.pub',
  'open sobre.md', 'open projetos.md', 'open habilidades.md', 'open contato.md', 'open experiencia.md', 'open formacao.md',
  'open about.md', 'open projects.md', 'open skills.md', 'open contact.md', 'open experience.md', 'open education.md', 'open portfolio',
  'open -a safari', 'open -a finder', 'open -a terminal', 'open -a settings',
  'osascript -e \'display alert "Teste de Alerta" message "Este é um alerta de teste no macOS."\'',
  'osascript -e \'display notification "Mensagem de teste" with title "Notificação"\'',
];

const SECTIONS_LIST = ['sobre', 'habilidades', 'projetos', 'contato', 'experiencia', 'formacao', 'about', 'skills', 'projects', 'contact', 'experience', 'education', 'portfolio'];

function randomMatrixStr(len = 28) {
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function renderTerminal(contentEl, wm) {
  let cmdHistory = [];
  let historyIdx = -1;
  let matrixInterval = null;
  let isAdmin = false;
  let isOMZInstalled = false;
  let isDevServerRunning = false;
  let currentDir = '/Users/mateus';
  let currentSuggestion = '';
  let currentLang = 'pt';
  let pageStartTime = Date.now();
  const technicalProgress = new Set();
  const techRequired = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];
  let hasShownGratitude = false;
  let activeProcess = '';
  let activeProcessResolve = null;
  let isPasswordPrompt = false;
  let passwordCallback = null;

  contentEl.style.cssText = 'display:flex;flex-direction:column;height:100%;overflow:hidden;background:#1e1e1e;border-radius:10px;';
  contentEl.innerHTML = '';

  const titlebar = document.createElement('div');
  titlebar.className = 'app-window__titlebar terminal-titlebar';
  titlebar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:0 12px;height:38px;background:#2d2d2d;border-bottom:1px solid rgba(0,0,0,0.4);position:relative;user-select:none;flex-shrink:0;';

  const controls = document.createElement('div');
  controls.className = 'app-window__controls traffic-lights-container';
  controls.style.cssText = 'display:flex;align-items:center;gap:8px;z-index:2;';
  controls.innerHTML = `
    <button class="app-window__btn app-window__btn--close traffic-light traffic-close" aria-label="Fechar Terminal" title="Fechar">
      <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon close-icon"><line x1="3" y1="3" x2="9" y2="9" stroke="#460804" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="3" x2="3" y2="9" stroke="#460804" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <button class="app-window__btn app-window__btn--minimize traffic-light traffic-minimize" aria-label="Minimizar Terminal" title="Minimizar">
      <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon minimize-icon"><line x1="2" y1="6" x2="10" y2="6" stroke="#90591d" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <button class="app-window__btn app-window__btn--zoom traffic-light traffic-maximize" aria-label="Zoom Terminal" title="Zoom">
      <svg viewBox="0 0 12 12" width="12" height="12" class="traffic-icon maximize-icon"><rect x="3" y="3" width="6" height="6" fill="none" stroke="#2a6218" stroke-width="1.2" rx="1"/></svg>
    </button>
  `;

  controls.querySelector('.app-window__btn--close').addEventListener('click', () => {
    if (activeProcess) {
      showMacAlert({
        messageText: 'Você quer finalizar os processos em execução nesta janela?',
        informativeText: `O fechamento dessa janela encerrará o processo em execução ${activeProcess}.`,
        iconSrc: 'assets/icons/folders/default-folder.png',
        buttons: ['Cancelar', 'Finalizar'],
        callback: (chosenBtn) => {
          if (chosenBtn === 'Finalizar') {
            activeProcess = '';
            wm.closeWindow('terminal');
          }
        }
      });
    } else {
      wm.closeWindow('terminal');
    }
  });
  controls.querySelector('.app-window__btn--minimize').addEventListener('click', () => wm.minimizeWindow('terminal'));
  controls.querySelector('.app-window__btn--zoom').addEventListener('click', () => wm.maximizeWindow('terminal'));

  const titleEl = document.createElement('div');
  titleEl.id = 'terminal-title-label';
  titleEl.style.cssText = 'position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;gap:6px;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);pointer-events:none;';
  titleEl.innerHTML = `
    <svg width="15" height="13" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
      <path d="M1.5 2C1.5 1.44772 1.94772 1 2.5 1H5.79289C6.0581 1 6.31248 1.10536 6.50005 1.29289L7.70711 2.5H13.5C14.0523 2.5 14.5 2.94772 14.5 3.5V12C14.5 12.5523 14.0523 13 13.5 13H2.5C1.94772 13 1.5 12.5523 1.5 12V2Z" fill="#0a84ff"/>
    </svg>
    <span id="terminal-title-text">mateus — -zsh — 80×24</span>
  `;

  titlebar.appendChild(controls);
  titlebar.appendChild(titleEl);
  contentEl.appendChild(titlebar);

  const termWin = document.createElement('div');
  termWin.className = 'terminal-body';
  termWin.style.cssText = 'flex:1;overflow-y:auto;background:#1e1e1e;padding:12px;font-family:"Geist Mono","SF Mono",SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:13px;line-height:1.45;color:#ffffff;box-sizing:border-box;cursor:text;user-select:text;-webkit-user-select:text;';

  const outputEl = document.createElement('div');
  outputEl.style.cssText = 'font-family:inherit;font-size:inherit;color:inherit;user-select:text;-webkit-user-select:text;';

  const inputLine = document.createElement('div');
  inputLine.id = 'terminal-input-line';
  inputLine.style.cssText = 'display:flex;align-items:center;margin-top:6px;font-family:inherit;font-size:inherit;line-height:inherit;position:relative;width:100%;';

  const promptLabel = document.createElement('span');
  promptLabel.id = 'terminal-prompt-label';
  promptLabel.style.cssText = 'white-space:nowrap;font-family:inherit;font-size:13px;font-weight:400;margin-right:6px;flex-shrink:0;user-select:none;';

  const inputWrapper = document.createElement('div');
  inputWrapper.style.cssText = 'position:relative;flex:1;display:flex;align-items:center;min-width:0;';

  const inputDisplay = document.createElement('div');
  inputDisplay.id = 'terminal-input-display';
  inputDisplay.style.cssText = 'position:absolute;left:0;top:0;bottom:0;right:0;display:block;pointer-events:none;font-family:inherit;font-size:13px;line-height:1.45;white-space:pre;z-index:2;overflow:hidden;';
  inputDisplay.innerHTML = '<span class="terminal-cursor"></span>';

  const suggestionEl = document.createElement('div');
  suggestionEl.id = 'terminal-suggestion-el';
  suggestionEl.style.cssText = 'position:absolute;left:0;top:0;bottom:0;right:0;display:block;pointer-events:none;font-family:inherit;font-size:13px;line-height:1.45;white-space:pre;opacity:0.65;z-index:1;overflow:hidden;';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'terminal-input-field';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.style.cssText = 'flex:1;background:transparent;border:none;outline:none;color:transparent;caret-color:transparent;font-family:inherit;font-size:13px;line-height:1.45;padding:0;margin:0;width:100%;z-index:3;';
  input.setAttribute('aria-label', 'Terminal input');

  inputWrapper.appendChild(suggestionEl);
  inputWrapper.appendChild(inputDisplay);
  inputWrapper.appendChild(input);
  inputLine.appendChild(promptLabel);
  inputLine.appendChild(inputWrapper);

  termWin.appendChild(outputEl);
  termWin.appendChild(inputLine);
  contentEl.appendChild(termWin);

  termWin.addEventListener('click', (e) => {
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) return;
    input.focus();
  });
  setTimeout(() => input.focus(), 50);

  function getPromptHtml() {
    const user = isAdmin ? 'root' : 'mateus';
    const color = isAdmin ? '#ef4444' : '#818cf8';
    const symbol = isAdmin ? '#' : '%';
    const home = isAdmin ? '/var/root' : '/Users/mateus';
    const dirLabel = currentDir === home ? '~' : currentDir;
    return `<span style="color:${color};font-weight:600;">${user}@MacBook-Pro</span> <span style="color:#9ca3af;font-weight:700;">${dirLabel} ${symbol}</span>`;
  }

  function updateTerminalTitle(activeProc = '') {
    const el = document.getElementById('terminal-title-text');
    if (!el) return;

    const home = isAdmin ? '/var/root' : '/Users/mateus';
    let folderName = 'mateus';
    if (currentDir === home) {
      folderName = 'mateus';
    } else {
      const parts = currentDir.split('/');
      folderName = parts[parts.length - 1] || 'mateus';
    }

    const w = termWin.clientWidth || 640;
    const h = termWin.clientHeight || 400;
    const cols = Math.max(20, Math.floor(w / 7.8));
    const rows = Math.max(5, Math.floor(h / 19));

    const procStr = activeProc ? ` (${activeProc})` : '';
    el.textContent = `${folderName} — -zsh${procStr} — ${cols}×${rows}`;
  }

  function updatePrompt() {
    promptLabel.innerHTML = getPromptHtml();
    updateTerminalTitle();
  }

  try {
    const resizeObs = new ResizeObserver(() => {
      updateTerminalTitle();
    });
    resizeObs.observe(termWin);
  } catch (e) { }

  function scrollToBottom() {
    termWin.scrollTop = termWin.scrollHeight;
  }

  async function printLine(html, delay = 0) {
    if (delay > 0) await new Promise(r => setTimeout(r, delay));
    const div = document.createElement('div');
    div.style.cssText = 'margin-top:2px;font-family:inherit;font-size:inherit;line-height:1.5;';
    div.innerHTML = html;
    outputEl.appendChild(div);
    scrollToBottom();
  }

  async function printLines(lines, stagger = 40) {
    for (const line of lines) {
      await printLine(line, stagger);
    }
  }

  async function scrambleTitle(finalHtml, duration = 1000) {
    const el = document.getElementById('terminal-title-text');
    if (!el) return;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rawText = finalHtml.replace(/<[^>]*>/g, '');
    const steps = 15;
    let count = 0;
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (count >= steps) {
          el.innerHTML = finalHtml;
          clearInterval(interval);
          resolve();
          return;
        }
        el.textContent = rawText.split('').map(c => c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]).join('');
        count++;
      }, duration / steps);
    });
  }

  async function fullBootSequence() {
    outputEl.innerHTML = '';
    inputLine.style.display = 'none';

    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${days[now.getDay()]} ${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} ${now.toTimeString().split(' ')[0]}`;

    await printLine(`<span style="color:#6b7280;">Last login: ${dateStr} on ttys001</span>`, 0);
    await printLine(``, 0);

    await printLine(ASCII_LOGO, 0);
    await new Promise(r => setTimeout(r, 200));

    const hintLine = currentLang === 'pt'
      ? `<span style="color:#6b7280;"># Digite <span style="color:#fbbf24;">man</span> para ver os comandos</span>`
      : `<span style="color:#6b7280;"># Type <span style="color:#fbbf24;">man</span> to see available commands</span>`;

    await printLine(hintLine, 40);

    inputLine.style.display = 'flex';
    updatePrompt();
    updateInputDisplay('');
    input.disabled = false;
    input.focus();
    scrollToBottom();
  }

  function updateInputDisplay(val) {
    if (isPasswordPrompt) {
      inputDisplay.innerHTML = '<span class="terminal-cursor"></span>';
      return;
    }
    let html = '';
    if (val.length > 0) {
      const words = val.split(' ');
      const primaryCmd = words[0].toLowerCase();
      const isValid = AUTOCOMPLETE_CMDS.some(c => c === primaryCmd || c.startsWith(primaryCmd + ' ')) || primaryCmd === 'npm' || primaryCmd === 'sudo' || primaryCmd === 'open' || primaryCmd === 'cd' || primaryCmd === 'osascript';
      const cmdColor = isValid ? '#28c840' : '#ff3b30';
      if (words.length > 1) {
        const restPart = val.substring(words[0].length);
        const escapedRest = restPart.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html = `<span style="color:${cmdColor};">${words[0]}</span><span style="color:#ffffff;white-space:pre;">${escapedRest}</span>`;
      } else {
        html = `<span style="color:${cmdColor};">${val}</span>`;
      }
    }
    inputDisplay.innerHTML = html + '<span class="terminal-cursor"></span>';

    const valLower = val.toLowerCase();
    const trimmed = val.trim();
    if (trimmed.length > 0) {
      const parts = valLower.split(/\s+/);
      const cmd = parts[0];
      let match = '';

      if (cmd === 'open') {
        const subPrefix = valLower.slice(4).trimStart();
        if (!subPrefix) {
          match = 'open sobre';
        } else {
          const subMatch = SECTIONS_LIST.find(s => s.startsWith(subPrefix));
          if (subMatch) match = 'open ' + subMatch;
        }
      } else if (cmd === 'npm') {
        const subPrefix = valLower.slice(3).trimStart();
        if (subPrefix.startsWith('run')) {
          const runSub = subPrefix.slice(3).trimStart();
          const subMatch = SECTIONS_LIST.find(s => s.startsWith(runSub));
          if (subMatch) match = 'npm run ' + subMatch;
          else match = 'npm run dev';
        } else {
          match = 'npm run dev';
        }
      } else {
        match = AUTOCOMPLETE_CMDS.find(c => c.toLowerCase().startsWith(valLower) && c.toLowerCase() !== valLower) || '';
      }

      if (match && match.toLowerCase().startsWith(valLower) && match.length > val.length) {
        currentSuggestion = match;
        const typedPart = val;
        const remainingPart = match.substring(val.length);
        const escapedTyped = typedPart.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const escapedRemaining = remainingPart.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        suggestionEl.innerHTML = `<span style="opacity:0;white-space:pre;">${escapedTyped}</span><span style="color:#6b7280;opacity:0.65;white-space:pre;">${escapedRemaining}</span>`;
      } else {
        currentSuggestion = '';
        suggestionEl.innerHTML = '';
      }
    } else {
      currentSuggestion = '';
      suggestionEl.innerHTML = '';
    }
  }

  function openPortfolioSection(section, showAll = false) {
    wm.openApp('safari', 'Safari');
    setTimeout(() => {
      if (window._safariEngine) {
        window._safariEngine.loadPortfolioSection(section, showAll);
      } else {
        window.dispatchEvent(new CustomEvent('portfolio:open', {
          detail: { section, showAll }
        }));
      }
    }, 50);
  }

  async function handleNavigation(script) {
    const targetId = NAV_MAP[script];
    if (!targetId) return false;

    if (isAdmin && !isDevServerRunning) {
      return `<span style="color:#ef4444;font-weight:700;">[ERROR] dev-server is not running.</span><br><span style="color:#6b7280;"># Execute <span style="color:#fbbf24;">npm run dev</span> antes de rodar scripts em modo SuperUser.</span>`;
    }

    const label = targetId === 'all' ? 'Portfolio' : (SECTION_LABELS[targetId] || targetId);
    await printLine(`<span style="color:#60a5fa;">Routing to ${label}...${isAdmin ? ' (Production Build)' : ''}</span>`, 0);
    await new Promise(r => setTimeout(r, 400));

    if (targetId === 'all') {
      openPortfolioSection('all', true);
    } else {
      openPortfolioSection(targetId, false);
    }

    if (isAdmin && isDevServerRunning) {
      technicalProgress.add(targetId);
      checkGratitude();
    }
    return true;
  }

  function checkGratitude() {
    if (hasShownGratitude) return;
    if (!isAdmin || !isDevServerRunning) return;
    const allVisited = techRequired.every(m => technicalProgress.has(m));
    if (!allVisited) return;
    hasShownGratitude = true;
    setTimeout(async () => {
      await printLines([
        ``,
        `<span style="color:#ef4444;font-weight:700;">ACHIEVEMENT UNLOCKED: FULL SYSTEM DISCOVERY ACHIEVED</span>`,
        `<span style="color:#ffffff;">Parabéns! Fico muito feliz que você explorou cada detalhe técnico e visual do meu portfólio.</span>`,
        `<span style="color:#ffffff;">Como desenvolvedor, agradeço seu interesse na arquitetura e na minha trajetória.</span>`,
        ``,
        `<span style="color:#fbbf24;font-weight:700;">BONUS UNLOCKED:</span> <span style="color:#ffffff;">Protocolo de viagem no tempo ativado.</span>`,
        `<span style="color:#6b7280;"># Use o comando <span style="color:#fbbf24;">npm run legacy</span> para ver como tudo começou.</span>`,
        `<span style="color:#6b7280;"># Deseja ver mais código? <a href="https://github.com/AllvesMatteus" target="_blank" style="color:#22d3ee;text-decoration:underline;">github.com/AllvesMatteus</a></span>`,
        ``,
      ], 60);
    }, 800);
  }

  async function runCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const joinArgs = args.join(' ');

    if (!cmd) return;

    inputLine.style.display = 'none';
    input.disabled = true;

    try {
      await new Promise(r => setTimeout(r, 100 + Math.random() * 100));

      let result = null;

      switch (cmd) {
      case 'help': {
        const helpLines = isAdmin ? [
          `<span style="color:#ef4444;font-weight:700;letter-spacing:0.1em;">Root Mode — MateusOS v2.5</span>`,
          `<span style="color:#4b5563;">────────────────────────────────────────────</span>`,
          ``,
          `<span style="color:#ef4444;font-weight:700;">NAVEGAÇÃO VFS</span>`,
          `  ls              <span style="color:#6b7280;"># Listar arquivos do diretório atual</span>`,
          `  cd [caminho]    <span style="color:#6b7280;"># Mudar de diretório (suporta .. e ~)</span>`,
          `  pwd             <span style="color:#6b7280;"># Caminho do diretório atual</span>`,
          `  cat [arquivo]   <span style="color:#6b7280;"># Ler conteúdo de um arquivo</span>`,
          ``,
          `<span style="color:#ef4444;font-weight:700;">SCRIPTS NPM</span>`,
          `  npm run dev     <span style="color:#6b7280;"># Iniciar servidor de desenvolvimento</span>`,
          `  npm run [seção] <span style="color:#6b7280;"># Navegar para seção do portfólio</span>`,
          ``,
          `<span style="color:#ef4444;font-weight:700;">FERRAMENTAS</span>`,
          `  neofetch        <span style="color:#6b7280;"># Resumo técnico do sistema</span>`,
          `  omz             <span style="color:#6b7280;"># Instalar Oh My Zsh</span>`,
          `  whoami          <span style="color:#6b7280;"># Identidade do usuário</span>`,
          ``,
          `<span style="color:#ef4444;font-weight:700;">SISTEMA</span>`,
          `  lang [en|pt]    <span style="color:#6b7280;"># Alterar idioma</span>`,
          `  clear           <span style="color:#6b7280;"># Limpar a tela</span>`,
          `  exit            <span style="color:#6b7280;"># Encerrar sessão root</span>`,
          `  github          <span style="color:#6b7280;"># Abrir perfil no GitHub</span>`,
          `  linkedin        <span style="color:#6b7280;"># Abrir perfil no LinkedIn</span>`,
          ``,
          `<span style="color:#6b7280;"># Setas ↑↓ para histórico | Tab para autocompletar</span>`,
        ] : [
          `<span style="color:#818cf8;font-weight:700;letter-spacing:0.1em;">NAVEGAÇÃO (open [file] | cat [file])</span>`,
          `  open about.md      <span style="color:#6b7280;"># Sobre Mateus Alves</span>`,
          `  open projects.md   <span style="color:#6b7280;"># Projetos do portfólio</span>`,
          `  open skills.md     <span style="color:#6b7280;"># Habilidades técnicas (Stack)</span>`,
          `  open experience.md <span style="color:#6b7280;"># Experiência profissional</span>`,
          `  open education.md  <span style="color:#6b7280;"># Formação acadêmica</span>`,
          `  open contact.md    <span style="color:#6b7280;"># Redes sociais e email de contato</span>`,
          `  open .             <span style="color:#6b7280;"># Abrir o Finder do sistema</span>`,
          ``,
          `<span style="color:#818cf8;font-weight:700;letter-spacing:0.1em;">SISTEMA</span>`,
          `  ls -la          <span style="color:#6b7280;"># Listar arquivos detalhadamente (BSD)</span>`,
          `  pwd             <span style="color:#6b7280;"># Exibir diretório de trabalho atual</span>`,
          `  whoami          <span style="color:#6b7280;"># Exibir usuário ativo (use --verbose para o card)</span>`,
          `  pbcopy [item]   <span style="color:#6b7280;"># Copiar dados de contato (email/linkedin/github)</span>`,
          `  lang [en|pt]    <span style="color:#6b7280;"># Idioma / Language</span>`,
          `  clear           <span style="color:#6b7280;"># Limpa a tela</span>`,
          `  sudo -i         <span style="color:#6b7280;"># Acessar modo administrador (root)</span>`,
          ``,
          `<span style="color:#6b7280;"># Setas ↑↓ para histórico | Tab para autocompletar</span>`,
        ];
        await printLines(helpLines, 20);
        break;
      }

      case 'open': {
        if (!args[0]) { await printLine(`usage: open [-a app] [file|folder|url]`); break; }
        let target = args[0];
        let displayTarget = args[0];
        
        // Handle -a flag (e.g. open -a Safari)
        if (target.toLowerCase() === '-a' && args[1]) {
          const appName = args[1].toLowerCase();
          const appMap = { finder: 'finder', settings: 'settings', terminal: 'terminal', safari: 'safari' };
          if (appMap[appName]) {
            wm.openApp(appMap[appName], appName.charAt(0).toUpperCase() + appName.slice(1));
            await printLine(`Opening ${args[1]}...`);
          } else {
            await printLine(`<span style="color:#ef4444;">open: ${args[1]}: Application not found</span>`);
          }
          break;
        }

        // Handle open . (opens Finder app)
        if (target === '.') {
          wm.openApp('finder', 'Finder');
          await printLine(`Opening Finder...`);
          break;
        }

        // Handle absolute/external URLs
        if (target.startsWith('http://') || target.startsWith('https://') || target.includes('wa.me') || target.includes('linkedin.com') || target.includes('github.com')) {
          let url = target;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          window.open(url, '_blank');
          await printLine(`<span style="color:#4ade80;">Redirecting to external URL... [OK]</span>`);
          break;
        }

        // Handle specific external contact links (whatsapp, linkedin, github) to open outside virtual OS
        const lowerTarget = target.toLowerCase();
        if (lowerTarget === 'whatsapp') {
          window.open('https://wa.me/5511948642383?text=Ol%C3%A1%20Mateus!%20Vim%20pelo%20seu%20Portf%C3%B3lio%20e%20gostaria%20de%20conversar.', '_blank');
          await printLine(`<span style="color:#4ade80;">Opening WhatsApp in a new tab... [OK]</span>`);
          break;
        } else if (lowerTarget === 'linkedin') {
          window.open('https://www.linkedin.com/in/allves-matteus/', '_blank');
          await printLine(`<span style="color:#4ade80;">Opening LinkedIn in a new tab... [OK]</span>`);
          break;
        } else if (lowerTarget === 'github') {
          window.open('https://github.com/AllvesMatteus', '_blank');
          await printLine(`<span style="color:#4ade80;">Opening GitHub in a new tab... [OK]</span>`);
          break;
        }

        // Handle section opening, e.g. open about.md
        let cleanSection = lowerTarget;
        if (cleanSection.endsWith('.md')) {
          cleanSection = cleanSection.substring(0, cleanSection.length - 3);
        }
        
        const navResult = await handleNavigation(cleanSection);
        if (navResult === true) break;
        if (typeof navResult === 'string') { await printLine(navResult); break; }

        // Fallback: check if it matches an app name directly
        const appMap = { finder: 'finder', settings: 'settings', terminal: 'terminal', safari: 'safari' };
        if (appMap[lowerTarget]) {
          wm.openApp(appMap[lowerTarget], lowerTarget.charAt(0).toUpperCase() + lowerTarget.slice(1));
          await printLine(`Opening ${displayTarget}...`);
        } else {
          await printLine(`<span style="color:#ef4444;">open: ${displayTarget}: No such file, directory or application</span>`);
        }
        break;
      }

      case 'osascript': {
        let scriptText = raw;
        const prefix = 'osascript -e';
        if (raw.toLowerCase().startsWith(prefix)) {
          scriptText = raw.substring(prefix.length).trim();
          if ((scriptText.startsWith("'") && scriptText.endsWith("'")) ||
              (scriptText.startsWith('"') && scriptText.endsWith('"')) ||
              (scriptText.startsWith('“') && scriptText.endsWith('”'))) {
            scriptText = scriptText.substring(1, scriptText.length - 1).trim();
          }
        }

        const alertData = parseAppleScriptAlert(scriptText);
        const notifData = parseAppleScriptNotification(scriptText);

        if (alertData) {
          activeProcess = 'osascript';
          updateTerminalTitle('osascript');
          await new Promise(resolve => {
            showMacAlert({
              messageText: alertData.messageText,
              informativeText: alertData.informativeText,
              iconSrc: alertData.iconSrc,
              buttons: alertData.buttons,
              callback: async (chosenBtn) => {
                activeProcess = '';
                updateTerminalTitle();
                if (chosenBtn) {
                  await printLine(`button returned:${chosenBtn}`);
                }
                resolve();
              }
            });
          });
        } else if (notifData) {
          showNotification({
            title: notifData.title,
            desc: notifData.desc || notifData.subtitle,
            icon: 'assets/icons/apps/custom/terminal.png'
          });
        } else {
          await printLine(`<span style="color:#ef4444;">osascript: Invalid syntax or command.</span>`);
          await printLine(`<span style="color:#6b7280;">Exemplo Alerta: osascript -e 'display alert "Meu Título" message "Minha Mensagem" buttons {"Cancelar", "Apagar"} default button "Apagar" as warning'</span>`);
          await printLine(`<span style="color:#6b7280;">Exemplo Notificação: osascript -e 'display notification "Minha Mensagem" with title "Meu Título" subtitle "Subtítulo"'</span>`);
        }
        break;
      }

      case 'gui': {
        const guiResult = await handleNavigation('portfolio');
        if (typeof guiResult === 'string') await printLine(guiResult);
        break;
      }

      case 'sudo': {
        const isElevate = args[0] === '-i' || args[0] === '-s' || args[0] === 'su' || joinArgs === 'su' || joinArgs === 'su -';
        if (isElevate) {
          if (isAdmin) {
            await printLine(`<span style="color:#6b7280;"># Already running as superuser (root). Use <span style="color:#fbbf24;">exit</span> to logout.</span>`);
          } else {
            await printLine(`WARNING: Improper use of the sudo command could lead to data loss`);
            await printLine(`or the deletion of important system files. Please double-check your`);
            await printLine(`commands when running as root.`);
            await printLine(``);
            
            // Customize prompt visual for password prompt
            promptLabel.innerHTML = 'Password:';
            inputLine.style.display = 'flex';
            input.disabled = true;
            updateInputDisplay('');
            
            // Simulate automated typing/verification delay
            await new Promise(r => setTimeout(r, 1200));
            
            await printLine(`<span style="color:#fbbf24;">Verifying password...</span>`, 100);
            await new Promise(r => setTimeout(r, 600));
            
            isAdmin = true;
            currentDir = '/var/root';
            outputEl.innerHTML = '';
            await scrambleTitle(`<span style="color:#ef4444;">root</span>@MacBook-Pro: ~`, 1000);
            
            const now = new Date();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateStr = `${days[now.getDay()]} ${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} ${now.toTimeString().split(' ')[0]}`;
            
            await printLine(`<span style="color:#6b7280;">Last login: ${dateStr} on ttys001</span>`);
            await printLine(``);
            await printLine(`<span style="color:#ef4444;font-weight:700;">[ROOT MODE ACTIVATED]</span> — Use <span style="color:#fbbf24;">man</span> para ver os comandos de engenharia.`);
            await printLine(`<span style="color:#6b7280;"># Execute <span style="color:#fbbf24;">npm run dev</span> para iniciar o ambiente de desenvolvimento.</span>`);
          }
        } else {
          await printLine(`usage: sudo [-s | -i] [command] or sudo su`);
          await printLine(`<span style="color:#6b7280;">Dica: use <span style="color:#fbbf24;">sudo -i</span> para elevar privilégios.</span>`);
        }
        break;
      }

      case 'exit':
      case 'logout': {
        if (isAdmin) {
          isAdmin = false;
          isDevServerRunning = false;
          currentDir = '/Users/mateus';
          await printLine(`<span style="color:#60a5fa;">logout</span>`, 200);
          await printLine(`<span style="color:#6b7280;">[Process completed]</span>`, 400);
          await new Promise(r => setTimeout(r, 800));
          const titleText = document.getElementById('terminal-title-text');
          if (titleText) titleText.textContent = 'mateus — portfólio';
          await fullBootSequence();
          return;
        } else {
          await printLine(`logout`, 200);
          await printLine(`<span style="color:#6b7280;">[Process completed]</span>`, 400);
          inputLine.style.display = 'none';
          input.disabled = true;
          return;
        }
        break;
      }

      case 'npm': {
        if (!isAdmin) {
          await printLine(`<span style="color:#dc2626;font-weight:700;">npm ERR!</span> <span style="color:#ffffff;">code EACCES</span>`);
          await printLine(`<span style="color:#6b7280;">Dica: use <span style="color:#fbbf24;">sudo -i</span> para executar scripts npm.</span>`);
          break;
        }
        if (args[0] === 'run') {
          const script = args[1];
          if (script === 'dev') {
            isDevServerRunning = true;
            technicalProgress.clear();
            await printLine(`<span style="color:#ffffff;font-weight:700;">> portfolio-allvesmatteus@1.0.0 dev</span>`, 200);
            await printLine(`<span style="color:#ffffff;font-weight:700;">> vite</span><br>`, 400);
            await printLine(`<span style="color:#fbbf24;">Compilando módulos...</span>`, 600);
            await new Promise(r => setTimeout(r, 1000));
            await printLine(`<span style="color:#22d3ee;font-weight:700;">VITE v5.2.0</span>  <span style="color:#ffffff;">ready in 248 ms</span><br>`, 200);
            await printLine(`  <span style="color:#4ade80;">➜</span>  <span style="color:#ffffff;font-weight:700;">Local:</span>   <span style="color:#67e8f9;">http://localhost:5173/</span>`, 200);
            await printLine(`  <span style="color:#6b7280;">➜</span>  <span style="color:#6b7280;font-weight:700;">Network:</span> use --host to expose<br>`, 200);
            await printLine(`<span style="color:#4ade80;">✓ Servidor pronto!</span><br><span style="color:#6b7280;"># Navegue pelas seções usando <span style="color:#fbbf24;">npm run [seção]</span></span>`);
          } else if (script) {
            const navResult = await handleNavigation(script);
            if (navResult === true) { await printLine(`<span style="color:#4ade80;">Done. [OK]</span>`); }
            else if (typeof navResult === 'string') { await printLine(navResult); }
            else {
              await printLine(`<span style="color:#dc2626;font-weight:700;">npm ERR!</span> Missing script: "${script}"`);
            }
          } else {
            await printLine(`usage: npm run [script]`);
          }
        } else {
          await printLine(`usage: npm run dev`);
        }
        break;
      }

      case 'neofetch': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: neofetch</span>`);
          await printLine(`<span style="color:#6b7280;">Dica: use <span style="color:#fbbf24;">sudo -i</span> para acessar ferramentas de engenharia.</span>`);
          break;
        }
        const uptime = Math.floor((Date.now() - pageStartTime) / 60000);
        const res = `${window.innerWidth}x${window.innerHeight}`;
        const logoLines = [
          `<span style="color:#3b82f6;">                    .-.</span>`,
          `<span style="color:#3b82f6;">                   /   \\</span>`,
          `<span style="color:#3b82f6;">                  /     \\</span>`,
          `<span style="color:#3b82f6;">                 /       \\</span>`,
          `<span style="color:#60a5fa;">                /   / \\   \\</span>`,
          `<span style="color:#60a5fa;">               /   /   \\   \\</span>`,
          `<span style="color:#93c5fd;">              /   /     \\   \\</span>`,
          `<span style="color:#93c5fd;">             /   /       \\   \\</span>`,
          `<span style="color:#93c5fd;">            /   /         \\   \\</span>`,
          `<span style="color:#93c5fd;">           /___/           \\___\\</span>`,
        ];
        const infoLines = [
          `<span style="color:#818cf8;font-weight:700;">mateus</span>@<span style="color:#818cf8;font-weight:700;">portfolio</span>`,
          `<span style="color:#ffffff;">-----------------------</span>`,
          `<span style="color:#818cf8;font-weight:700;">Github:</span>     <span style="color:#ffffff;">AllvesMatteus</span>`,
          `<span style="color:#818cf8;font-weight:700;">OS:</span>         <span style="color:#ffffff;">macOS Sequoia 15.7.7</span>`,
          `<span style="color:#818cf8;font-weight:700;">Host:</span>       <span style="color:#ffffff;">MacBook Pro (13-inch, 2018)</span>`,
          `<span style="color:#818cf8;font-weight:700;">CPU:</span>        <span style="color:#ffffff;">2.7 GHz Intel Core i7 Quad-Core</span>`,
          `<span style="color:#818cf8;font-weight:700;">GPU:</span>        <span style="color:#ffffff;">Intel Iris Plus Graphics 655</span>`,
          `<span style="color:#818cf8;font-weight:700;">Memory:</span>     <span style="color:#ffffff;">16 GB 2133 MHz LPDDR3</span>`,
          `<span style="color:#818cf8;font-weight:700;">Shell:</span>      <span style="color:#ffffff;">zsh 5.9</span>`,
          `<span style="color:#818cf8;font-weight:700;">Resolution:</span> <span style="color:#ffffff;">${res}</span>`,
          `<span style="color:#818cf8;font-weight:700;">Uptime:</span>     <span style="color:#ffffff;">${uptime} mins</span>`,
          ``,
          `\x1b[40m   \x1b[0m\x1b[41m   \x1b[0m\x1b[42m   \x1b[0m\x1b[43m   \x1b[0m\x1b[44m   \x1b[0m\x1b[45m   \x1b[0m\x1b[46m   \x1b[0m\x1b[47m   \x1b[0m`,
        ];
        const maxLen = Math.max(logoLines.length, infoLines.length);
        for (let i = 0; i < maxLen; i++) {
          const l = logoLines[i] || '&nbsp;'.repeat(30);
          const r = infoLines[i] || '';
          await printLine(`${l}   ${r}`, 30);
        }
        break;
      }

      case 'omz': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: omz</span>`);
          await printLine(`<span style="color:#6b7280;">Dica: use <span style="color:#fbbf24;">sudo -i</span> para instalar pacotes de sistema.</span>`);
          break;
        }
        const omzLines = [
          `<span style="color:#60a5fa;">Cloning Oh My Zsh...</span>`,
          `<span style="color:#9ca3af;">remote: Enumerating objects: 1209, done.</span>`,
          `<span style="color:#9ca3af;">remote: Counting objects: 100% (1209/1209), done.</span>`,
          `<span style="color:#4ade80;">Resolving deltas: 100% (712/712), done.</span>`,
          `<span style="color:#fbbf24;">Looking for an existing zsh config...</span>`,
          `<span style="color:#22d3ee;">Using the Oh My Zsh template file and adding it to ~/.zshrc.</span>`,
          `<span style="color:#fbbf24;">      __                                     __   </span>`,
          `<span style="color:#fbbf24;"> ____/ /_     ____ ___  __  __   ____  _____/ /_  </span>`,
          `<span style="color:#fbbf24;">/ __  / /_   / __ \`__ \\/ / / /  /_  / / ___/ __ \\ </span>`,
          `<span style="color:#fbbf24;">/ /_/ / __ \\ / / / / / / /_/ /    / /_(__  ) / / / </span>`,
          `<span style="color:#fbbf24;">\\__,_/_/ /_//_/ /_/ /_/\\__, /    /___/____/_/ /_/  </span>`,
          `<span style="color:#fbbf24;">                      /____/                       ....is now installed!</span>`,
          `<span style="color:#4ade80;">Please look at the ~/.zshrc file to change settings.</span>`,
          `<span style="color:#ffffff;font-weight:700;">HAVE FUN! 🚀</span>`,
        ];
        await printLines(omzLines, 80);
        isOMZInstalled = true;
        break;
      }

      case 'whoami': {
        if (isAdmin) { await printLine(`root`); break; }
        const birthDate = new Date(1997, 5, 25);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        await printLines([
          ``,
          `<span style="color:#ffffff;font-weight:700;">USER_INFO</span>`,
          `<span style="color:#6b7280;">────────────────────────────────────────</span>`,
          `<span style="color:#818cf8;">IDENTITY:</span> <span style="color:#ffffff;">Mateus Alves</span>`,
          `<span style="color:#818cf8;">CONTEXT:</span>  mateus@MacBook-Pro`,
          `<span style="color:#818cf8;">AGE:</span>      <span style="color:#ffffff;">${age}</span>`,
          `<span style="color:#818cf8;">STATUS:</span>   <span style="color:#4ade80;">Full Stack Developer</span>`,
          `<span style="color:#818cf8;">LOCATION:</span> <span style="color:#ffffff;">São Paulo, Brasil</span>`,
          `<span style="color:#818cf8;">BIO:</span>      <span style="color:#9ca3af;">Especialista em criar interfaces premium. Turning coffee into logic since 2020.</span>`,
          `<span style="color:#6b7280;">────────────────────────────────────────</span>`,
          ``,
        ], 20);
        break;
      }

      case 'ls': {
        let showHidden = false;
        let showDetails = false;
        const filteredArgs = [];
        for (const arg of args) {
          if (arg.startsWith('-')) {
            if (arg.includes('a')) showHidden = true;
            if (arg.includes('l')) showDetails = true;
          } else {
            filteredArgs.push(arg);
          }
        }
        
        let target = filteredArgs[0] || currentDir;
        if (!target.startsWith('/')) {
          target = (currentDir === '/' ? '/' : currentDir + '/') + target;
        }
        target = target.replace(/\/+$/, '') || '/';

        // Check permissions
        if (!isAdmin && (target.startsWith('/var/root') || target.startsWith('/etc') || target.startsWith('/var/log') || target.startsWith('/private'))) {
          await printLine(`<span style="color:#ef4444;">ls: ${filteredArgs[0] || '.'}: Permission denied</span>`);
          break;
        }

        if (VFS[target]) {
          const children = VFS[target].children.filter(name => {
            if (!showHidden && name.startsWith('.')) return false;
            return true;
          });

          if (showDetails) {
            await printLine(`total ${children.length}`);
            for (const name of children) {
              const fullPath = target === '/' ? '/' + name : target + '/' + name;
              const isDirectory = !!VFS[fullPath];
              const permissions = isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
              const owner = target.startsWith('/var/root') ? 'root' : 'mateus';
              const group = target.startsWith('/var/root') ? 'wheel' : 'staff';
              const links = isDirectory ? ' 2' : ' 1';
              const size = isDirectory ? ' 96' : (VFS_FILES[fullPath]?.length || 0).toString().padStart(3, ' ');
              const dateStr = 'Aug 20 01:50';
              const nameHtml = isDirectory ? `<span style="color:#60a5fa;font-weight:700;">${name}/</span>` : `<span style="color:#ffffff;">${name}</span>`;
              
              await printLine(`${permissions}  ${links} ${owner}  ${group}  ${size} ${dateStr} ${nameHtml}`);
            }
          } else {
            const items = children.map(name => {
              const fullPath = target === '/' ? '/' + name : target + '/' + name;
              const isDirectory = !!VFS[fullPath];
              return isDirectory ? `<span style="color:#60a5fa;font-weight:700;">${name}/</span>` : `<span style="color:#ffffff;">${name}</span>`;
            }).join('  ');
            await printLine(items || '(empty)');
          }
        } else {
          await printLine(`ls: ${filteredArgs[0] || '.'}: No such file or directory`);
        }
        break;
      }

      case 'cd': {
        let path = args[0] || (isAdmin ? '/var/root' : '/Users/mateus');
        if (path === '~') path = isAdmin ? '/var/root' : '/Users/mateus';
        if (path === '..') {
          const p = currentDir.split('/').filter(x => x);
          p.pop();
          path = '/' + p.join('/') || '/';
        } else if (!path.startsWith('/')) {
          path = (currentDir === '/' ? '/' : currentDir + '/') + path;
        }
        path = path.replace(/\/+$/, '') || '/';

        // Check permissions
        if (!isAdmin && (path.startsWith('/var/root') || path.startsWith('/etc') || path.startsWith('/var/log') || path.startsWith('/private'))) {
          await printLine(`<span style="color:#ef4444;">cd: permission denied: ${args[0]}</span>`);
          break;
        }

        if (VFS[path]) { currentDir = path; }
        else { await printLine(`cd: no such file or directory: ${args[0]}`); }
        break;
      }

      case 'pwd': await printLine(currentDir); break;

      case 'cat': {
        if (!args[0]) { await printLine(`usage: cat [file]`); break; }
        let target = args[0];
        if (!target.startsWith('/')) {
          target = (currentDir === '/' ? '/' : currentDir + '/') + target;
        }
        target = target.replace(/\/+$/, '') || '/';

        // Check permissions
        if (!isAdmin && (target.startsWith('/var/root') || target.startsWith('/etc') || target.startsWith('/var/log') || target.startsWith('/private'))) {
          await printLine(`<span style="color:#ef4444;">cat: ${args[0]}: Permission denied</span><br><span style="color:#6b7280;"># Dica: use <span style="color:#fbbf24;">sudo -i</span> para elevar privilégios.</span>`);
          break;
        }

        if (VFS_FILES[target]) {
          const lines = VFS_FILES[target].trim().split('\n');
          await printLines(lines, 10);
        } else {
          if (VFS[target]) {
            await printLine(`cat: ${args[0]}: Is a directory`);
          } else {
            await printLine(`cat: ${args[0]}: No such file or directory`);
          }
        }
        break;
      }

      case 'echo': await printLine(joinArgs || ''); break;
      
      case 'date': {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const dateStr = `${days[now.getDay()]} ${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} ${now.toTimeString().split(' ')[0]} BRT ${now.getFullYear()}`;
        await printLine(dateStr);
        break;
      }
      
      case 'uptime': {
        const elapsedSecs = Math.floor((Date.now() - pageStartTime) / 1000);
        const hrs = Math.floor(elapsedSecs / 3600);
        const mins = Math.floor((elapsedSecs % 3600) / 60);
        const secs = elapsedSecs % 60;
        const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        await printLine(` ${new Date().toLocaleTimeString()}  up ${timeStr}, 1 user, load averages: 1.88 1.95 2.10`);
        break;
      }

      case 'fortune': await printLine(`<span style="color:#a78bfa;">${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}</span>`); break;

      case 'uname': {
        if (args[0] === '-a') {
          await printLine('Darwin MacBook-Pro-de-Mateus.local 24.0.0 Darwin Kernel Version 24.0.0; root:xnu-11215/RELEASE_X86_64 x86_64');
        } else { await printLine('Darwin'); }
        break;
      }

      case 'id':
        await printLine(isAdmin
          ? 'uid=0(root) gid=0(wheel) groups=0(wheel),1(daemon),2(kmem),3(sys),4(tty),5(operator),8(procview),9(procmod),12(everyone),20(staff)'
          : 'uid=501(mateus) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts)');
        break;

      case 'history': {
        if (!cmdHistory.length) { await printLine('No command history.'); break; }
        await printLines(cmdHistory.map((c, i) => `  ${i + 1}  ${c}`), 10);
        break;
      }

      case 'clear': outputEl.innerHTML = ''; break;

      case 'reset': {
        if (isAdmin) {
          await printLine(`<span style="color:#ef4444;font-weight:700;">[ACCESS DENIED]</span> <span style="color:#ef4444;">System integrity locked. Reboot sequence intercepted by root.</span>`);
          break;
        }
        outputEl.innerHTML = '';
        await printLine(`<span style="color:#6b7280;">Restarting system...</span>`);
        await new Promise(r => setTimeout(r, 800));
        isAdmin = false; isDevServerRunning = false; currentDir = '/Users/mateus'; cmdHistory = []; historyIdx = -1;
        await fullBootSequence();
        return;
      }

      case 'lang': {
        const lang = args[0]?.toLowerCase();
        if (lang === 'pt' || lang === 'en') {
          if (lang === currentLang) {
            await printLine(`<span style="color:#60a5fa;">${lang === 'pt' ? 'O sistema já está em Português.' : 'System is already in English.'}</span>`);
            break;
          }
          await printLine(`<span style="color:#fbbf24;">Changing system locale to ${lang.toUpperCase()}...</span>`);
          await new Promise(r => setTimeout(r, 600));
          currentLang = lang;
          isAdmin = false; isDevServerRunning = false; currentDir = '/Users/mateus';
          await fullBootSequence();
          return;
        }
        await printLine(`<span style="color:#ef4444;">Usage: lang en | pt</span>`);
        break;
      }

      case 'github':
        await printLine(`<span style="color:#60a5fa;">Redirecting to github.com/AllvesMatteus...</span>`);
        window.open('https://github.com/AllvesMatteus', '_blank');
        await printLine(`<span style="color:#4ade80;">Success. [EXT_URL_OPEN]</span>`);
        break;

      case 'linkedin':
        await printLine(`<span style="color:#60a5fa;">Redirecting to linkedin.com/in/allves-matteus...</span>`);
        window.open('https://www.linkedin.com/in/allves-matteus/', '_blank');
        await printLine(`<span style="color:#4ade80;">Success. [EXT_URL_OPEN]</span>`);
        break;

      case 'sw_vers': {
        await printLine('ProductName:            macOS');
        await printLine('ProductVersion:         15.0');
        await printLine('BuildVersion:           24A335');
        break;
      }

      case 'pbcopy': {
        if (!args[0]) {
          await printLine(`usage: pbcopy [email | linkedin | github]`);
          break;
        }
        const targetVal = args[0].toLowerCase();
        let value = '';
        if (targetVal === 'email') value = 'allves.matteus@hotmail.com';
        else if (targetVal === 'linkedin') value = 'https://www.linkedin.com/in/allves-matteus/';
        else if (targetVal === 'github') value = 'https://github.com/AllvesMatteus';
        else value = args.join(' ');
        
        try {
          await navigator.clipboard.writeText(value);
          await printLine(`<span style="color:#4ade80;">[OK] Copied '${targetVal}' to system clipboard.</span>`);
        } catch (err) {
          await printLine(`<span style="color:#ef4444;">Failed to copy: ${err.message}</span>`);
        }
        break;
      }

      case 'system_profiler': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: system_profiler</span><br><span style="color:#6b7280;"># Dica: use <span style="color:#fbbf24;">sudo -i</span> para acessar ferramentas de engenharia.</span>`);
          break;
        }
        await printLines([
          `Hardware:`,
          ``,
          `    Hardware Overview:`,
          ``,
          `      Model Name: MacBook Pro`,
          `      Model Identifier: MacBookPro18,2`,
          `      Chip: Apple M1 Max`,
          `      Total Number of Cores: 10 (8 performance and 2 efficiency)`,
          `      Memory: 32 GB LPDDR5`,
          `      System Firmware Version: 10151.1.1`,
          `      OS Loader Version: 10151.1.1`,
          `      Serial Number (system): C02GX0XXXXXX`,
          `      Hardware UUID: 00000000-0000-1000-8000-000000000000`,
          `      Provisioning UDID: 00000000-0000-1000-8000-000000000000`,
          `      Activation Lock Status: Enabled`,
          ``,
          `Professional Profile:`,
          `    Name: Mateus Alves`,
          `    Role: Senior Full Stack Developer`,
          `    Specialties: Premium Web Applications, Apple HIG Architecture, React, Node.js`,
          `    Github: github.com/AllvesMatteus`,
          `    Linkedin: linkedin.com/in/allves-matteus/`
        ], 20);
        break;
      }

      case 'defaults': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: defaults</span><br><span style="color:#6b7280;"># Dica: use <span style="color:#fbbf24;">sudo -i</span> para acessar ferramentas de engenharia.</span>`);
          break;
        }
        const writeThemeMatch = raw.match(/defaults\s+write\s+com\.apple\.Theme\s+(Dark|Light)/i);
        if (writeThemeMatch) {
          const theme = writeThemeMatch[1].toLowerCase();
          if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            await printLine(`<span style="color:#4ade80;">System preference updated: Light Theme enabled.</span>`);
          } else {
            document.documentElement.classList.remove('light-theme');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            await printLine(`<span style="color:#4ade80;">System preference updated: Dark Theme enabled.</span>`);
          }
        } else {
          await printLine(`usage: defaults write com.apple.Theme [Dark | Light]`);
        }
        break;
      }

      case 'caffeinate': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: caffeinate</span><br><span style="color:#6b7280;"># Dica: use <span style="color:#fbbf24;">sudo -i</span> para acessar ferramentas de engenharia.</span>`);
          break;
        }
        await printLine(`<span style="color:#fbbf24;">[caffeinate] System sleep prevention activated.</span>`);
        await printLine(`☕ Injetando cafeína no sistema. Pressione <span style="color:#fbbf24;">Ctrl + C</span> para interromper.`);
        activeProcess = 'caffeinate';
        updateTerminalTitle('caffeinate');
        await new Promise(resolve => {
          activeProcessResolve = resolve;
        });
        activeProcess = '';
        updateTerminalTitle();
        await printLine(`<span style="color:#60a5fa;">caffeinate: process terminated. System sleep restored.</span>`);
        break;
      }

      case 'tail': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: tail</span><br><span style="color:#6b7280;"># Dica: use <span style="color:#fbbf24;">sudo -i</span> para acessar ferramentas de engenharia.</span>`);
          break;
        }
        const isFollow = args.includes('-f');
        const file = args.find(a => !a.startsWith('-')) || 'system.log';
        
        const logLines = [
          `Aug 20 01:50:01 MacBook-Pro syslogd[112]: syslogd: restarted`,
          `Aug 20 01:50:03 MacBook-Pro MateusOS[127]: Initializing virtual file system...`,
          `Aug 20 01:50:04 MacBook-Pro MateusOS[127]: WindowManager: Ready`,
          `Aug 20 01:50:05 MacBook-Pro MateusOS[127]: ThemeManager: Dark mode locked`,
          `Aug 20 01:50:06 MacBook-Pro MateusOS[127]: Applications: Loading Finder, Safari, Settings, Terminal`,
          `Aug 20 01:50:08 MacBook-Pro MateusOS[127]: Dock: Loaded 6 active applications`,
          `Aug 20 01:50:10 MacBook-Pro MateusOS[127]: DevServer: listening on port 5173`,
          `Aug 20 01:50:12 MacBook-Pro MateusOS[127]: Sudo Lecture: displayed successfully`
        ];

        if (!isFollow) {
          await printLines(logLines, 40);
          break;
        }

        await printLines(logLines, 40);
        await printLine(`<span style="color:#fbbf24;">Pressione <span style="color:#fbbf24;">Ctrl + C</span> para interromper o log.</span>`);
        
        activeProcess = 'tail';
        updateTerminalTitle('tail');
        
        let tailInterval = null;
        await new Promise(resolve => {
          activeProcessResolve = () => {
            clearInterval(tailInterval);
            resolve();
          };
          
          let counter = 1;
          tailInterval = setInterval(async () => {
            const time = new Date().toLocaleTimeString();
            const messages = [
              `Aug 20 ${time} MacBook-Pro dev-server[504]: HMR update for /assets/js/apps/terminal.js`,
              `Aug 20 ${time} MacBook-Pro WindowManager[127]: Bring window 'terminal' to front`,
              `Aug 20 ${time} MacBook-Pro Finder[201]: Refreshing sidebar item 'OneDrive'`,
              `Aug 20 ${time} MacBook-Pro kernel[0]: Sandbox: sandbox_init successfully executed`,
            ];
            await printLine(messages[Math.floor(Math.random() * messages.length)]);
          }, 1500);
        });
        
        activeProcess = '';
        updateTerminalTitle();
        break;
      }

      case 'git': {
        if (!isAdmin) {
          await printLine(`<span style="color:#ef4444;">zsh: permission denied: git</span><br><span style="color:#6b7280;"># Dica: use <span style="color:#fbbf24;">sudo -i</span> para elevar privilégios.</span>`);
          break;
        }
        if (args[0] === 'log') {
          await printLine(`<span style="color:#fbbf24;">Fetching commit history...</span>`);
          try {
            const resp = await fetch('https://api.github.com/repos/AllvesMatteus/MacOS-Web/commits?per_page=10');
            const commits = await resp.json();
            const lines = commits.flatMap(commit => {
              const author = commit.commit.author || {};
              const date = author.date ? new Date(author.date) : new Date();
              const message = commit.commit.message?.split('\n')[0] || '(no message)';
              return [
                `<span style="color:#fbbf24;">commit ${commit.sha.slice(0, 7)}</span>`,
                `Author: ${author.name || 'Unknown'}`,
                `Date:   ${date.toUTCString()}`,
                ``,
                `    ${message}`,
                ``,
              ];
            });
            await printLines(lines, 20);
          } catch {
            await printLine(`<span style="color:#ef4444;">error:</span> Could not fetch commit history.`);
          }
        } else {
          await printLine(`<span style="color:#ef4444;">git: '${args[0]}' is not a git command</span>`);
        }
        break;
      }

      case 'man': {
        const target = args[0]?.toLowerCase();
        
        let headerLeft = '';
        let headerCenter = '';
        let headerRight = '';
        let footerLeft = '';
        let footerCenter = '';
        let footerRight = '';
        let sections = [];

        if (target === 'intro' || (!isAdmin && !target)) {
          headerLeft = 'INTRO(1)';
          headerCenter = 'General Commands Manual';
          headerRight = 'INTRO(1)';
          footerLeft = 'macOS 15.0';
          footerCenter = 'August 20, 2026';
          footerRight = 'INTRO(1)';
          
          sections = [
            {
              title: 'NAME',
              content: 'intro -- introduction to general commands (tools and utilities)'
            },
            {
              title: 'DESCRIPTION',
              content: 'O MateusOS simula o terminal nativo ZSH do macOS. O modo usuário permite\na navegação básica pelas seções do portfólio de Mateus Alves.'
            },
            {
              title: 'BASIC COMMANDS (Modo Normal)',
              content: 'open [arquivo.md]  Abre seções do portfólio (ex: open about.md).\ncat [arquivo.md]   Exibe o conteúdo texto de um arquivo.\nls [-la]           Lista arquivos do diretório atual.\npwd                Exibe o caminho do diretório atual.\nwhoami             Exibe o nome do usuário ativo.\npbcopy [item]      Copia e-mail/links para a área de transferência.\nclear              Limpa o buffer do terminal.\nexit               Encerra a sessão do terminal.'
            },
            {
              title: 'ELEVATED PRIVILEGES (Modo Engenharia / Devs)',
              content: 'sudo -i            Eleva privilégios para modo ROOT e desbloqueia\n                   ferramentas avançadas (git log, system_profiler,\n                   defaults, caffeinate, logs do servidor e VFS completo).'
            }
          ];
        } else if (isAdmin && (!target || target === 'root-tools')) {
          headerLeft = 'MAN(1)';
          headerCenter = 'General Commands Manual';
          headerRight = 'MAN(1)';
          footerLeft = 'macOS 15.0 (ROOT)';
          footerCenter = 'August 20, 2026';
          footerRight = 'MAN(1)';
          
          sections = [
            {
              title: 'NAME',
              content: 'root-tools -- Ferramentas de Engenharia & Admin (Root Mode)'
            },
            {
              title: 'ADVANCED COMMANDS',
              content: 'git log            Histórico real de commits do projeto.\nsystem_profiler    Relatório completo de hardware "Sobre Este Mac".\ndefaults write     Altera preferências do sistema (temas/idiomas).\ncaffeinate         Evita repouso do sistema e injeta energia.\ncat /etc/hosts     Arquivo de configuração de rede local.\ncat ~/.ssh/*.pub   Chave pública SSH demonstrativa.\ntail -f system.log Visualizador de logs de sistema em tempo real.\nnpm run dev        Servidor simulado de desenvolvimento.'
            }
          ];
        } else {
          await printLine(`No manual entry for ${args[0]}`);
          break;
        }

        // Save buffer and clear screen
        const originalBuffer = outputEl.innerHTML;
        outputEl.innerHTML = '';
        
        // Render Header
        const headerEl = document.createElement('div');
        headerEl.style.cssText = 'display:flex;justify-content:space-between;width:100%;color:#ffffff;font-weight:700;margin-bottom:14px;font-family:inherit;';
        headerEl.innerHTML = `<span>${headerLeft}</span><span>${headerCenter}</span><span>${headerRight}</span>`;
        outputEl.appendChild(headerEl);

        // Render Sections
        for (const sec of sections) {
          const secEl = document.createElement('div');
          secEl.style.cssText = 'margin-bottom:14px;font-family:inherit;';
          secEl.innerHTML = `
            <div style="font-weight:700;color:#ffffff;text-transform:uppercase;">${sec.title}</div>
            <div style="margin-left:32px;color:#ffffff;white-space:pre-wrap;line-height:1.45;font-family:inherit;">${sec.content}</div>
          `;
          outputEl.appendChild(secEl);
        }

        // Render Footer
        const footerEl = document.createElement('div');
        footerEl.style.cssText = 'display:flex;justify-content:space-between;width:100%;color:#ffffff;font-weight:700;margin-top:24px;margin-bottom:12px;font-family:inherit;';
        footerEl.innerHTML = `<span>${footerLeft}</span><span>${footerCenter}</span><span>${footerRight}</span>`;
        outputEl.appendChild(footerEl);

        // Render tildes
        for (let i = 0; i < 5; i++) {
          const tilde = document.createElement('div');
          tilde.style.cssText = 'color:#4b5563;margin-bottom:4px;font-family:inherit;';
          tilde.textContent = '~';
          outputEl.appendChild(tilde);
        }

        // Render (END) indicator
        const endBar = document.createElement('div');
        endBar.style.cssText = 'display:inline-block;background:#ffffff;color:#000000;font-weight:700;padding:0 4px;font-size:10px;margin-top:14px;font-family:inherit;';
        endBar.textContent = '(END)';
        outputEl.appendChild(endBar);

        activeProcess = 'less';
        updateTerminalTitle(target === 'intro' || (!isAdmin && !target) ? 'less — man intro — 104x33' : 'less — man root-tools — 104x33');
        scrollToBottom();

        // Register document keydown listener to capture exit keys
        await new Promise(resolve => {
          const handlePagerExit = e => {
            if (e.key.toLowerCase() === 'q' || e.key === 'Escape' || e.key === 'Enter' || (e.key === 'c' && e.ctrlKey)) {
              e.preventDefault();
              document.removeEventListener('keydown', handlePagerExit);
              resolve();
            }
          };
          document.addEventListener('keydown', handlePagerExit);
        });

        // Exit pager and restore screen
        activeProcess = '';
        updateTerminalTitle();
        outputEl.innerHTML = originalBuffer;
        scrollToBottom();
        break;
      }

      case 'cowsay': {
        const text = joinArgs || 'Moo!';
        const f = text.length > 40 ? text.slice(0, 40) + '...' : text;
        await printLines([
          ` ${'_'.repeat(f.length + 2)}`,
          `< ${f} >`,
          ` ${'-'.repeat(f.length + 2)}`,
          '        \\   ^__^',
          '         \\  (oo)\\_______',
          '            (__)\\       )\\/\\',
          '                ||----w |',
          '                ||     ||',
        ], 30);
        break;
      }

      case 'figlet':
        await printLines([
          '  __  __       _                     ____   ____',
          ' |  \\/  | __ _| |_ ___ _    ___    |  _ \\ / ___|',
          " | |\\/| |/ _` | __/ _ \\ | | / __|   | |_) | |",
          ' | |  | | (_| | ||  __/ |_| \\__ \\   |  __/| |___',
          ' |_|  |_|\\__,_|\\__\\___|\\__,_|___/   |_|    \\____|',
        ], 20);
        break;

      case 'matrix':
        if (matrixInterval) {
          clearInterval(matrixInterval);
          matrixInterval = null;
          await printLine(`<span style="color:#ef4444;">Matrix effect stopped.</span>`);
        } else {
          matrixInterval = setInterval(async () => {
            await printLine(`<span style="color:#4ade80;">${randomMatrixStr()}</span>`);
          }, 120);
          await printLine(`<span style="color:#4ade80;">Matrix rain started. (Type "matrix" again to stop)</span>`);
        }
        break;

      case 'ping': {
        const host = joinArgs || 'localhost';
        await printLines([
          `PING ${host}: 56 data bytes`,
          `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.042 ms`,
          `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.038 ms`,
          `--- ping statistics ---`,
          `2 packets transmitted, 2 received, 0% packet loss`,
        ], 200);
        break;
      }

      case 'df':
        await printLines([
          'Filesystem      Size   Used  Avail Capacity',
          '/dev/disk0s1   500G   120G   380G    32%',
          'tmpfs          8.0G   1.2G   6.8G    15%',
        ], 30);
        break;

      case 'top':
        await printLines([
          `<span style="color:#22d3ee;">Processes: 312 total, 3 running</span>`, ``,
          `  PID CMD              %CPU %MEM`,
          `  1   kernel_task       0.0  0.5`,
          `  2   launchd           0.0  0.1`,
          `  89  Safari            1.2  2.3`,
          ` 120  Terminal          0.3  0.8`,
          ` 221  Mateus PC         2.1  1.9`, ``,
          `(mock output)`,
        ], 30);
        break;

      default: {
        await printLine(`<span style="color:#ef4444;">zsh: command not found: ${cmd}</span>`);
        if (!isAdmin) {
          const keywords = {
            'sobre': 'about', 'mim': 'about', 'formacao': 'education', 'experiencia': 'experience',
            'habilidades': 'skills', 'projetos': 'projects', 'contato': 'contact',
          };
          let suggestion = '';
          for (let key in keywords) {
            if (raw.includes(key)) { suggestion = `Você quis dizer <span style="color:#fbbf24;">open ${keywords[key]}</span>?`; break; }
          }
          if (suggestion) await printLine(`<span style="color:#6b7280;"># ${suggestion}</span>`);
          else await printLine(`<span style="color:#6b7280;"># Digite <span style="color:#fbbf24;">man</span> para ver os comandos disponíveis.</span>`);
        }
        break;
      }
    }

    } catch (err) {
      console.error(err);
      await printLine(`<span style="color:#ef4444;">Internal error: ${err.message}</span>`);
    } finally {
      updatePrompt();
      inputLine.style.display = 'flex';
      input.disabled = false;
      input.focus();
      scrollToBottom();
    }
  }

  input.addEventListener('input', () => {
    updateInputDisplay(input.value);
  });

  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      input.value = '';
      updateInputDisplay('');
      
      if (isPasswordPrompt) {
        isPasswordPrompt = false;
        if (passwordCallback) {
          const cb = passwordCallback;
          passwordCallback = null;
          cb(raw);
        }
        return;
      }
      
      if (matrixInterval) { clearInterval(matrixInterval); matrixInterval = null; }
      if (raw) { cmdHistory.push(raw); historyIdx = cmdHistory.length; }
      await printLine(`${getPromptHtml()} ${raw}`, 0);
      await runCommand(raw);

    } else if (e.key === 'Tab' || (e.key === 'ArrowRight' && input.selectionStart === input.value.length)) {
      e.preventDefault();
      if (currentSuggestion) {
        input.value = currentSuggestion;
        updateInputDisplay(currentSuggestion);
      } else if (e.key === 'Tab') {
        const val = input.value.toLowerCase();
        const match = AUTOCOMPLETE_CMDS.find(c => c.startsWith(val));
        if (match) { input.value = match; updateInputDisplay(match); }
      }

    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) { historyIdx--; input.value = cmdHistory[historyIdx]; updateInputDisplay(input.value); }

    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) { historyIdx++; input.value = cmdHistory[historyIdx]; updateInputDisplay(input.value); }
      else { historyIdx = cmdHistory.length; input.value = ''; updateInputDisplay(''); }

    } else if (e.key === 'c' && e.ctrlKey) {
      if (matrixInterval) { clearInterval(matrixInterval); matrixInterval = null; }
      if (isPasswordPrompt) {
        isPasswordPrompt = false;
        passwordCallback = null;
      }
      if (activeProcessResolve) {
        const resolve = activeProcessResolve;
        activeProcessResolve = null;
        resolve();
      }
      await printLine(`<span style="color:#ef4444;">^C</span>`);
      input.value = '';
      updateInputDisplay('');
    }
  });

  fullBootSequence();
}

function extractQuotedStrings(str) {
  const regex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|“[^”]*”/g;
  const matches = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    let content = match[0];
    content = content.substring(1, content.length - 1);
    content = content.replace(/\\"/g, '"').replace(/\\'/g, "'");
    matches.push({
      raw: match[0],
      content: content,
      index: match.index
    });
  }
  return matches;
}

function parseAppleScriptAlert(str) {
  const alertIdx = str.toLowerCase().indexOf('display alert');
  if (alertIdx === -1) return null;

  const sub = str.substring(alertIdx + 13);
  const quotes = extractQuotedStrings(sub);
  if (quotes.length === 0) return null;

  const messageText = quotes[0].content;

  let informativeText = '';
  const msgMatch = sub.match(/message\s+["'“]([^"'”]+)["'”]/i);
  if (msgMatch) {
    informativeText = msgMatch[1];
  }

  let buttons = ['OK'];
  const buttonsMatch = sub.match(/buttons\s*\{([^}]+)\}/i) || sub.match(/buttons\s*\[([^\]]+)\]/i);
  if (buttonsMatch) {
    const btnSub = buttonsMatch[1];
    const btnQuotes = extractQuotedStrings(btnSub);
    if (btnQuotes.length > 0) {
      buttons = btnQuotes.map(q => q.content);
    }
  }

  let defaultBtnText = '';
  const defBtnMatch = sub.match(/default\s+button\s+["'“]([^"'”]+)["'”]/i);
  if (defBtnMatch) {
    defaultBtnText = defBtnMatch[1];
  } else {
    const defBtnNumMatch = sub.match(/default\s+button\s+(\d+)/i);
    if (defBtnNumMatch) {
      const idx = parseInt(defBtnNumMatch[1], 10) - 1;
      if (idx >= 0 && idx < buttons.length) {
        defaultBtnText = buttons[idx];
      }
    }
  }

  if (defaultBtnText && buttons.includes(defaultBtnText)) {
    buttons = buttons.filter(b => b !== defaultBtnText);
    buttons.push(defaultBtnText);
  }

  let iconSrc = 'assets/icons/apps/custom/terminal.png';
  if (/as\s+warning/i.test(sub)) {
    iconSrc = 'assets/icons/sf-symbols/white/exclamationmark.triangle.fill.png';
  } else if (/as\s+critical/i.test(sub)) {
    iconSrc = 'assets/icons/sf-symbols/white/exclamationmark.octagon.fill.png';
  }

  return {
    messageText,
    informativeText,
    buttons,
    iconSrc
  };
}

function parseAppleScriptNotification(str) {
  const notifIdx = str.toLowerCase().indexOf('display notification');
  if (notifIdx === -1) return null;

  const sub = str.substring(notifIdx + 20);
  const quotes = extractQuotedStrings(sub);
  if (quotes.length === 0) return null;

  const desc = quotes[0].content;

  let title = 'Terminal';
  const titleMatch = sub.match(/with\s+title\s+["'“]([^"'”]+)["'”]/i);
  if (titleMatch) {
    title = titleMatch[1];
  }

  let subtitle = 'osascript';
  const subtitleMatch = sub.match(/subtitle\s+["'“]([^"'”]+)["'”]/i);
  if (subtitleMatch) {
    subtitle = subtitleMatch[1];
  }

  return {
    desc,
    title,
    subtitle
  };
}
