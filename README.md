# macOS Web

A browser-native desktop environment inspired by Apple macOS Sonoma & Sequoia, built with vanilla HTML5, CSS3, and ES6 JavaScript Modules without external framework overhead.

---

## Technical Overview

**macOS Web** is an open-source web application designed to replicate the macOS user experience with pixel-perfect visual fidelity, high-performance animations, fluid window management, and native-feeling desktop interactions. The project leverages modern Web APIs, CSS Backdrop Filters, and ES6 modular software architecture.

---

## Core System Modules

### Safari Web Browser Engine
- **Modular Architecture**: Built around an object-oriented `SafariEngine` class managing session state, history stack navigation (Back, Forward, Reload), and dynamic iframe content rendering.
- **Web Navigation & Search**: Native support for Google Search parameter embedding (`igu=1`) and cross-origin website proxying via CORS proxy endpoints.
- **Authentic Start Page (Nova Aba)**: Replicates the macOS Safari Start Page with a customizable Favorites grid (Portfólio, LinkedIn, GitHub, WhatsApp) and iCloud Tabs integration.
- **High-Resolution Favicon Resolver**: Multi-tier asynchronous favicon pipeline utilizing the Favicone API (`128px`) with fallbacks to Google Favicons CDN and system vector icons.
- **Dynamic Theme Color Blending**: Automatic theme color management switching window background colors (`#22242A` for Google, `#28282b` for standard pages) and dynamically toggling the bottom toolbar separator line (`border-bottom`).
- **Interactive Toolbar Controls**: Integrated Clipboard API for URL copying, automatic URL input placeholder clearing upon focus, and custom SF Symbol button hover states.

### Window Management Engine
- **Z-Index Layering**: Dynamic depth management with automatic focus elevation (`windowManager.js`).
- **Drag & Resize**: High-frequency mouse and touch event handling for real-time window bounds computation.
- **Input Focus Protection**: Drag handler filtering that excludes interactive elements (`<input>`, `<textarea>`, `<button>`) from window drag events to prevent input focus loss and window flashing.
- **Calibrated Default Aspect Ratios**: Initial window bounds optimized for standard desktop viewports (Safari: 1040x680px, Finder: 960x620px).

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
- **Active Indicators**: Status indicators for open and minimized applications.

---

## Project Structure

```
MacOS-Web/
├── index.html          # Main HTML entry point
├── manifest.json       # PWA manifest
├── start-server.bat    # Windows quick-start server launcher
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
│       ├── settings.js
│       ├── notes.js
│       ├── music.js
│       ├── calendar.js
│       └── calculator.js
└── assets/
    ├── docs/
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
