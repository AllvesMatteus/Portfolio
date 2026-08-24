# Plano de Refatoração e Arquitetura CSS

Documento de controle e rastreamento da refatoração da arquitetura CSS do projeto **macOS-Web**.

---

## 1. Estrutura Atual e Diagnóstico

### Arquivos Existentes:
* **`assets/css/main.css`** (~9.641 linhas):
  * Contém estilos base, variáveis globais, Window Manager, MenuBar, Dock, Control Center, Finder, Settings, Safari, Terminal, Calendar, Calculator, Music, Notes e componentes compartilhados.
* **`assets/css/patch.css`** (~3.735 linhas):
  * Contém correções específicas, overrides de layout Sequoia, widgets de Área de Trabalho (Smart Stack / Bento Widget de Perfil, Bateria, Calendário, Clima), animações, estados de janela inativa, alertas nativos macOS e integração de SF Symbols.
* **`assets/css/portfolio/`**:
  * Estilos isolados utilizados exclusivamente pela visualização mobile em `assets/portfolio.html`.

---

## 2. Dependências e Ordem de Cascata

* `main.css` é carregado primeiro, definindo a base, layout e apps.
* `patch.css` é carregado em seguida, aplicando refinamentos, alinhamentos e widgets do macOS Sequoia.
* A nova arquitetura deve preservar rigorosamente:
  1. A ordem das regras e especificidade para que nenhum override seja quebrado.
  2. As variáveis CSS (`:root`, `--system-font-family`, etc.).
  3. Keyframes e animações (`@keyframes contextMenuIn`, `macSpinnerRotate`, etc.).
  4. As regras de temas escuro/claro (`.dark-theme`, `.light-theme`).
  5. O comportamento em desktop e estados de janelas sobrepostas (`.widgets--desktop` vs `:not(.widgets--desktop)`).

---

## 3. Categorias Identificadas e Nova Estrutura Proposta

Uma estrutura modular, limpa e manutenível dentro de `assets/css/`:

```
assets/css/
├── main.css                  <-- Ponto de entrada / orquestrador de imports organizados
├── base/
│   ├── variables.css         <-- :root, variáveis globais, fontes, reset e base
│   └── animations.css        <-- Keyframes globais e transições
├── system/
│   ├── desktop.css           <-- Área de trabalho, ícones da mesa, seleção e wallpaper
│   ├── window-manager.css    <-- Estrutura de janelas, traffic lights, resize e drag
│   ├── menubar.css           <-- Barra de menus superior, menus suspensos e status items
│   ├── dock.css              <-- Dock inferior, tooltips, indicadores e animações
│   ├── control-center.css    <-- Central de Controle, sliders e módulos
│   ├── context-menu.css      <-- Menus de contexto de desktop e arquivos
│   ├── widgets.css           <-- Widgets (Bento Perfil, Bateria, Calendário, Clima)
│   └── modals.css            <-- Boot screen, alerta mobile, diálogos e avisos
├── apps/
│   ├── finder.css            <-- Aplicativo Finder (sidebar, toolbar, grid, preview)
│   ├── safari.css            <-- Navegador Safari (tabs, barra de URL, favoritos, blocked page)
│   ├── terminal.css          <-- Terminal macOS (prompt, comandos, temas)
│   ├── settings.css          <-- Ajustes do Sistema (painéis, wallpapers, opções)
│   └── legacy-apps.css       <-- Estilos de Calculadora, Calendário app, Notas e Música
└── portfolio/                <-- Mantido intacto para o portfolio mobile
```

---

## 4. Checklist de Execução

- [x] Auditar CSS e mapear dependências
- [x] Mapear seletores e overrides entre main.css e patch.css
- [x] Criar estrutura de diretórios e arquivos modulares
- [x] Migrar Grupo 1: Base (variables, reset, animations)
- [x] Migrar Grupo 2: Sistema (desktop, window-manager, menubar, dock, control-center, context-menu, widgets, modals)
- [x] Migrar Grupo 3: Widgets (Bento carousel, battery, weather, calendar)
- [x] Migrar Grupo 4: Aplicativos (finder, safari, terminal, settings, legacy-apps)
- [x] Atualizar ponto de entrada principal e `index.html`
- [x] Validar integridade visual e funcional
- [x] Procurar regras órfãs e realizar segunda auditoria
- [x] Limpeza final e relatório
