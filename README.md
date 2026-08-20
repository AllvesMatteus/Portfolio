# Mateus OS — Portfólio Desktop

Um ambiente desktop interativo executado no navegador, unificando a experiência inspirada no macOS com o Portfólio de Engenharia de Software de Mateus Alves. Construído em HTML5 puro, CSS3 e Módulos JavaScript ES6 sem frameworks pesados.

---

## Visão Geral Técnica

**Mateus OS** é uma aplicação web que combina o ambiente de trabalho estilo macOS com o portfólio profissional de Mateus Alves, oferecendo navegação por terminal zsh, suporte a comandos e integração direta com aplicações nativas (Safari, Finder, Terminal, Ajustes e Lixo).

---

## Core System Modules

### Safari Web Browser Engine
- **Modular Architecture**: Built around an object-oriented `SafariEngine` class managing session state, history stack navigation (Back, Forward, Reload), and dynamic iframe content rendering.
- **Web Navigation & Search**: Native support for Google Search parameter embedding (`igu=1`) and cross-origin website proxying via CORS proxy endpoints.
- **Authentic Start Page (Nova Aba)**: Replicates the macOS Safari Start Page with a customizable Favorites grid (Portfólio, LinkedIn, GitHub, WhatsApp) and iCloud Tabs integration.
- **High-Resolution Favicon Resolver**: Multi-tier asynchronous favicon pipeline utilizing the Favicone API (`128px`) with fallbacks to Google Favicons CDN and system vector icons.
- **Dynamic Theme Color Blending**: Automatic theme color management switching window background colors (`#22242A` for Google, `#28282b` for standard pages) and dynamically toggling the bottom toolbar separator line (`border-bottom`).
- **Interactive Toolbar Controls**: Integrated Clipboard API for URL copying, automatic URL input placeholder clearing upon focus, and custom SF Symbol button hover states.

### Finder & Lixo (Trash) Application
- **Explorador de Arquivos com VFS**: Navegação hierárquica por pastas (Documentos, Downloads, Imagens, Developer e Lixo) com suporte a visualização em Grade e Lista.
- **Seleção Nativa Fiel ao macOS**: Seleção por clique com destaque azul clássico (`#0063e1`) nos rótulos e moldura translúcida suave nos ícones, com desmarcação em área vazia e ausência de efeitos de hover.
- **Quick Look Integrado**: Pré-visualização instantânea de imagens em modal nativo ao realizar duplo clique em fotos (`Captura de Tela`).
- **Janela e Ações do Lixo**: Visual dedicado com barra de subcabeçalho, botão de esvaziamento, diálogo nativo de confirmação (`showMacAlert`) e notificações de conclusão.
- **Barra de Caminho Dinâmica (Pathbar)**: Rastreamento em tempo real do diretório ativo com navegação rápida por clique e ícones nativos.

### Window Management Engine
- **Z-Index Layering**: Dynamic depth management with automatic focus elevation (`windowManager.js`).
- **Drag & Resize**: High-frequency mouse and touch event handling for real-time window bounds computation.
- **Controles de Semáforo Dinâmicos**: Botões de fechar, minimizar e expandir calibrados para cada aplicação individual, incluindo instâncias especializadas como a Lixeira.
- **Input Focus Protection**: Drag handler filtering that excludes interactive elements (`<input>`, `<textarea>`, `<button>`) from window drag events to prevent input focus loss and window flashing.
- **Calibrated Default Aspect Ratios**: Initial window bounds optimized for standard desktop viewports (Safari: 1040x680px, Finder: 960x620px).

### Sistema de Notificações macOS
- **Layout Nativo**: Estrutura com ícone do aplicativo, linha superior contendo Título e Horário (`Agora`), e corpo com a mensagem explicativa sem redundâncias.
- **Interatividade na Menubar**: Disparo de notificações de status ao clicar em Bateria, Wi-Fi, Bluetooth, Siri e Spotlight.
- **Gestos de Descarte**: Suporte a arraste lateral (swipe-to-dismiss) e auto-fechamento com pausa ao posicionar o cursor sobre o banner.

### Desktop Widgets Engine
- **Live Location Weather Engine**: Integrated 5-tier location resolution engine (GeoJS, IP-API, ipapi.co, HTML5 Geolocation + BigDataCloud reverse geocode, System Timezone fallback) paired with the Open-Meteo API for live weather conditions and 6-hour hourly forecasts.
- **Mathematical Calendar Grid**: Real-time Portuguese calendar grid with 6-row mathematical overflow protection and a centered active day ring (`#ff3b30`).
- **Battery Gauge**: SVG circular progress gauge rendering real-time battery status and status icons.

### Control Center & Navigation Bar
- **Symmetrical 1:1 Control Center**: Precise 1:1 square grid layout (`142px x 142px`) for Connectivity and Utilities cards.
- **Interactive System Sliders**: Custom input sliders for System Volume and Display Brightness.
- **Top Menubar**: Dynamic clock, status indicators, active application title, and contextual dropdown menus.

### Multi-Level Context Menu System
- **Nested Submenus**: Support for hierarchical multi-level context menus with automatic viewport overflow correction (`contextMenu.js`).
- **State Indicators**: Rendered checkmarks, item headers, disabled states, and active blue parent item highlighting (`#0a84ff`).

### Dock Component
- **Spring Physics Magnification**: Smooth icon scaling based on cursor distance calculations.
- **Active Indicators**: Status indicators (bolinhas luminosas) para todas as aplicações em execução e minimizadas.
- **Tooltips Pixel-Perfect**: Balões de dica com tipografia San Francisco, desfoque de fundo e contorno escuro nativo do macOS.

### Terminal Engine (MateusOS)
- **Modo de Operação e Privilégios Dual-Stage**: Divisão de permissões entre o Modo Normal (`mateus@MacBook-Pro ~ %`) para visitantes comuns e o Modo Engenharia/Administrador (`root@MacBook-Pro ~ #`) desbloqueado via `sudo -i` com a lecture de segurança nativa da Apple e preenchimento de senha automatizado.
- **Sistema de Arquivos Virtual (VFS)**: Estrutura simulada contendo caminhos de sistema `/Users/mateus` e diretórios protegidos `/var/root` / `/etc`. Permite a leitura em tempo real de arquivos virtuais `.md` e arquivos de sistema (como `/etc/hosts` e chaves SSH públicas).
- **Comandos BSD Nativos**: Suporte completo a utilitários de shell:
  - `ls`: Listagem avançada aceitando flags BSD (`-l`, `-a`, `-la`) com permissões detalhadas, proprietários, tamanhos e data de criação.
  - `man` / `man intro`: Visualizador de manual interativo estilo `less` (alternate screen buffer), permitindo fechamento e limpeza de buffer de tela com a tecla `q`.
  - `pbcopy`: Integração assíncrona com a Clipboard API do navegador para copiar dados reais de contato.
  - `open`: Suporta abertura de arquivos com extensões (ex: `open about.md` abrindo seções da GUI), abertura de Finder (`open .`) e tratamento inteligente de redirecionamento de links externos (WhatsApp, LinkedIn) em novas abas reais fora do SO.
  - `sw_vers`, `uname -a`, `date`, `uptime`, `whoami` (com flag `--verbose`).
- **Ferramentas Root Avançadas**: Desbloqueio de comandos como `git log` (histórico real de commits), `system_profiler` (especificações de hardware), `defaults write` (alteração de tema claro/escuro em tempo real no DOM) e serviços bloqueantes como `caffeinate` e `tail -f system.log` com streaming de logs em tempo real canceláveis via `Ctrl + C`.

---

## Project Structure

```
MacOS-Web/
├── index.html          # Main HTML entry point
├── manifest.json       # PWA manifest
├── start-server.bat    # Windows quick-start server launcher
└── assets/
    ├── css/
    │   ├── main.css        # Main compiled stylesheet
    │   └── patch.css       # Pixel-perfect design system & override styles
    ├── js/
    │   ├── app.js          # Main entry point & boot sequence
    │   ├── windowManager.js # Window lifecycle & placement engine
    │   ├── themeManager.js # Dark/Light theme manager
    │   ├── menubar.js      # Menubar & Control Center manager
    │   ├── dock.js         # Dock magnification & status indicators
    │   ├── desktop.js      # Desktop icons & position engine
    │   ├── widgets.js      # Desktop widgets engine (Calendar, Battery, Weather)
    │   ├── contextMenu.js  # Multi-level nested context menu engine
    │   ├── sfSymbols.js    # SF Symbols rendering helper
    │   └── apps/
    │       ├── finder.js
    │       ├── safari.js
    │       ├── terminal.js
    │       └── settings.js
    ├── docs/
    │   └── mateus-desenvolvedor-fullstack.pdf
    ├── images/
    │   ├── user_photos/
    │   └── wallpapers/
    ├── icons/
    └── favicons/
```

---

## Environment Setup & Execution

### Local HTTP Server Requirement
Due to browser security restrictions regarding ES6 Module imports (`import`/`export`), `index.html` must be served via an HTTP server.

#### Python 3 HTTP Server
```bash
python -m http.server 8080
```

#### Node.js Server (npx)
```bash
npx serve .
```

#### Windows Launcher
Execute `start-server.bat` by double-clicking or launching via PowerShell:
```cmd
start-server.bat
```

Access the application in any modern web browser at `http://localhost:8080`.

---

## Deployment

The project is fully compatible with static web hosting services such as GitHub Pages, Vercel, and Netlify.

---

## Browser Compatibility

- Google Chrome / Chromium (v90+)
- Mozilla Firefox (v88+)
- Apple Safari (v14+)
- Microsoft Edge (v90+)

---

## License & Credits

- **Original Concept**: [@gaminghackintosh](https://github.com/gaminghackintosh)
- **Maintainer & Developer**: [@AllvesMatteus](https://github.com/AllvesMatteus)
- **License**: MIT License
