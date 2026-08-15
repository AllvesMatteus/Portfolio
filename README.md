# MacOS-Web — by Mateus PC 🍎

> Experiência macOS reconstruída para a web moderna. Um ambiente desktop fiel, altamente interativo e responsivo nativo do navegador.

## Features

- 🪟 **Draggable & Resizable Windows** — Gerenciador de janelas com dimensões e proporções nativas do macOS.
- 🚢 **Dock with Gaussian Spring Magnification** — Barra Dock fluida com efeito de magnificação e marcadores de status.
- 🎛️ **Pixel-Perfect Control Center** — Central de Controle completa com sliders de brilho e som, modo Foco, Organizador Visual e Espelhamento de Tela.
- 🖱️ **Multi-Level Context Menu Engine** — Menu de contexto nativo com submenus em múltiplos níveis (Agrupar conjuntos, Importar do iPhone), suporte a seleções (`✓`), atalhos e animações fluidas.
- 🗂️ **Finder** — Gerenciador de arquivos completo com visualizações em grade, barra de navegação superior e barra de caminho inferior.
- 🧭 **Safari** — Navegador com barra de endereços unificada e navegação integrada.
- ⚙️ **Settings** — Ajustes do sistema com seletor de papéis de parede e preferências.
- 🖥️ **Terminal** — Emulador de comandos completo com suporte a ANSI colors, neofetch, efeito matrix e comandos git.
- 🌓 **Dark / Light Theme & Translucency** — Transparência sutil de 3% (*97% opacidade*) com efeito *frosted glass* (`backdrop-filter`) para contraste impecável em Dark Mode.

## How to run

### Option 1: GitHub Pages (recommended)
Push to a GitHub repo and enable GitHub Pages in Settings → Pages → main branch.

### Option 2: Local development server
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

> **Note:** ES modules require an HTTP server. Opening `index.html` directly via `file://` will not work due to browser security restrictions (CORS).

### Option 3: Start server (Windows)
Double-click `start-server.bat` and open `http://localhost:8080`.

## Project Structure

```
macweb.dev/
├── index.html          # Main HTML entry point
├── manifest.json       # PWA manifest
├── start-server.bat    # Windows quick-start server
├── css/
│   ├── main.css        # Main SCSS compiled styles
│   └── patch.css       # Pixel-perfect design system & override styles
├── js/
│   ├── app.js          # Entry point & boot sequence
│   ├── windowManager.js # Window lifecycle & placement engine
│   ├── themeManager.js # Dark/Light theme manager
│   ├── menubar.js      # Menubar & Control Center manager
│   ├── dock.js         # Dock magnification & indicator manager
│   ├── desktop.js      # Desktop icons & context menu trigger
│   ├── contextMenu.js  # Multi-level nested context menu engine
│   └── apps/
│       ├── finder.js
│       ├── safari.js
│       ├── notes.js
│       ├── music.js
│       ├── calendar.js
│       ├── calculator.js
│       ├── terminal.js
│       └── settings.js
└── assets/
    ├── docs/
    ├── icons/
    └── favicons/
```

## License

MIT — Original project by [@gaminghackintosh](https://github.com/gaminghackintosh) | Customized and enhanced by [@AllvesMatteus](https://github.com/AllvesMatteus)
