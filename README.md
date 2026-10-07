<p align="center">
  <img src="assets/favicons/logo.png" alt="Mateus OS Logo" width="120" height="120" style="border-radius: 24px;" />
</p>

<h1 align="center">Mateus OS</h1>

<p align="center">
  <b>Ambiente Desktop Interativo Inspirado no macOS e Portfólio de Engenharia de Software</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-Modular_Architecture-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/HTML5-Semântico-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Design-macOS_Pixel--Perfect-000000?style=for-the-badge&logo=apple&logoColor=white" alt="macOS" />
  <img src="https://img.shields.io/badge/Terminal-ZSH_Dual--Stage-5856D6?style=for-the-badge&logo=gnubash&logoColor=white" alt="ZSH Terminal" />
  <img src="https://img.shields.io/badge/VFS-Virtual_File_System-3FCF8E?style=for-the-badge&logo=files&logoColor=white" alt="VFS" />
</p>

---

## 📌 Sobre o Projeto

O **Mateus OS** é um ambiente desktop web interativo de alta fidelidade inspirado no macOS Sequoia e Tahoe, unificando a estética visual da Apple com o portfólio profissional de engenharia de software de Mateus Alves. Construído 100% em tecnologias web nativas (**HTML5**, **CSS3 modular** e **JavaScript ES6 Modules** sem a necessidade de frameworks volumosos), o projeto oferece uma experiência de sistema operacional completa executada diretamente no navegador — incluindo janelas multitarefa reais com elevação dinâmica de foco, virtual file system, terminal ZSH com emulação de privilégios, navegador Safari integrado e widgets dinâmicos.

---

## ✨ Principais Funcionalidades

### 🧭 Safari Web Browser Engine
- **Arquitetura OOP (`SafariEngine`):** Gerenciamento completo de sessão, pilha de histórico de navegação (Voltar, Avançar, Recarregar) e renderização assíncrona em iframe.
- **Página Inicial Autêntica:** Réplica fiel da Start Page da Apple com favoritos em grade (Portfólio, LinkedIn, GitHub, WhatsApp) e abas sincronizadas.
- **Resolução Multi-Tier de Favicons:** Pipeline dinâmico consumindo a API Favicone (128px), Google Favicons CDN e fallbacks vetoriais do sistema.
- **Dynamic Theme Blending:** Harmonização automática de cores de fundo da janela e bordas divisórias de acordo com o domínio acessado.
- **Controles Integrados:** Suporte à Clipboard API para cópia de links e higienização automática de URLs com suporte a proxy CORS.

### 📂 Finder & Lixeira (VFS)
- **Virtual File System (VFS):** Estrutura hierárquica em memória com suporte a navegação por pastas em modo Grade (*Grid*) e Lista (*List*).
- **Seleção Nativa da Apple:** Destaque azul clássico (`#0063e1`) nos rótulos de itens e moldura translúcida suave nos ícones, sem hover indesejado.
- **Quick Look Integrado:** Pré-visualização instantânea em modal nativo ao realizar clique duplo em fotos e capturas de tela.
- **Barra de Caminho Dinâmica (Pathbar):** Rastreamento de diretório ativo em tempo real com navegação rápida com um clique.
- **Janela e Ações da Lixeira:** Interface dedicada com confirmações nativas de esvaziamento (`showMacAlert`) e notificações de conclusão.

### 🪟 Gerenciador de Janelas & Multitarefa
- **Z-Index Layering Dinâmico:** Gerenciamento de profundidade em tempo real com elevação automática de foco da janela ativa (`windowManager.js`).
- **Arrasto e Redimensionamento Fluido:** Processamento de eventos de ponteiro de alta frequência com cálculo instantâneo de limites da viewport.
- **Semáforos Nativos Calibrados:** Botões de fechar, minimizar e expandir parametrizados individualmente para cada aplicação.
- **Proteção de Foco em Elementos Interativos:** Filtro no manipulador de arrasto prevenindo perda de foco e jitter em `<input>`, `<textarea>` e botões.
- **Proporções Otimizadas:** Dimensões iniciais calibradas para proporções desktop autênticas (Safari: 1040x680px, Finder: 960x620px).

### ⚡ Terminal ZSH Dual-Stage (MateusOS)
- **Modo Visitante Padrão (`mateus@MacBook-Pro ~ %`):** Ambiente seguro para visitantes com comandos de navegação (`open`, `cat`, `ls -la`, `pwd`, `whoami`, `pbcopy`, `clear`, `man`, `date`, `uptime`, `sw_vers`, `uname -a`).
- **Modo Root de Engenharia (`root@MacBook-Pro ~ #`):** Elevação de privilégios via `sudo -i`, com o aviso oficial *Sudo Lecture* da Apple e senha oculta, liberando utilitários avançados de desenvolvedor.
- **Comandos BSD Nativos:** Utilitários de linha de comando com suporte a flags BSD, leitura de arquivos do VFS e integração com a Clipboard API (`pbcopy`).
- **Ferramentas de Engenharia Desbloqueadas:** Comandos de hardware e sistema como `system_profiler`, `defaults`, `caffeinate`, `git log` e streaming contínuo de logs com `tail -f`.

### ⚙️ Central de Controle & Desktop Widgets
- **Central de Controle 1:1:** Layout em grid simétrico (`142px x 142px`) para controles de conectividade e utilitários.
- **Sliders Nativos do Sistema:** Controles deslizantes customizados para Volume do Sistema e Brilho da Tela.
- **Live Weather Engine:** Resolução de localização com 5 camadas de fallback integrada à API do Open-Meteo com condições e previsões em tempo real.
- **Calendário Matemático:** Grade mensal com proteção de transbordamento de 6 linhas e anel indicador do dia ativo (`#ff3b30`).
- **Indicador de Bateria em SVG:** Gauge circular vetorial com renderização de percentual e estado de carga ao vivo.

### ⚓ Dock & Design System Nativo
- **Física de Molas (Spring Magnification):** Ampliação contínua e suave baseada na distância euclidiana do ponteiro do mouse.
- **Indicadores de Status:** Marcadores luminosos inferiores indicando aplicativos em execução e minimizados.
- **Tooltips com Efeito Vidro:** Balões flutuantes com tipografia San Francisco e desfoque translúcido (*backdrop-filter*).
- **SF Symbols Vetoriais:** Suíte de ícones vetoriais otimizados renderizados dinamicamente via `sfSymbols.js`.

### 🔔 Notificações & Áudio do Sistema
- **Layout Fiel ao macOS:** Estrutura nativa com ícone do app, cabeçalho de horário relativo (`Agora`) e corpo descritivo.
- **Interatividade via Menubar:** Notificações de status ao clicar em Bateria, Wi-Fi, Bluetooth e Siri.
- **Gestos de Descarte:** Suporte a arraste lateral (*swipe-to-dismiss*) e pausa de temporizador sob hover.

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologias |
|---|---|
| **Frontend Core** | HTML5 Semântico, JavaScript ES6+ (Native Modules, sem bundlers) |
| **Estilização & UI** | CSS3 Modular (Variables, Keyframes, Backdrop-Filter, Glassmorphism) |
| **Tipografia & Ícones** | SF Symbols Vetoriais, San Francisco Typography, Favicone API |
| **Serviços & APIs** | Open-Meteo API, BigDataCloud Reverse Geocoding, IP Geolocation |
| **Armazenamento & VFS** | In-Memory Virtual File System (VFS), LocalStorage |
| **Deploy & Hosting** | GitHub Pages, Vercel, Netlify |

---

## 📂 Estrutura de Pastas

```
MacOS-Web/
├── assets/
│   ├── css/                      # Arquitetura modular CSS3
│   │   ├── base/                 # Tokens globais, variáveis e animações
│   │   ├── system/               # Componentes do ecossistema macOS
│   │   ├── apps/                 # Folhas de estilo dedicadas por aplicativo
│   │   ├── portfolio/            # Estilos específicos do portfólio mobile
│   │   └── main.css              # Importador central de estilos
│   ├── js/                       # Lógica em módulos nativos ES6
│   │   ├── apps/                 # Controladores de aplicação (finder, safari, terminal, settings)
│   │   ├── windowManager.js      # Gerenciador de ciclo de vida e z-index de janelas
│   │   ├── themeManager.js       # Alternador de tema Claro / Escuro
│   │   ├── menubar.js            # Menubar superior e Central de Controle
│   │   ├── dock.js               # Física de magnificação e estado do Dock
│   │   ├── desktop.js            # Mesa, ícones e seleção
│   │   ├── widgets.js            # Widgets dinâmicos (Clima, Calendário, Bateria)
│   │   ├── contextMenu.js        # Menus de contexto multinível
│   │   ├── sfSymbols.js          # Renderizador de símbolos vetoriais
│   │   └── app.js                # Bootstrap e inicialização do sistema
│   ├── docs/                     # Documentações e currículo em PDF
│   ├── favicons/                 # Logotipos, ícones web e manifest
│   ├── icons/                    # Ícones de sistema, dock e menus
│   ├── images/                   # Wallpapers dinâmicos, fotos e logos
│   └── portfolio.html            # Experiência responsiva para dispositivos móveis
├── comandos.md                   # Manual técnico e especificação do terminal ZSH
├── index.html                    # Ponto de entrada do sistema operacional web
├── manifest.json                 # Manifesto PWA da aplicação
└── start-server.bat              # Launcher rápido de 1 clique para Windows
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Um navegador moderno (**Google Chrome**, **Microsoft Edge**, **Apple Safari** ou **Mozilla Firefox**)
- Um servidor HTTP local (necessário para atender às políticas de segurança de módulos ES6 `import`/`export`)

### 1. Clonar o Repositório
```bash
git clone https://github.com/AllvesMatteus/MacOS-Web.git
cd MacOS-Web
```

### 2. Iniciar o Servidor Local
Você pode iniciar o servidor utilizando qualquer um dos métodos abaixo:

#### Opção A — Windows (1 Clique)
Execute o arquivo batch incluído na raiz do projeto:
```cmd
start-server.bat
```

#### Opção B — Python 3
```bash
python -m http.server 8080
```

#### Opção C — Node.js (npx)
```bash
npx serve .
```

#### Opção D — Extensão Live Server (VS Code)
Abra a pasta no VS Code, clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

### 3. Acessar a Aplicação
Abra seu navegador no endereço:
```
http://localhost:8080
```

---

## 📜 Manual do Terminal ZSH (MateusOS)

O sistema conta com emulação de terminal ZSH dividida em dois níveis de privilégio:

| Modo | Prompt | Comandos Disponíveis |
|---|---|---|
| **Usuário Visitante** | `mateus@MacBook-Pro ~ %` | `open`, `cat`, `ls -la`, `pwd`, `whoami`, `pbcopy`, `clear`, `man`, `date`, `uptime`, `sw_vers`, `uname -a`, `sudo -i` |
| **Engenharia (Root)** | `root@MacBook-Pro ~ #` | Acesso irrestrito a `/var/root`, `/etc/hosts`, `system_profiler`, `defaults`, `caffeinate`, `git log`, `tail -f` |

> Para consultar a lista completa com exemplos e especificações, consulte o [Manual Técnico de Comandos](comandos.md).

---

## 📱 Versão Mobile Otimizada

Para dispositivos com tela reduzida (largura `<= 768px`) ou dispositivos móveis (*smartphones* e *tablets*), o sistema redireciona automaticamente para:
- **`assets/portfolio.html`**: Interface limpa, responsiva e focada na experiência de toque.

---

## 📄 Licença

Este projeto é desenvolvido e mantido por [Mateus Alves](https://github.com/AllvesMatteus). Conceito original e inspiração por [@gaminghackintosh](https://github.com/gaminghackintosh). Distribuído sob a licença MIT.
