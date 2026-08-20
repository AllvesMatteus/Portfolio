document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('terminal-splash');
    const returnBtn = document.getElementById('returnTerminalBtn');
    const skipBtn = document.getElementById('skipTerminalBtn');

    const output = document.getElementById('terminal-output');
    const inputLine = document.getElementById('terminal-input-line');
    const inputField = document.getElementById('terminal-input');
    const inputDisplay = document.getElementById('terminal-input-display');
    const terminalBody = document.getElementById('terminal-body');
    const visualContainer = document.getElementById('visual-container');

    const terminalSuggestion = document.getElementById('terminal-suggestion');
    let history = [];
    let historyIdx = -1;
    let isLocked = true;
    const pageStartTime = Date.now();
    let currentSuggestion = '';
    let isAdmin = false;
    let isDevServerRunning = false;
    let isWaitingForPassword = false;
    let currentDir = '/Users/mateus';
    const technicalProgress = new Set();

    const VFS = {
        '/': { type: 'dir', children: ['Applications', 'Library', 'System', 'Users', 'Volumes', 'bin', 'cores', 'dev', 'etc', 'private', 'sbin', 'tmp', 'usr', 'var'] },
        '/Applications': { type: 'dir', children: ['Safari.app', 'Terminal.app', 'Portfolio.app'] },
        '/Library': { type: 'dir', children: ['Preferences', 'Logs'] },
        '/System': { type: 'dir', children: ['Library'] },
        '/Users': { type: 'dir', children: ['mateus', 'guest', 'shared'] },
        '/Users/mateus': { type: 'dir', children: ['about.md', 'skills.md', 'projects.md', 'experience.md', 'education.md', 'contact.md'] },
        '/var': { type: 'dir', children: ['root', 'log', 'tmp'] },
        '/var/root': { type: 'dir', children: ['.zshrc', '.ssh'] },
        '/tmp': { type: 'dir', children: [] },
        '/etc': { type: 'dir', children: ['hosts', 'zshrc'] }
    };

    const ASCII_LOGO = `<div class="terminal-logo-scale origin-left">
<span class="text-indigo-400">███╗   ███╗ █████╗ ████████╗███████╗██╗   ██╗███████╗</span>
<span class="text-indigo-500">████╗ ████║██╔══██╗╚══██╔══╝██╔════╝██║   ██║██╔════╝</span>
<span class="text-indigo-600">██╔████╔██║███████║   ██║   █████╗  ██║   ██║███████╗</span>
<span class="text-indigo-700">██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  ██║   ██║╚════██║</span>
<span class="text-indigo-800">██║ ╚═╝ ██║██║  ██║   ██║   ███████╗╚██████╔╝███████║</span>
<span class="text-indigo-900">╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝ ╚══════╝</span>
</div>
`;

    /* --- Sequência de Boot --- */
    function getBootSequence() {
        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateStr = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        const helpHint = TRANSLATIONS[currentLang].term_boot_hint;

        return [
            `<span class="text-gray-500">Last login: ${dateStr} on ttys001</span>`,
            `<span class="text-gray-400">Initializing MateusOS environment...</span>`,
            `<span class="text-gray-400">Loading modules...</span>`,
            `<span class="text-gray-400">System ready.</span>`,
            `<br><span class="text-gray-500">${helpHint}</span>`,
            ``
        ];
    }

    /* --- Inicialização Boot --- */
    async function fullBootSequence() {
        output.innerHTML = '';
        inputLine.classList.add('hidden');
        await printLine(ASCII_LOGO, false, 50);
        await new Promise(r => setTimeout(r, 200));
        await printLines(getBootSequence(), 40);

        inputLine.classList.remove('hidden');
        inputDisplay.innerHTML = '<span class="terminal-cursor"></span>';
        inputField.focus();
        scrollToBottom();
    }

    /* --- Comandos --- */
    const COMMANDS = {
        'help': {
            desc: () => currentLang === 'pt' ? 'Exibe a ajuda do sistema' : 'Display system help',
            exec: async () => {
                const helpData = isAdmin ? [
                    `<span class="text-red-500 font-bold tracking-widest uppercase">Root Mode — MateusOS v2.5</span>`,
                    `<span class="text-gray-600">────────────────────────────────────────────</span>`,
                    `<br><span class="text-red-500 font-bold tracking-widest uppercase">Navegação VFS</span>`,
                    `  ls              # Listar arquivos do diretório atual`,
                    `  cd [caminho]    # Mudar de diretório (suporta .. e ~)`,
                    `  pwd             # Caminho do diretório atual`,
                    `  cat [arquivo]   # Ler conteúdo de um arquivo .md`,
                    `<br><span class="text-red-500 font-bold tracking-widest uppercase">Scripts NPM</span>`,
                    `  npm run dev     # Iniciar servidor de desenvolvimento`,
                    `  npm run [seção] # Navegar para uma seção do portfólio`,
                    `<br><span class="text-red-500 font-bold tracking-widest uppercase">Ferramentas</span>`,
                    `  neofetch        # Resumo técnico do sistema`,
                    `  omz             # Instalar Oh My Zsh`,
                    `  whoami          # Identidade do usuário atual`,
                    `<br><span class="text-red-500 font-bold tracking-widest uppercase">Sistema</span>`,
                    `  lang [en|pt]    # Alterar idioma do sistema`,
                    `  clear           # Limpar a tela`,
                    `  exit            # Encerrar sessão root`,
                    `  github          # Abrir perfil no GitHub`,
                    `  linkedin        # Abrir perfil no LinkedIn`,
                    `<br><span class="text-gray-500"># Setas ↑↓ para histórico | Tab para autocompletar</span>`
                ] : [
                    `<span class="text-indigo-400 font-bold tracking-widest uppercase">NAVEGAÇÃO</span>`,
                    `  open sobre      # Informações profissionais`,
                    `  open projetos   # Galeria de trabalhos`,
                    `  open habilidades # Stack tecnológica`,
                    `  open contato    # Redes sociais e email`,
                    `  open formacao   # Trajetória acadêmica`,
                    `<br><span class="text-indigo-400 font-bold tracking-widest uppercase">SISTEMA</span>`,
                    `  gui             # Alterna para a interface visual`,
                    `  lang [en|pt]    # Idioma / Language`,
                    `  clear           # Limpa a tela`,
                    `  reset           # Reiniciar terminal`,
                    `  sudo -i         # Acessar modo administrador`,
                    `<br><span class="text-gray-500"># Setas ↑↓ para histórico | Tab para autocompletar</span>`
                ];

                await printLines(helpData);
                return "";
            }
        },
        'sudo': {
            desc: () => isAdmin ? 'Status: Elevated' : 'Login root (sudo -i)',
            exec: async (args) => {
                const isInteractive = args && (args.includes('-i') || args.includes('-s')) || (args && args[0] === 'su');

                if (!isAdmin) {
                    if (isInteractive) {
                        (async () => {
                            await printLine(`Password:`, false, 50);
                            const promptLabel = document.getElementById('prompt-label');
                            if (promptLabel) promptLabel.classList.add('animate-pulse');

                            const delay = 1200 + Math.random() * 800;
                            await new Promise(r => setTimeout(r, delay));

                            if (Math.random() < 0.10) {
                                if (promptLabel) promptLabel.classList.remove('animate-pulse');
                                await printLine(`Sorry, try again.`, false, 100);
                                showPrompt();
                                return;
                            }

                            isAdmin = true;
                            currentDir = '/var/root';
                            output.innerHTML = '';

                            const titleEl = document.querySelector('[data-i18n="terminal_title"]');
                            await scrambleText(titleEl, `<span class="text-red-500">root</span>@MacBook-Pro: ~`, 1200);

                            const now = new Date();
                            const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
                            await printLine(`<br>Last login: ${dateStr} ${timeStr} on ttys000`);


                            const rootModal = document.getElementById('root-guide-modal');
                            if (rootModal) {
                                rootModal.classList.add('show');
                                const closeBtn = document.getElementById('closeRootModal');
                                if (closeBtn) {
                                    closeBtn.onclick = () => {
                                        rootModal.classList.remove('show');
                                        inputField.focus();
                                    };
                                }
                            }

                            showPrompt();
                        })();

                        inputLine.classList.add('hidden');
                        return null;
                    } else {
                        const hintMsg = currentLang === 'pt' ? 'Dica: use <span class="text-yellow-400">sudo -i</span> para elevar privilégios.' : 'Hint: use <span class="text-yellow-400">sudo -i</span> to elevate privileges.';
                        return [
                            `usage: sudo [-s | -i] [command]`,
                            `<span class="text-gray-500">${hintMsg}</span>`
                        ];
                    }
                } else {
                    return `<span class="text-gray-500"># Already running as superuser (root). Use <span class="text-yellow-400">exit</span> to logout.</span>`;
                }
            }
        },
        'exit': {
            desc: () => isAdmin ? 'Logout from root' : 'Close terminal session',
            exec: async () => {
                if (isAdmin) {
                    isAdmin = false;
                    isDevServerRunning = false;
                    currentDir = '/Users/mateus';
                    await printLine(`<span class="text-blue-400">logout</span>`, false, 200);
                    await printLine(`<span class="text-gray-500">[Process completed]</span>`, false, 400);
                    await new Promise(r => setTimeout(r, 800));
                    await fullBootSequence();
                    const titleText = currentLang === 'pt' ? 'mateus — portifólio' : 'mateus — portfolio';
                    document.querySelector('[data-i18n="terminal_title"]').innerHTML = titleText;
                    updatePrompt();
                    return "";
                } else {
                    await printLine(`<span class="text-gray-500">Closing session...</span>`, false, 200);
                    unlockPortfolio('heroSection', true);
                    return null;
                }
            }
        },
        'logout': {
            exec: async () => COMMANDS['exit'].exec()
        },
        'dev': {
            desc: () => 'Shortcut for sudo mode',
            exec: async () => COMMANDS['sudo'].exec()
        },
        'engineering': {
            desc: () => 'Alias for sudo',
            exec: async () => COMMANDS['sudo'].exec()
        },
        'neofetch': {
            desc: () => 'System information summary',
            exec: async () => {
                if (!isAdmin) {
                    const neoDeny = currentLang === 'pt' ? 'Dica: use <span class="text-yellow-400">sudo -i</span> para acessar ferramentas de engenharia.' : 'Hint: use <span class="text-yellow-400">sudo -i</span> to access engineering tools.';
                    return `<span class="text-red-500">zsh: permission denied: neofetch</span>\n<span class="text-gray-500">${neoDeny}</span>`;
                }
                const uptime = Math.floor((Date.now() - pageStartTime) / 60000);
                const res = `2560x1440`;

                const logo = [
                    `<span class="text-blue-500">                    .-.</span>`,
                    `<span class="text-blue-500">                   /   \\</span>`,
                    `<span class="text-blue-500">                  /     \\</span>`,
                    `<span class="text-blue-500">                 /       \\</span>`,
                    `<span class="text-blue-400">                /   / \\   \\</span>`,
                    `<span class="text-blue-400">               /   /   \\   \\</span>`,
                    `<span class="text-blue-300">              /   /     \\   \\</span>`,
                    `<span class="text-blue-300">             /   /       \\   \\</span>`,
                    `<span class="text-blue-300">            /   /         \\   \\</span>`,
                    `<span class="text-blue-300">           /___/           \\___\\</span>`
                ];

                const info = [
                    `<span class="text-blue-400 font-bold">mateus</span>@<span class="text-blue-400 font-bold">portfolio</span>`,
                    `<span class="text-white">-----------------------</span>`,
                    `<span class="text-blue-400 font-bold">Github</span>: <span class="text-white">AllvesMatteus</span>`,
                    `<span class="text-blue-400 font-bold">OS</span>: <span class="text-white">MateusOS v2.0.5</span>`,
                    `<span class="text-blue-400 font-bold">Host</span>: <span class="text-white">MacBook Pro Portfolio Edition</span>`,
                    `<span class="text-blue-400 font-bold">Uptime</span>: <span class="text-white">${uptime} mins</span>`,
                    `<span class="text-blue-400 font-bold">Resolution</span>: <span class="text-white">${res}</span>`,
                    `<span class="text-blue-400 font-bold">Shell</span>: <span class="text-white">zsh 5.8 (mateus-shell)</span>`,
                    `<span class="text-blue-400 font-bold">Source</span>: <span class="text-white underline">github.com/AllvesMatteus/Portfolio</span>`,
                    `<span class="text-blue-400 font-bold">Inspiration</span>: <span class="text-white underline">aura.build/templates/7ARR67L</span>`,
                    `<span class="text-blue-400 font-bold">Memory</span>: <span class="text-white">512MB / 1024MB</span>`,
                    ``,
                    `<div class="flex gap-2">`,
                    `  <div class="w-3 h-3 bg-black"></div><div class="w-3 h-3 bg-red-500"></div><div class="w-3 h-3 bg-green-500"></div><div class="w-3 h-3 bg-yellow-500"></div><div class="w-3 h-3 bg-blue-500"></div><div class="w-3 h-3 bg-magenta-500"></div><div class="w-3 h-3 bg-cyan-500"></div><div class="w-3 h-3 bg-white"></div>`,
                    `</div>`
                ];

                const maxLength = Math.max(logo.length, info.length);
                const outputLines = [];
                for (let i = 0; i < maxLength; i++) {
                    const l = logo[i] || " ".repeat(30);
                    const r = info[i] || "";
                    outputLines.push(`${l}   ${r}`);
                }

                await printLines(outputLines);
                return "";
            }
        },
        'system': {
            desc: () => 'Alias for neofetch',
            exec: async () => COMMANDS['neofetch'].exec()
        },
        'omz': {
            desc: () => 'Instala o Oh My Zsh',
            exec: async () => {
                if (!isAdmin) {
                    const denyMsg = currentLang === 'pt' ? 'Dica: use <span class="text-yellow-400">sudo -i</span> para instalar pacotes de sistema.' : 'Hint: use <span class="text-yellow-400">sudo -i</span> to install system packages.';
                    return `<span class="text-red-500">zsh: permission denied: omz</span>\n<span class="text-gray-500">${denyMsg}</span>`;
                }
                const steps = [
                    `<span class="text-blue-400">Cloning Oh My Zsh...</span>`,
                    `<span class="text-gray-400">remote: Enumerating objects: 1209, done.</span>`,
                    `<span class="text-gray-400">remote: Counting objects: 100% (1209/1209), done.</span>`,
                    `<span class="text-green-400">Resolving deltas: 100% (712/712), done.</span>`,
                    `<span class="text-yellow-400">Looking for an existing zsh config...</span>`,
                    `<span class="text-cyan-400">Using the Oh My Zsh template file and adding it to ~/.zshrc.</span>`,
                    `<br><span class="text-yellow-400">      __                                     __   </span>`,
                    `<span class="text-yellow-400"> ____/ /_     ____ ___  __  __   ____  _____/ /_  </span>`,
                    `<span class="text-yellow-400">/ __  / /_   / __ \`__ \\/ / / /  /_  / / ___/ __ \\ </span>`,
                    `<span class="text-yellow-400">/ /_/ / __ \\ / / / / / / /_/ /    / /_(__  ) / / / </span>`,
                    `<span class="text-yellow-400">\\__,_/_/ /_//_/ /_/ /_/\\__, /    /___/____/_/ /_/  </span>`,
                    `<span class="text-yellow-400">                      /____/                       ....is now installed!</span>`,
                    `<br><span class="text-green-400">Please look at the ~/.zshrc file to change settings.</span>`,
                    `<span class="text-white font-bold">HAVE FUN! 🚀</span>`
                ];
                await printLines(steps, 100);
                isOMZInstalled = true;
                localStorage.setItem('omz_installed', 'true');
                updatePrompt();
                return null;
            }
        },
        'whoami': {
            desc: () => currentLang === 'pt' ? 'Informações sobre o usuário' : 'User information',
            exec: async () => {
                if (isAdmin) {
                    return `root`;
                }

                const birthDate = new Date(1997, 5, 25);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

                return [
                    `<br><span class="text-white font-bold">USER_INFO</span>`,
                    `----------------------------------------`,
                    `<span class="text-blue-400">IDENTITY:</span> <span class="text-white">Mateus Alves</span>`,
                    `<span class="text-blue-400">CONTEXT:</span>  mateus@portfolio`,
                    `<span class="text-blue-400">AGE:</span>      <span class="text-white">${age}</span>`,
                    `<span class="text-blue-400">STATUS:</span>   <span class="text-green-400">Full Stack Engineer</span>`,
                    `<span class="text-blue-400">BIO:</span>      <span class="text-gray-400">${currentLang === 'pt' ? 'Especialista em criar interfaces premium.' : 'Specialist in creating premium interfaces.'}</span>`,
                    `----------------------------------------<br>`
                ];
            }
        },
        'npm': {
            desc: () => 'Simula execução de pacotes npm',
            exec: async (args) => {
                if (!isAdmin) {
                    const denyMsg = currentLang === 'pt' ? 'Dica: use <span class="text-yellow-400">sudo -i</span> para executar scripts npm.' : 'Hint: use <span class="text-yellow-400">sudo -i</span> to run npm scripts.';
                    return `<span class="text-red-600 font-bold">npm ERR!</span> <span class="text-white">code EACCES</span>\n<span class="text-gray-500">${denyMsg}</span>`;
                }

                if (args[0] === 'run') {
                    const script = args[1];
                    if (script === 'dev') {
                        isDevServerRunning = true;
                        technicalProgress.clear();
                        await printLine(`<span class="text-white font-bold">> portfolio-allvesmatteus@1.0.0 dev</span>`, false, 200);
                        await printLine(`<span class="text-white font-bold">> vite</span><br>`, false, 400);
                        await printLine(`<span class="text-yellow-400 animate-pulse">${currentLang === 'pt' ? 'Compilando módulos...' : 'Compiling modules...'}</span>`, false, 600);
                        await new Promise(r => setTimeout(r, 1000));
                        await printLine(`<br><span class="text-cyan-400 font-bold">VITE v5.2.0</span>  <span class="text-white">ready in 248 ms</span><br>`, false, 200);
                        await printLine(`  <span class="text-green-400">➜</span>  <span class="text-white font-bold">Local:</span>   <span class="text-cyan-300 underline cursor-pointer">http://localhost:5173/</span>`, false, 200);
                        await printLine(`  <span class="text-gray-500">➜</span>  <span class="text-gray-500 font-bold">Network:</span> use --host to expose<br>`, false, 200);
                        return `<span class="text-green-400">✓ ${currentLang === 'pt' ? 'Servidor pronto!' : 'Server ready!'}</span><br><span class="text-gray-500"># Navegue pelas seções usando <span class="text-yellow-400">npm run [sessão]</span> (ex: <span class="text-yellow-400">npm run sobre</span>).</span>`;
                    }

                    if (script === 'legacy') {
                        const allVisited = Array.from(techRequired).every(m => technicalProgress.has(m));
                        if (!allVisited) {
                            return `<span class="text-red-500">npm ERR!</span> <span class="font-bold text-gray-300">code</span> EMISSING_SCRIPT\n<span class="text-red-500">npm ERR!</span> <span class="font-bold text-gray-300">missing script:</span> legacy\n\n<span class="text-gray-500">npm ERR! A complete log of this run can be found in: /Users/mateus/.npm/_logs/` + Date.now() + `-debug.log</span>`;
                        }

                        await printLine(`<span class="text-yellow-400">WARNING: TIME TRAVEL PROTOCOL ACTIVATED...</span>`, false, 300);
                        await printLine(`<span class="text-gray-500">Loading Legacy Environment [2020.v1]...</span>`, false, 400);
                        setTimeout(() => {
                            window.location.href = 'docs/legacy.html?auth=mateus-legacy-unlocked-2020';
                        }, 1500);
                        return "Redirecting... Enjoy the evolution!";
                    }

                    const result = await handleNavigation(script);
                    if (result === true) return `<span class="text-green-400">Done. [OK]</span>`;
                    if (typeof result === 'string') return result;
                }
                return `<span class="text-red-500">npm ERR!</span> <span class="text-white">code ELIFECYCLE</span>\n<span class="text-red-500">npm ERR!</span> <span class="text-white">errno 1</span>\n<span class="text-gray-500">npm ERR! script not found.</span>`;
            }
        },
        'reset': {
            desc: 'Reiniciar o terminal',
            exec: async () => {
                if (isAdmin) {
                    await printLine(`<span class="text-red-600 font-bold ml-[-10px] bg-red-500/10 px-2 py-1">[ACCESS DENIED]</span> <span class="text-red-500">System integrity locked. Escaping is no longer an option. Reboot sequence intercepted by root.</span>`, false, 200);
                    return "";
                }
                output.innerHTML = '';
                await printLine(`<span class="text-gray-500">Restarting system...</span>`);
                await new Promise(r => setTimeout(r, 800));
                location.reload();
                return null;
            }
        },
        'clear': {
            desc: 'Limpar a tela',
            exec: async () => {
                output.innerHTML = '';
                return null;
            }
        },
        'gui': {
            desc: () => 'Modo gráfico',
            exec: async () => {
                await printLine(`<span class="text-cyan-400">Launching Graphical User Interface...</span>`);
                await new Promise(r => setTimeout(r, 600));
                unlockPortfolio('heroSection', true);
                return null;
            }
        },
        'lang': {
            desc: () => 'Muda o idioma do sistema',
            exec: async (args) => {
                const lang = args[0]?.toLowerCase();
                if (lang === 'pt' || lang === 'en') {
                    if (lang === currentLang) {
                        return `<span class="text-blue-400">${currentLang === 'pt' ? 'O sistema já está em Português.' : 'System is already in English.'}</span>`;
                    }

                    await printLine(`<span class="text-yellow-400">Changing system locale to ${lang.toUpperCase()}...</span>`);
                    await new Promise(r => setTimeout(r, 600));

                    if (window.setLanguage) window.setLanguage(lang);

                    await fullBootSequence();
                    return null;
                }
                return `<span class="text-red-400">Usage: lang en | pt</span>`;
            }
        },
        'github': {
            exec: async () => {
                await printLine(`<span class="text-blue-400">Redirecting to github.com/AllvesMatteus...</span>`);
                window.open('https://github.com/AllvesMatteus', '_blank');
                return `<span class="text-green-400">Success. [EXT_URL_OPEN]</span>`;
            }
        },

        'linkedin': {
            exec: async () => {
                await printLine(`<span class="text-blue-400">Redirecting to linkedin.com/in/allves-matteus...</span>`);
                window.open('https://www.linkedin.com/in/allves-matteus/', '_blank');
                return `<span class="text-green-400">Success. [EXT_URL_OPEN]</span>`;
            }
        },
        'ls': {
            desc: () => currentLang === 'pt' ? 'Lista arquivos de seção' : 'List section files',
            exec: async (args) => {
                let target = args[0] || currentDir;

                if (!isAdmin && (target.startsWith('/var/root') || target.startsWith('/root'))) {
                    return `<span class="text-red-400">ls: .: Permission denied</span>`;
                }

                if (!target.startsWith('/')) {
                    target = (currentDir === '/' ? '/' : currentDir + '/') + target;
                }
                target = target.replace(/\/+$/, '') || '/';

                if (VFS[target]) {
                    return VFS[target].children.map(name => {
                        const fullPath = target === '/' ? '/' + name : target + '/' + name;
                        const isDir = VFS[fullPath] ? true : false;
                        return isDir ? `<span class="text-blue-500 font-bold">${name}/</span>` : `<span class="text-white">${name}</span>`;
                    }).join('  ');
                }
                return `ls: ${args[0]}: No such file or directory`;
            }
        },
        'cd': {
            desc: () => 'Mudar diretório',
            exec: async (args) => {
                let path = args[0] || (isAdmin ? '/var/root' : '/Users/mateus');
                if (path === '~') path = isAdmin ? '/var/root' : '/Users/mateus';
                if (path === '..') {
                    const parts = currentDir.split('/').filter(p => p);
                    parts.pop();
                    path = '/' + parts.join('/');
                } else if (!path.startsWith('/')) {
                    path = (currentDir === '/' ? '/' : currentDir + '/') + path;
                }
                path = path.replace(/\/+$/, '') || '/';

                if (VFS[path]) {
                    currentDir = path;
                    updatePrompt();
                    return "";
                }
                return `cd: no such file or directory: ${args[0]}`;
            }
        },
        'pwd': {
            desc: () => 'Exibir diretório atual',
            exec: async () => currentDir
        },
        'echo': {
            desc: () => 'Exibir texto',
            exec: async (args) => args.join(' ')
        },
        'id': {
            desc: () => 'Exibir identidade do usuário atual',
            exec: async () => {
                if (isAdmin) {
                    return `uid=0(root) gid=0(wheel) groups=0(wheel),1(daemon),2(kmem),3(sys),4(tty),5(operator),8(procview),9(procmod),12(everyone),20(staff),29(certusers),61(localaccounts),701(com.apple.sharepoint.group.1),33(_appstore),98(_lpadmin),100(_lpoperator),204(_developer),250(_analyticsusers),395(com.apple.access_ftp),398(com.apple.access_screensharing),399(com.apple.access_ssh),400(com.apple.access_remote_ae)`;
                }
                return `uid=501(mateus) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts)`;
            }
        },
        'cat': {
            desc: () => currentLang === 'pt' ? 'Exibe conteúdo de um arquivo' : 'Display file content',
            exec: async (args) => {
                if (!args[0]) return `usage: cat [file]`;
                const file = args[0].toLowerCase();

                if (!isAdmin && (currentDir.startsWith('/var') || currentDir.startsWith('/System') || currentDir.startsWith('/etc'))) {
                    return `cat: ${args[0]}: Permission denied`;
                }

                const map = {
                    'about.md': 'about', 'skills.md': 'skills', 'projects.md': 'projects',
                    'experience.md': 'experience', 'education.md': 'education', 'contact.md': 'contact'
                };

                const basename = file.split('/').pop();
                if (map[basename]) {
                    return COMMANDS['npm'].exec(['run', map[basename]]);
                }
                return `cat: ${args[0]}: No such file or directory`;
            }
        },
        'open': {
            desc: () => currentLang === 'pt' ? 'Abre uma seção ou link' : 'Open a section or link',
            exec: async (args) => {
                if (!args[0]) return `usage: open [section]`;
                const target = args[0].toLowerCase();
                const result = await handleNavigation(target);
                if (result === true) return "";
                if (typeof result === 'string') return result;

                if (COMMANDS[target] && target !== 'open') return COMMANDS[target].exec(args.slice(1));

                return `open: ${args[0]}: No such section or file`;
            }
        }
    };

    const AUTO_COMMANDS = ['help', 'neofetch', 'system', 'sudo -i', 'sudo -s', 'dev', 'sudo', 'exit', 'logout', 'clear', 'npm run sobre', 'npm run projetos', 'npm run habilidades', 'npm run contato', 'npm run experiencia', 'npm run formacao', 'npm run about', 'npm run projects', 'npm run skills', 'npm run contact', 'npm run experience', 'npm run education', 'npm run dev', 'reset', 'whoami', 'gui', 'lang pt', 'lang en', 'lang', 'omz', 'github', 'linkedin', 'open'];

    /* --- Navegação --- */
    async function handleNavigation(script) {
        const navMap = {
            'sobre': 'about', 'about': 'about',
            'habilidades': 'skills', 'skills': 'skills',
            'projetos': 'projects', 'projects': 'projects',
            'contato': 'contact', 'contact': 'contact',
            'experiencia': 'experience', 'experience': 'experience',
            'formacao': 'education', 'education': 'education'
        };

        const targetId = navMap[script];
        if (!targetId) return false;

        if (isAdmin && !isDevServerRunning) {
            return `<span class="text-red-400 font-bold">[ERROR] dev-server is not running.</span><br><span class="text-gray-500"># Please execute <span class="text-yellow-400">npm run dev</span> before running scripts in SuperUser mode.</span>`;
        }

        await printLine(`<span class="text-blue-400">Routing to ${script}...${isAdmin ? ' (Production Build)' : ''}</span>`);
        await new Promise(r => setTimeout(r, 500));
        unlockPortfolio(targetId, false);

        if (isAdmin && isDevServerRunning) {
            technicalProgress.add(targetId);
            checkGratitude();
        }
        return true;
    }

    /* --- Digitação --- */
    async function typeLines(lines, delay = 150) {
        for (let line of lines) {
            await new Promise(r => setTimeout(r, delay));
            const p = document.createElement('div');
            p.innerHTML = line;
            output.appendChild(p);
            scrollToBottom();
        }
        inputLine.classList.remove('hidden');
        inputField.focus();
        inputDisplay.innerHTML = '<span class="terminal-cursor"></span>';
        scrollToBottom();
    }

    /* --- Impressão --- */
    async function printLine(html, isCommand = false, delay = 0) {
        if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
        const p = document.createElement('div');
        p.className = "mt-1 terminal-line";
        p.innerHTML = html;
        output.appendChild(p);
        scrollToBottom();
        return p;
    }

    /* --- Impressão Múltipla --- */
    async function printLines(lines, stagger = 40) {
        for (const line of lines) {
            await printLine(line, false, stagger);
        }
    }

    /* --- Rolagem --- */
    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
        inputLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* --- Input Listener --- */
    inputField.addEventListener('input', (e) => {
        if (isWaitingForPassword) {

            const promptLabel = document.getElementById('prompt-label');
            if (promptLabel) {
                promptLabel.classList.add('animate-pulse');
            }
            inputDisplay.innerHTML = '<span class="terminal-cursor"></span>';
            return;
        }
        let val = e.target.value;
        const words = val.split(' ');
        const primaryCmd = words[0].toLowerCase();

        let displayHtml = '';
        if (val.length > 0) {
            const isValid = COMMANDS[primaryCmd] || AUTO_COMMANDS.includes(primaryCmd) || primaryCmd === 'npm' || primaryCmd === 'sudo';
            const cmdColor = isValid ? 'text-[#28C840]' : 'text-[#FF3B30]';

            if (words.length > 1) {
                displayHtml = `<span class="${cmdColor}">${words[0]}</span> <span class="text-white">${val.substring(words[0].length + 1)}</span>`;
            } else {
                displayHtml = `<span class="${cmdColor}">${val}</span>`;
            }
        }

        inputDisplay.innerHTML = displayHtml + '<span class="terminal-cursor"></span>';

        /* Autocomplete */
        if (val.trim().length > 0) {
            const inputLower = val.toLowerCase();
            const parts = inputLower.split(/\s+/);
            const cmd = parts[0];
            const argPrefix = parts.length > 1 ? parts.slice(1).join(' ') : '';

            let match = '';

            if ((cmd === 'open' || cmd === 'npm' || (cmd === 'npm' && parts[1] === 'run')) && parts.length >= 2) {
                const sections = ['sobre', 'habilidades', 'projetos', 'contato', 'experiencia', 'formacao', 'about', 'skills', 'projects', 'contact', 'experience', 'education', 'dev', 'legacy'];
                const subPrefix = (cmd === 'npm' && parts[1] === 'run') ? parts.slice(2).join(' ') : argPrefix;
                const base = (cmd === 'npm' && parts[1] === 'run') ? 'npm run ' : (cmd === 'open' ? 'open ' : cmd + ' ');

                const subMatch = sections.find(s => s.startsWith(subPrefix));
                if (subMatch && subMatch !== subPrefix) {
                    match = base + subMatch;
                }
            } else {
                match = AUTO_COMMANDS.find(c => c.startsWith(inputLower));
            }

            if (match && match !== inputLower) {
                currentSuggestion = match;
                terminalSuggestion.textContent = match.substring(val.length);
            } else {
                currentSuggestion = '';
                terminalSuggestion.textContent = '';
            }
        } else {
            currentSuggestion = '';
            terminalSuggestion.textContent = '';
        }

        scrollToBottom();
    });

    /* --- Prompt Update --- */
    function getPromptText() {
        const user = isAdmin ? 'root' : 'mateus';
        const userColor = isAdmin ? 'text-red-500' : 'text-indigo-400';
        const symbol = isAdmin ? '#' : '%';
        const homeDir = isAdmin ? '/var/root' : '/Users/mateus';
        const dirLabel = currentDir === homeDir ? '~' : currentDir;

        return `<span class="${userColor} font-semibold whitespace-nowrap">${user}@MacBook-Pro</span> <span class="text-gray-400 font-bold ml-1">${dirLabel} ${symbol}</span>`;
    }

    function updatePrompt() {
        const promptLabel = document.getElementById('prompt-label');
        if (promptLabel) {
            promptLabel.innerHTML = getPromptText();
        }
    }

    function showPrompt() {
        const promptLabel = document.getElementById('prompt-label');
        if (promptLabel) promptLabel.classList.remove('animate-pulse');
        updatePrompt();
        inputLine.classList.remove('hidden');
        inputField.disabled = false;
        inputField.focus();
        scrollToBottom();
    }

    /* --- Efeito Scramble --- */
    function scrambleText(element, finalValue, duration = 1000) {
        return new Promise((resolve) => {
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const rawText = finalValue.replace(/<[^>]*>/g, '');
            const iterations = 15;
            let count = 0;

            const interval = setInterval(() => {
                element.innerHTML = rawText.split('').map((char, index) => {
                    if (char === ' ') return ' ';
                    if (count > iterations) return finalValue;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');

                if (count > iterations) {
                    element.innerHTML = finalValue;
                    clearInterval(interval);
                    resolve();
                }
                count++;
            }, duration / iterations);
        });
    }

    /* --- Teclas --- */
    inputField.addEventListener('keydown', async (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
            if (inputField.value === '') {
                e.preventDefault();
                const range = document.createRange();
                range.selectNodeContents(output);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                return;
            }
        }

        if (e.key === 'Enter') {
            const val = inputField.value.trim().toLowerCase();
            inputField.value = '';
            inputDisplay.innerHTML = '<span class="terminal-cursor"></span>';

            const promptSnapshot = getPromptText();
            printLine(`${promptSnapshot} ${val}`);

            if (val === 'sw_vers -legacy') {
                inputField.disabled = true;
                inputLine.classList.add('hidden');
                setTimeout(() => {
                    window.location.href = 'docs/legacy.html?auth=mateus-legacy-unlocked-2020';
                }, 400);
                return;
            }

            if (!val) {
                showPrompt();
                return;
            }

            inputField.disabled = true;
            inputLine.classList.add('hidden');

            history.push(val);
            historyIdx = history.length;

            const parts = val.split(/\s+/);
            const primaryCmd = parts[0];
            const args = parts.slice(1);

            try {
                await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));

                if (COMMANDS[val] || COMMANDS[primaryCmd]) {
                    const cmdToExec = COMMANDS[val] ? COMMANDS[val] : COMMANDS[primaryCmd];
                    const result = await cmdToExec.exec(args);

                    if (result && Array.isArray(result)) {
                        await printLines(result);
                    } else if (result && typeof result === 'string') {
                        await printLine(result);
                    }

                    if (primaryCmd !== 'sudo') {
                        showPrompt();
                    }
                } else {
                    await printLine(`<span class="text-red-400">zsh: command not found: ${val}</span>`);

                    if (!isAdmin) {
                        const keywords = {
                            'sobre': 'about', 'mim': 'about',
                            'formacao': 'education', 'estudo': 'education',
                            'experiencia': 'experience', 'trabalho': 'experience',
                            'habilidades': 'skills', 'skill': 'skills',
                            'projetos': 'projects', 'projeto': 'projects',
                            'contato': 'contact', 'falar': 'contact'
                        };

                        let suggestion = '';
                        for (let key in keywords) {
                            if (val.includes(key)) {
                                suggestion = `Você quis dizer <span class="text-yellow-400">open ${keywords[key]}</span>?`;
                                break;
                            }
                        }
                        if (suggestion) await printLine(`<span class="text-gray-500"># ${suggestion}</span>`);
                        else await printLine(`<span class="text-gray-500"># Digite <span class="text-yellow-400">help</span> para ver os comandos disponíveis.</span>`);
                    }
                    showPrompt();
                }
            } catch (err) {
                console.error(err);
                await printLine(`<span class="text-red-500">zsh: internal error during execution</span>`);
                showPrompt();
            }
        }
        else if (e.key === 'Tab' || e.key === 'ArrowRight') {
            if (currentSuggestion) {
                e.preventDefault();
                inputField.value = currentSuggestion;
                inputField.dispatchEvent(new Event('input'));
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const val = inputField.value.toLowerCase();
                const matches = AUTO_COMMANDS.filter(cmd => cmd.startsWith(val));
                if (matches.length === 1) {
                    inputField.value = matches[0];
                    inputField.dispatchEvent(new Event('input'));
                }
            }
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIdx > 0) {
                historyIdx--;
                inputField.value = history[historyIdx];
                inputField.dispatchEvent(new Event('input'));
            }
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx < history.length - 1) {
                historyIdx++;
                inputField.value = history[historyIdx];
                inputField.dispatchEvent(new Event('input'));
            } else {
                historyIdx = history.length;
                inputField.value = '';
                inputField.dispatchEvent(new Event('input'));
            }
        }
    });

    document.getElementById('terminal-window').addEventListener('mousedown', (e) => {
        const startX = e.pageX;
        const startY = e.pageY;

        const onMouseUp = (upEvent) => {
            const diffX = Math.abs(upEvent.pageX - startX);
            const diffY = Math.abs(upEvent.pageY - startY);

            if (diffX < 5 && diffY < 5) {
                if (upEvent.target.tagName !== 'BUTTON' && !upEvent.target.closest('button') && !upEvent.target.closest('a')) {
                    inputField.focus();
                }
            }
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mouseup', onMouseUp);
    });

    const techRequired = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];
    let hasShownGratitude = false;

    /* --- Verificação de Conquista Final --- */
    function checkGratitude() {
        if (hasShownGratitude) return;
        if (!isAdmin || !isDevServerRunning) return;

        const allVisited = techRequired.every(m => technicalProgress.has(m));
        if (allVisited) {
            hasShownGratitude = true;

            setTimeout(() => {
                if (!isLocked) {
                    lockPortfolio();
                }

                setTimeout(() => {
                    const gratitudeData = {
                        pt: [
                            `<br><span class="text-red-500 font-bold">ACHIEVEMENT UNLOCKED: FULL SYSTEM DISCOVERY ACHIEVED</span>`,
                            `<span class="text-white leading-relaxed">kkkkkk Parabéns! Fico muito feliz que você explorou cada detalhe técnico e visual do meu portfólio e chegou até aqui.</span>`,
                            `<span class="text-white leading-relaxed">Como desenvolvedor, agradeço seu interesse na arquitetura e na minha trajetória. Vamos construir o futuro juntos!</span><br>`,
                            `<span class="text-white leading-relaxed italic">Se gostou da experiência e tiver qualquer ideia ou dica para melhorar este projeto, pode me avisar!</span><br>`,
                            `<span class="text-yellow-400 font-bold">BONUS UNLOCKED:</span> <span class="text-white">Protocolo de viagem no tempo ativado.</span>`,
                            `<span class="text-gray-500"># Use o comando <span class="text-yellow-400">npm run legacy</span> para ver como tudo começou (meu primeiro portfólio de 2020).</span><br>`,
                            `<span class="text-gray-500"># Deseja ver mais códigos? Visite meu perfil:</span>`,
                            `<a href="https://github.com/AllvesMatteus" target="_blank" class="text-cyan-400 underline hover:text-cyan-300 transition-colors font-bold">github.com/AllvesMatteus</a><br>`,
                            `<span class="text-red-500 font-bold">root@MacBook-Pro</span> <span class="text-gray-400 font-bold">~ #</span> <span class="text-white font-bold">echo "Obrigado por tudo! Ass: Mateus"</span><br>`
                        ],
                        en: [
                            `<br><span class="text-red-500 font-bold">ACHIEVEMENT UNLOCKED: FULL SYSTEM DISCOVERY ACHIEVED</span>`,
                            `<span class="text-white leading-relaxed">Haha! Congrats! I'm really glad you explored every technical and visual detail of my portfolio and made it all the way here.</span>`,
                            `<span class="text-white leading-relaxed">As a developer, I appreciate your interest in the architecture and my journey. Let's build the future together!</span><br>`,
                            `<span class="text-white leading-relaxed italic">If you enjoyed the experience and have any ideas or tips to improve this project, let me know!</span><br>`,
                            `<span class="text-yellow-400 font-bold">BONUS UNLOCKED:</span> <span class="text-white">Time travel protocol activated.</span>`,
                            `<span class="text-gray-500 font-bold">Use the command </span><span class="text-white font-bold">npm run legacy</span><span class="text-gray-500 font-bold"> to see where it all started (my first 2020 portfolio).</span><br>`,
                            `<span class="text-gray-400 font-bold">Want to see more code? Visit my profile:</span>`,
                            `<a href="https://github.com/AllvesMatteus" target="_blank" class="text-cyan-400 underline hover:text-cyan-300 transition-colors font-bold">github.com/AllvesMatteus</a><br>`,
                            `<span class="text-red-500 font-bold">root@MacBook-Pro</span> <span class="text-gray-400 font-bold">~ #</span> <span class="text-white font-bold">echo "Thanks for everything! - Mateus"</span><br>`
                        ]
                    };

                    gratitudeData[currentLang].forEach(line => printLine(line));
                    scrollToBottom();
                }, 800);
            }, 3000);
        }
    }

    /* --- Desbloqueio do Portfólio (TERMINAL -> GUI) --- */
    async function unlockPortfolio(targetId, showAll = false) {
        if (isLocked === false && !showAll && targetId === 'heroSection') return;

        const btnRect = returnBtn.getBoundingClientRect();

        animateToButton(false, () => {
            isLocked = false;
            splash.style.display = 'none';
        }, btnRect);

        visualContainer.style.display = 'block';
        visualContainer.classList.add('view-enter');
        void visualContainer.offsetWidth;

        visualContainer.classList.add('view-enter-active');
        visualContainer.classList.remove('view-enter');

        const sections = ['heroSection', 'about', 'education', 'experience', 'skills', 'projects', 'contact'];
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');

        if (showAll) {
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'block';
            });
            if (header) header.style.display = 'block';
            if (footer) footer.style.display = 'block';
        } else {
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = (id === targetId) ? 'block' : 'none';
            });
            if (header) header.style.display = 'none';
            if (footer) footer.style.display = 'none';
        }

        document.body.classList.remove('overflow-hidden');

        if (window.resetHeroVideo && (showAll || targetId === 'heroSection')) {
            window.resetHeroVideo();
        }


        if (!showAll && targetId) {
            const container = document.getElementById(targetId);
            if (container) {
                setTimeout(() => {
                    void container.offsetHeight;
                    if (window.triggerSectionAnimations) {
                        window.triggerSectionAnimations(targetId, false);
                    } else {
                        const revealElements = container.querySelectorAll('.reveal-on-scroll');
                        revealElements.forEach(el => {
                            el.classList.add('revealed');
                            el.style.opacity = '';
                            el.style.transform = '';
                        });
                    }
                }, 400);
            }
        }

        setTimeout(() => {
            visualContainer.classList.remove('view-enter-active');
            returnBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        }, 600);

        if (!showAll && targetId && targetId !== 'heroSection') {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }, 50);
        }
    }

    /* --- Bloqueio do Portfólio (GUI -> TERMINAL) --- */
    function lockPortfolio() {
        if (isLocked) return;

        const btnRectBeforeHide = returnBtn.getBoundingClientRect();
        isLocked = true;

        visualContainer.classList.add('view-exit-active');
        returnBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');

        setTimeout(() => {
            visualContainer.style.display = 'none';
            visualContainer.classList.remove('view-exit-active');

            splash.style.display = 'flex';
            splash.style.opacity = '0';
            void splash.offsetWidth;

            splash.style.transition = 'opacity 0.4s ease-out';
            splash.style.opacity = '1';
            splash.style.pointerEvents = 'auto';
            document.body.classList.add('overflow-hidden');

            if (termWindow) {
                animateToButton(true, () => {
                    if (!output.textContent.trim()) {
                        fullBootSequence().then(() => updatePrompt());
                    }
                    inputField.focus();
                }, btnRectBeforeHide);
            }
        }, 500);
    }

    skipBtn.addEventListener('click', () => {
        unlockPortfolio('heroSection', true);
    });

    /* Listeners de minimizar/fechar definidos abaixo junto dos controles de janela */

    returnBtn.addEventListener('click', lockPortfolio);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isLocked) {
                unlockPortfolio('heroSection', true);
            } else {
                lockPortfolio();
            }
        }
    });

    let initRetries = 0;

    /* --- Inicialização do Terminal --- */
    async function initTerminal() {
        try {
            if (typeof currentLang === 'undefined' || typeof TRANSLATIONS === 'undefined') {
                if (initRetries < 20) {
                    initRetries++;
                    setTimeout(initTerminal, 100);
                    return;
                }
                return;
            }

            if (!output) return;

            const fromLegacy = sessionStorage.getItem('fromLegacy') === 'true';
            if (fromLegacy) {
                sessionStorage.removeItem('fromLegacy');
            }

            const skipBoot = sessionStorage.getItem('skipBoot') === 'true';
            if (skipBoot && !fromLegacy) {
                sessionStorage.removeItem('skipBoot');
                output.innerHTML = '';
                await printLine(ASCII_LOGO, false, 0);
                inputLine.classList.remove('hidden');
                updatePrompt();
                inputField.focus();
                scrollToBottom();
                return;
            }

            await fullBootSequence();
            updatePrompt();
        } catch (err) {
            console.error('Terminal Fatal Error:', err);
        }
    }

    setTimeout(initTerminal, 100);

    const termWindow = document.getElementById('terminal-window');
    const termHeader = document.getElementById('terminal-header');

    let isDragging = false;
    let currentResizer = null;
    let isMaximized = false;
    let preMaxState = null;
    let startX, startY, startW, startH, startL, startT;

    /* --- Garantir Posicionamento Absoluto --- */
    function ensureAbsolutePosition() {
        if (termWindow.style.position !== 'absolute') {
            const rect = termWindow.getBoundingClientRect();
            termWindow.style.position = 'absolute';
            termWindow.style.left = rect.left + 'px';
            termWindow.style.top = rect.top + 'px';
            termWindow.style.width = rect.width + 'px';
            termWindow.style.height = rect.height + 'px';
            termWindow.style.margin = '0';
            termWindow.style.transform = 'none';
            termWindow.style.transition = 'none';
            if (terminalBody) terminalBody.style.height = 'auto';
        }
    }

    /* --- Animação de Abertura e Fechamento --- */
    function animateToButton(isOpening, onComplete, customBtnRect = null) {
        if (window.innerWidth < 640) {
            onComplete();
            return;
        }

        requestAnimationFrame(() => {
            const btnRect = customBtnRect || returnBtn.getBoundingClientRect();
            void termWindow.offsetWidth;
            const winRect = termWindow.getBoundingClientRect();

            const btnX = btnRect.left + btnRect.width / 2;
            const btnY = btnRect.top + btnRect.height / 2;

            const originX = ((btnX - winRect.left) / winRect.width) * 100;
            const originY = ((btnY - winRect.top) / winRect.height) * 100;

            termWindow.style.transformOrigin = `${originX}% ${originY}%`;

            if (!isOpening) {
                termWindow.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease-in, filter 0.4s ease';
                termWindow.style.transform = 'scale(0.05) translateY(100px) rotate(-2deg)';
                termWindow.style.opacity = '0';
                termWindow.style.filter = 'blur(15px)';
                setTimeout(onComplete, 600);
            } else {
                termWindow.style.transition = 'none';
                termWindow.style.transform = 'scale(0.05) translateY(100px) rotate(-2deg)';
                termWindow.style.opacity = '0';
                termWindow.style.filter = 'blur(15px)';

                void termWindow.offsetWidth;

                termWindow.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease-out, filter 0.4s ease';
                termWindow.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                termWindow.style.opacity = '1';
                termWindow.style.filter = 'none';
                setTimeout(onComplete, 700);
            }
        });
    }

    /* --- Alternar Maximização da Janela --- */
    function toggleMaximize() {
        if (window.innerWidth < 640) return;

        termWindow.style.transition = 'all 0.5s cubic-bezier(0.2, 1, 0.2, 1)';

        if (!isMaximized) {
            preMaxState = {
                left: termWindow.style.left,
                top: termWindow.style.top,
                width: termWindow.style.width,
                height: termWindow.style.height,
                position: termWindow.style.position,
                transform: termWindow.style.transform,
                margin: termWindow.style.margin
            };

            termWindow.style.position = 'fixed';
            termWindow.style.left = '10px';
            termWindow.style.top = '10px';
            termWindow.style.width = 'calc(100vw - 20px)';
            termWindow.style.height = 'calc(100vh - 20px)';
            termWindow.style.margin = '0';
            termWindow.style.transform = 'none';
            isMaximized = true;
        } else {
            if (preMaxState) {
                termWindow.style.left = preMaxState.left;
                termWindow.style.top = preMaxState.top;
                termWindow.style.width = preMaxState.width;
                termWindow.style.height = preMaxState.height;
                termWindow.style.position = preMaxState.position;
                termWindow.style.transform = preMaxState.transform;
                termWindow.style.margin = preMaxState.margin;
            } else {
                termWindow.style.position = 'relative';
                termWindow.style.width = '100%';
                termWindow.style.height = 'auto';
                termWindow.style.left = 'auto';
                termWindow.style.top = 'auto';
            }
            isMaximized = false;
        }

        setTimeout(() => {
            if (!isDragging && !currentResizer) termWindow.style.transition = 'none';
        }, 450);
    }

    document.getElementById('term-max').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMaximize();
    });

    /* --- Botão Amarelo: minimiza sem resetar --- */
    document.getElementById('term-min').addEventListener('click', (e) => {
        e.stopPropagation();
        animateToButton(false, () => unlockPortfolio('heroSection', true));
    });

    /* --- Botão Vermelho: fecha e reseta o terminal --- */
    document.getElementById('term-close').addEventListener('click', (e) => {
        e.stopPropagation();

        /* Reset imediato de estado antes de fechar */
        isAdmin = false;
        isDevServerRunning = false;
        hasShownGratitude = false;
        technicalProgress.clear();
        currentDir = '/Users/mateus';
        const titleEl = document.querySelector('[data-i18n="terminal_title"]');
        if (titleEl) {
            titleEl.innerHTML = currentLang === 'pt' ? 'mateus — portifólio' : 'mateus — portfolio';
        }
        output.innerHTML = '';
        inputLine.classList.add('hidden');
        updatePrompt();

        animateToButton(false, () => unlockPortfolio('heroSection', true));
    });

    /* --- Controles de Arrastar e Redimensionar --- */
    termHeader.addEventListener('dblclick', (e) => {
        if (window.innerWidth < 640) return;
        if (e.target.closest('button') || e.target.closest('a')) return;
        toggleMaximize();
    });

    termHeader.addEventListener('mousedown', (e) => {
        if (window.innerWidth < 640 || isMaximized) return;
        if (e.target.closest('button') || e.target.closest('a')) return;

        ensureAbsolutePosition();
        isDragging = true;
        startX = e.clientX - termWindow.offsetLeft;
        startY = e.clientY - termWindow.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
        e.stopPropagation();
    });

    document.querySelectorAll('.resizer').forEach(resizer => {
        resizer.addEventListener('mousedown', (e) => {
            if (window.innerWidth < 640 || isMaximized) return;

            ensureAbsolutePosition();
            currentResizer = resizer;
            startX = e.clientX;
            startY = e.clientY;
            startW = termWindow.offsetWidth;
            startH = termWindow.offsetHeight;
            startL = termWindow.offsetLeft;
            startT = termWindow.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
            e.stopPropagation();
        });
    });

    function onMouseMove(e) {
        if (isDragging) {
            termWindow.style.left = (e.clientX - startX) + 'px';
            termWindow.style.top = (e.clientY - startY) + 'px';
        } else if (currentResizer) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (currentResizer.classList.contains('resizer-r')) {
                termWindow.style.width = (startW + dx) + 'px';
            } else if (currentResizer.classList.contains('resizer-l')) {
                termWindow.style.width = (startW - dx) + 'px';
                termWindow.style.left = (startL + dx) + 'px';
            } else if (currentResizer.classList.contains('resizer-b')) {
                termWindow.style.height = (startH + dy) + 'px';
            } else if (currentResizer.classList.contains('resizer-t')) {
                termWindow.style.height = (startH - dy) + 'px';
                termWindow.style.top = (startT + dy) + 'px';
            } else if (currentResizer.classList.contains('resizer-rb')) {
                termWindow.style.width = (startW + dx) + 'px';
                termWindow.style.height = (startH + dy) + 'px';
            } else if (currentResizer.classList.contains('resizer-lb')) {
                termWindow.style.width = (startW - dx) + 'px';
                termWindow.style.left = (startL + dx) + 'px';
                termWindow.style.height = (startH + dy) + 'px';
            } else if (currentResizer.classList.contains('resizer-rt')) {
                termWindow.style.width = (startW + dx) + 'px';
                termWindow.style.height = (startH - dy) + 'px';
                termWindow.style.top = (startT + dy) + 'px';
            } else if (currentResizer.classList.contains('resizer-lt')) {
                termWindow.style.width = (startW - dx) + 'px';
                termWindow.style.left = (startL + dx) + 'px';
                termWindow.style.height = (startH - dy) + 'px';
                termWindow.style.top = (startT + dy) + 'px';
            }

            if (parseInt(termWindow.style.width) < 640) termWindow.style.width = '640px';
            if (parseInt(termWindow.style.height) < 530) termWindow.style.height = '530px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        currentResizer = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    /* --- Interceptador Global de Links --- */
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.hash && !link.target && link.hash.startsWith('#')) {
            const targetId = link.hash.substring(1);
            const navMap = {
                'about': 'about', 'sobre': 'about',
                'skills': 'skills', 'habilidades': 'skills',
                'projects': 'projects', 'projetos': 'projects',
                'contact': 'contact', 'contato': 'contact',
                'experience': 'experience', 'experiencia': 'experience',
                'education': 'education', 'formacao': 'education',
                'heroSection': 'heroSection'
            };

            if (navMap[targetId] || targetId === 'contact') {
                const finalTarget = navMap[targetId] || targetId;
                const splash = document.getElementById('terminal-splash');
                const isTerminalVisible = splash && !splash.classList.contains('hidden');

                if (isTerminalVisible) {
                    e.preventDefault();
                    unlockPortfolio(finalTarget, false);
                    inputField.focus();
                }
            }
        }
    });
});
