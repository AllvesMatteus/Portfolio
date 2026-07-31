# macweb.dev 🍎

> macOS, rebuilt for the modern web. A browser-native macOS desktop environment.

## Features

- 🪟 Draggable & resizable windows
- 🚢 Dock with Gaussian spring magnification
- 🌓 Dark / Light theme toggle
- 🖥 Menu bar with live clock, dropdowns & Control Center
- 🗂 **Finder** — file manager with list/grid views and preview panel
- 🧭 **Safari** — browser with URL bar
- 📒 **Notes** — rich text editor with localStorage persistence
- 🎵 **Music** — Apple Music-style player
- 📅 **Calendar** — interactive monthly calendar
- 🧮 **Calculator** — fully functional with keyboard support
- 🖥 **Terminal** — full command emulator with ANSI colors, git log, neofetch, matrix effect
- ⚙️ **Settings** — System Preferences with wallpaper picker

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

## Structure

```
macweb.dev/
├── index.html          # Main HTML entry point
├── manifest.json       # PWA manifest
├── start-server.bat    # Windows quick-start server
├── css/
│   ├── main.css        # Compiled SCSS (all styles)
│   └── patch.css       # Override/fix styles
├── js/
│   ├── app.js          # Entry point & boot sequence
│   ├── windowManager.js
│   ├── themeManager.js
│   ├── menubar.js
│   ├── dock.js
│   ├── desktop.js
│   ├── contextMenu.js
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
    ├── icons/
    │   ├── apps/
    │   └── menuBar/
    ├── images/
    │   └── wallpapers/
    └── favicons/
```

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files from this folder
3. Go to **Settings → Pages → Source** → select `main` branch
4. Your site will be live at `https://yourusername.github.io/your-repo/`

## License

MIT — Original project by [@gaminghackintosh](https://github.com/gaminghackintosh)
