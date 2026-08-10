# macOS Design System
## Documentação Completa baseada na Apple Human Interface Guidelines
### https://developer.apple.com/design/human-interface-guidelines/designing-for-macos

---

> **Nota:** Este documento compila exclusivamente informações da documentação oficial da Apple (Human Interface Guidelines) para o design de interfaces no macOS. Todos os valores, tokens e especificações são derivados das HIGs publicadas pela Apple.

---

# PARTE 1 — TIPOGRAFIA DO macOS

## 1.1 Família de Fontes do Sistema

O macOS utiliza a família tipográfica **San Francisco (SF)** como fonte do sistema. A Apple projetou esta família especificamente para legibilidade em telas, com otimizações para diferentes tamanhos e densidades de pixel.

### Fontes Disponíveis

| Fonte | Uso Principal | Características |
|-------|--------------|-----------------|
| **SF Pro** | Interface geral do sistema | Fonte principal para UI, textos e labels |
| **SF Pro Display** | Títulos grandes (20pt+) | Espaçamento mais aberto para tamanhos grandes |
| **SF Pro Text** | Textos pequenos (19pt ou menos) | Espaçamento mais apertado, otimizado para leitura em tamanhos reduzidos |
| **SF Mono** | Código, terminal, dados técnicos | Monoespaçada, usada em editores de código e terminal |
| **SF Compact** | Interfaces compactas (Apple Watch) | Versão condensada para espaços limitados |
| **New York** | Textos editoriais, leitura longa | Serifada, inspirada em tipografia clássica |

### Stack CSS Recomendada

```css
/* Interface geral */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

/* Código / Terminal */
font-family: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;

/* Textos editoriais */
font-family: 'New York', 'Georgia', 'Times New Roman', serif;
```

> A Apple disponibiliza as fontes SF Pro, SF Mono e New York gratuitamente para download em: https://developer.apple.com/fonts

---

## 1.2 Pesos Tipográficos

O macOS utiliza uma escala de pesos que vai do ultra-leve ao heavy:

| Peso | Valor CSS | Uso Típico |
|------|-----------|------------|
| Ultralight | 100 | Raramente usado em UI |
| Thin | 200 | Textos decorativos |
| Light | 300 | Subtítulos, textos secundários |
| Regular | 400 | Corpo de texto padrão |
| Medium | 500 | Títulos de janela, labels destacados |
| Semibold | 600 | Botões, navegação, headings |
| Bold | 700 | Títulos de seção, ênfase |
| Heavy | 800 | Títulos grandes, branding |
| Black | 900 | Display, impacto máximo |

### Uso no Sistema

| Elemento | Tamanho | Peso | Fonte |
|----------|---------|------|-------|
| Título da janela | 13px | 500 (Medium) | SF Pro Text |
| Menu bar | 13px | 400 (Regular) | SF Pro Text |
| Corpo de texto | 13px | 400 (Regular) | SF Pro Text |
| Heading (H1) | 22px | 700 (Bold) | SF Pro Display |
| Heading (H2) | 17px | 600 (Semibold) | SF Pro Display |
| Heading (H3) | 15px | 600 (Semibold) | SF Pro Text |
| Caption | 11px | 400 (Regular) | SF Pro Text |
| Footnote | 10px | 400 (Regular) | SF Pro Text |
| Terminal / Código | 11–12px | 400 (Regular) | SF Mono |

---

## 1.3 Tamanhos de Fonte no macOS

A Apple define uma escala de tamanhos que varia conforme o contexto:

```
Large Title  → 26pt (usado em apps como Configurações)
Title 1      → 22pt
Title 2      → 17pt
Title 3      → 15pt
Headline     → 13pt (Semibold)
Body         → 13px (Regular)
Callout      → 12px
Subhead      → 11px
Footnote     → 10px
Caption 1    → 10px
Caption 2    → 9px
```

> A unidade padrão no macOS é o **ponto (pt)**, não pixel. Em telas Retina (2x), 1pt = 2px. Em telas padrão, 1pt = 1px.

---

## 1.4 Espaçamento entre Linhas (Line Height)

| Contexto | Line Height |
|----------|-------------|
| Texto de interface (labels, botões) | 1.0–1.2 |
| Corpo de texto legível | 1.4–1.5 |
| Texto editorial / leitura longa | 1.5–1.6 |
| Terminal / código | 1.4 |

---

## 1.5 Recursos Tipográficos do SF Pro

### Números Proporcionais vs. Tabulares

O SF Pro suporta ambos os modos de numeração:

- **Proporcional** (padrão): Cada número tem largura diferente (ex: "1" é mais estreito que "8"). Ideal para texto corrido.
- **Tabular**: Todos os números têm a mesma largura. Ideal para tabelas, preços, código.

```css
/* Proporcional (padrão) */
font-variant-numeric: proportional-nums;

/* Tabular */
font-variant-numeric: tabular-nums;
```

### Small Caps

O SF Pro suporta small caps para abreviações e siglas:

```css
font-variant-caps: small-caps;
```

### Ligações Tipográficas (Ligatures)

Desabilitadas por padrão em interfaces, habilitadas em textos editoriais:

```css
/* Desabilitar (padrão em UI) */
font-variant-ligatures: none;

/* Habilitar (textos longos) */
font-variant-ligatures: common-ligatures;
```

---

# PARTE 2 — CORES DO SISTEMA (System Colors)

## 2.1 Cores Semânticas

O macOS define **cores semânticas** que se adaptam automaticamente entre Light Mode e Dark Mode. A Apple recomenda usar estas cores em vez de cores fixas, pois elas garantem consistência visual e acessibilidade.

### Cores Primárias do Sistema

| Nome Semântico | Hex (Dark Mode) | Uso |
|----------------|-----------------|-----|
| `systemBlue` | `#0A84FF` | Links, ações primárias, botões padrão, foco |
| `systemGreen` | `#30D158` | Sucesso, confirmação, estados positivos |
| `systemRed` | `#FF453A` | Erros, destruição, alertas críticos |
| `systemOrange` | `#FF9F0A` | Avisos, atenção necessária |
| `systemYellow` | `#FFD60A` | Destaques, badges de notificação |
| `systemPink` | `#FF375F` | Ações especiais, branding secundário |
| `systemPurple` | `#BF5AF2` | Branding, categorias |
| `systemTeal` | `#64D2FF` | Informação, estados neutros |
| `systemIndigo` | `#5E5CE6` | Terciário, complementar |
| `systemBrown` | `#AC8E68` | Elementos neutros, terrestres |

> **Nota importante:** No Light Mode, `systemBlue` é `#007AFF`. No Dark Mode, muda para `#0A84FF` (mais brilhante para manter contraste). Sempre use a variável semântica, nunca hardcode.

---

## 2.2 Escala de Cinzas (System Grays)

O macOS fornece uma escala de 6 níveis de cinza para criar hierarquia visual:

| Nome Semântico | Hex (Dark Mode) | Uso |
|----------------|-----------------|-----|
| `systemGray` | `#8E8E93` | Cinza padrão, texto secundário |
| `systemGray2` | `#636366` | Elementos desabilitados, bordas |
| `systemGray3` | `#48484A` | Separadores sutis, backgrounds |
| `systemGray4` | `#3A3A3C` | Cards, áreas elevadas |
| `systemGray5` | `#2C2C2E` | Fundos secundários |
| `systemGray6` | `#1C1C1E` | Fundos terciários, áreas profundas |

```css
:root {
  --mac-gray:   #8E8E93;
  --mac-gray-2: #636366;
  --mac-gray-3: #48484A;
  --mac-gray-4: #3A3A3C;
  --mac-gray-5: #2C2C2E;
  --mac-gray-6: #1C1C1E;
}
```

---

# PARTE 3 — CORES DE TEXTO (Label Colors)

## 3.1 Hierarquia de Texto

O macOS define 4 níveis de texto baseados em opacidade. Todos compartilham a mesma cor base (`#EBEBF5` no dark mode), mas com diferentes níveis de opacidade:

| Nome Semântico | Hex + Alpha | Opacidade | Uso |
|----------------|-------------|-----------|-----|
| `label` | `#FFFFFF` | 100% | Texto principal, títulos, conteúdo primário |
| `secondaryLabel` | `#EBEBF5` @ 60% | 60% | Subtítulos, descrições, metadados |
| `tertiaryLabel` | `#EBEBF5` @ 30% | 30% | Texto desabilitado, placeholders, hints |
| `quaternaryLabel` | `#EBEBF5` @ 18% | 18% | Texto muito sutil, timestamps, divisores de texto |

### Por que `#EBEBF5` em vez de `#FFFFFF`?

A Apple usa `#EBEBF5` (um branco levemente azulado) como base para labels secundários/terciários no dark mode porque:
- Reduz fadiga visual em telas OLED/mini-LED
- Cria uma hierarquia mais suave que branco puro
- Mantém legibilidade sem competir com o texto principal (`label` em `#FFFFFF`)

```css
:root {
  --mac-label:            #FFFFFF;
  --mac-label-secondary:  rgba(235, 235, 245, 0.60);
  --mac-label-tertiary:   rgba(235, 235, 245, 0.30);
  --mac-label-quaternary: rgba(235, 235, 245, 0.18);
}
```

---

# PARTE 4 — CORES DE FUNDO (Background Colors)

## 4.1 Hierarquia de Fundos

O macOS organiza os fundos em 3 níveis para criar profundidade visual:

| Nome Semântico | Hex (Dark Mode) | Uso |
|----------------|-----------------|-----|
| `systemBackground` | `#000000` | Fundo principal da janela, canvas base |
| `secondarySystemBackground` | `#1C1C1E` | Cards, listas, sidebars, áreas elevadas |
| `tertiarySystemBackground` | `#2C2C2E` | Conteúdo dentro de cards, células selecionadas |

### Fundos Agrupados (Grouped Backgrounds)

Usados em table views, settings, e interfaces com múltiplas seções agrupadas:

| Nome Semântico | Hex (Dark Mode) | Uso |
|----------------|-----------------|-----|
| `systemGroupedBackground` | `#000000` | Fundo de views agrupadas |
| `secondarySystemGroupedBackground` | `#1C1C1E` | Cards dentro de grupos |
| `tertiarySystemGroupedBackground` | `#2C2C2E` | Conteúdo dentro de cards agrupados |

```css
:root {
  --mac-bg-primary:   #000000;   /* systemBackground */
  --mac-bg-secondary: #1C1C1E;   /* secondarySystemBackground */
  --mac-bg-tertiary:  #2C2C2E;   /* tertiarySystemBackground */
}
```

### Desktop Tinting

O macOS aplica um efeito chamado **Desktop Tinting** no dark mode: a cor do wallpaper da área de trabalho influencia sutilmente a cor de fundo da janela. Isso cria uma harmonia visual entre o sistema e o ambiente do usuário.

> "Include some transparency in custom component backgrounds when appropriate. Transparency lets your components pick up color from the window background when desktop tinting is active." — Apple HIG

Para simular isso em web, use `backdrop-filter` com leve transparência:

```css
.macos-window {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
}
```

---

# PARTE 5 — CORES DE CONTROLES (Control Colors)

## 5.1 Cores de Interface de Controles

| Nome Semântico | Hex / RGBA (Dark Mode) | Uso |
|----------------|------------------------|-----|
| `controlBackgroundColor` | `#1E1E1E` | Fundo de inputs, text fields, popups |
| `controlColor` | `#FFFFFF` @ 20% | Controles padrão (botões, sliders) |
| `controlTextColor` | `rgba(255, 255, 255, 0.80)` | Texto dentro de controles |
| `selectedControlColor` | `#3F638B` | Controle selecionado, checkbox marcado |
| `selectedControlTextColor` | `rgba(255, 255, 255, 0.80)` | Texto em controle selecionado |
| `disabledControlTextColor` | `rgba(255, 255, 255, 0.20)` | Texto em controles desabilitados |
| `keyboardFocusIndicatorColor` | `#007AFF` | Anel de foco ao navegar por teclado |
| `selectedContentBackgroundColor` | `#0058D0` | Fundo de conteúdo selecionado (ex: texto selecionado) |
| `selectedTextBackgroundColor` | `#3F638B` | Fundo de texto selecionado |
| `selectedTextColor` | `#FFFFFF` | Texto quando selecionado |
| `placeholderTextColor` | `rgba(255, 255, 255, 0.20)` | Texto placeholder em inputs |
| `linkColor` | `#419CFF` | Links clicáveis |
| `separatorColor` | `rgba(84, 84, 88, 0.60)` | Separadores entre itens |
| `opaqueSeparatorColor` | `#38383A` | Separadores opacos (não transparentes) |

```css
:root {
  --mac-control-bg:       #1E1E1E;
  --mac-control-text:     rgba(255, 255, 255, 0.80);
  --mac-control-selected: #3F638B;
  --mac-control-disabled: rgba(255, 255, 255, 0.20);
  --mac-focus:            #007AFF;
  --mac-link:             #419CFF;
  --mac-placeholder:      rgba(255, 255, 255, 0.20);
  --mac-separator:        rgba(84, 84, 88, 0.60);
  --mac-separator-opaque: #38383A;
}
```

---

## 5.2 Estados de Controles

| Estado | Aparência (Dark Mode) |
|--------|----------------------|
| **Normal** | Cor padrão do token |
| **Hover** | Leve aumento de brilho/opacidade |
| **Pressed** | Cor mais escura/brilhante, dependendo do contexto |
| **Selected** | `#3F638B` com texto em `rgba(255,255,255,0.80)` |
| **Disabled** | Opacidade reduzida para 20–30%, sem interação |
| **Focused** | Anel azul `#007AFF` ao redor do elemento |

---

# PARTE 6 — CORES DE PREENCHIMENTO (Fill Colors)

Usados para backgrounds de badges, tags, chips e elementos de UI menores:

| Nome Semântico | Hex + Alpha (Dark Mode) | Uso |
|----------------|-------------------------|-----|
| `systemFill` | `#787880` @ 36% | Preenchimento primário (badges, toggles) |
| `secondarySystemFill` | `#787880` @ 32% | Preenchimento secundário |
| `tertiarySystemFill` | `#767680` @ 24% | Preenchimento terciário |
| `quaternarySystemFill` | `#767680` @ 18% | Preenchimento quaternário (mais sutil) |

```css
:root {
  --mac-fill-primary:    rgba(120, 120, 128, 0.36);
  --mac-fill-secondary:  rgba(120, 120, 128, 0.32);
  --mac-fill-tertiary:   rgba(118, 118, 128, 0.24);
  --mac-fill-quaternary: rgba(118, 118, 128, 0.18);
}
```

> A base dos fills é um cinza azulado (`#787880` ou `#767680`) que se adapta bem tanto no light quanto no dark mode.

---

# PARTE 7 — MATERIAIS E VIBRANCY

## 7.1 O que são Materiais?

O macOS não usa cores sólidas simples para fundos de janelas. Em vez disso, usa **materiais** — superfícies parcialmente transparentes que misturam a cor do conteúdo subjacente com uma cor base.

### Materiais Disponíveis

| Material | Uso |
|----------|-----|
| `headerView` | Cabeçalhos de janela e views |
| `sidebar` | Sidebars (ex: Finder, Mail) |
| `selection` | Itens selecionados em listas |
| `menu` | Menus dropdown |
| `popover` | Popovers e tooltips |
| `titlebar` | Title bars de janelas |
| `underWindowBackground` | Área sob a janela |

### Vibrancy

Quando um material é aplicado, elementos de primeiro plano exibem **vibrancy** — um efeito que mistura sutilmente as cores de primeiro plano com o fundo, melhorando o contraste e a sensação de profundidade.

> "Vibrancy is an effect that can pull color into a window from the content underneath it." — Apple HIG

### Estados de Vibrancy

| Estado da Janela | Vibrancy |
|------------------|----------|
| **Key** (ativa) | **Ativo** — puxa cor do conteúdo subjacente |
| **Main** (frente) | Ativo |
| **Inactive** (segundo plano) | **Desativado** — sem efeito, aparência opaca e "subdued" |

### Implementação em CSS

```css
/* Janela ativa (Key) — com vibrancy */
.macos-window {
  background: rgba(30, 30, 30, 0.72);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
}

/* Janela inativa — sem vibrancy */
.macos-window.inactive {
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: none;
}
```

---

# PARTE 8 — LIQUID GLASS (macOS 26 / Tahoe)

## 8.1 O que é Liquid Glass?

O **Liquid Glass** é o novo material de design introduzido no macOS 26 (Tahoe). É uma evolução do glassmorphism que:

- Cria superfícies de vidro virtual com reflexos especulares
- Permite que controles e navegação "flutuem" sobre o conteúdo
- Unifica o design entre macOS, iOS, iPadOS e visionOS
- Introduz **concentricidade** — cantos arredondados proporcionais entre container e elementos internos

## 8.2 Diretrizes de Uso

> "Use Liquid Glass for the functional and navigational layer of your app, not the content layer." — Apple HIG

| Onde USAR | Onde NÃO USAR |
|-----------|---------------|
| Title bars | Área de conteúdo principal |
| Toolbars | Textos e imagens |
| Tab bars | Vídeos e mídia |
| Controles flutuantes | Dados importantes |
| Dock | Conteúdo editorial |

## 8.3 Características Visuais

- Bordas leves e translúcidas
- Sensação de profundidade 3D
- Elementos parecem flutuar no espaço
- Cantos mais generosos que versões anteriores
- Concentricidade entre cantos da janela e elementos internos

---

# PARTE 9 — ESTADOS DE JANELA E SUAS CORES

## 9.1 Três Estados Visuais

O macOS define 3 estados visuais para janelas, cada um com aparência diferente:

### Key Window (Janela Ativa)
- Recebe input do teclado e mouse
- Traffic lights **coloridos** (vermelho, amarelo, verde)
- **Vibrancy ativo** — fundo translúcido com blur
- Sombra **forte e nítida**
- Title bar com gradiente/brilho visível
- Texto do título em opacidade máxima

### Main Window (Janela Principal)
- Janela da frente do app
- Geralmente é também a Key window
- Mesma aparência da Key em condições normais
- Se houver um painel flutuante key acima, pode ter aparência ligeiramente diferente

### Inactive Window (Janela Inativa)
- Está em segundo plano
- Traffic lights **CINZA** (`#dddddd` / `#d1d0d2`)
- **Sem vibrancy** — fundo opaco
- Sombra **mais suave e difusa**
- Title bar sem brilho/gradiente
- Texto do título com opacidade reduzida
- Aparência "subdued" (atenuada)

> "The system gives main, key, and inactive windows different appearances to help people visually identify them." — Apple HIG

## 9.2 Implementação CSS

```css
/* KEY / MAIN (ativa) */
.macos-window {
  background: rgba(30, 30, 30, 0.72);
  backdrop-filter: blur(30px) saturate(180%);
  box-shadow:
    0 22px 70px rgba(0, 0, 0, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.3);
}

.macos-window .window-title {
  color: rgba(255, 255, 255, 0.85);
}

/* INACTIVE */
.macos-window.inactive {
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.macos-window.inactive .window-title {
  color: rgba(255, 255, 255, 0.35);
}
```

---

# PARTE 10 — CORES ESPECÍFICAS POR APP

## 10.1 Terminal.app (Dark Mode)

O Terminal.app usa um esquema de cores específico que difere da janela padrão do macOS:

| Elemento | Hex | Nota |
|----------|-----|------|
| Fundo do terminal | `#1E1E1E` | Cor do perfil "Pro" padrão |
| Fundo da title bar | `#3A3A3A` | Sólido, SEM glassmorphism |
| Borda inferior da title bar | `#2D2D2D` | Separador escuro |
| Texto principal | `#E0E0E0` | Cinza claro, NÃO branco puro |
| Texto "Last login" | `#8E8E93` | Cinza secundário do sistema |
| Prompt (usuário@host) | `#E0E0E0` | Mesmo do texto principal |
| Cursor | `#E0E0E0` | Cursor piscando |
| Ícone de pasta no título | `#0A84FF` | Azul do sistema |
| Seleção de texto | `#3F638B` | Azul selecionado do sistema |

> O Terminal NÃO usa glassmorphism na title bar. Usa uma cor sólida escura (`#3A3A3A`) porque é uma janela de utilitário/ferramenta, não uma janela de conteúdo padrão.

## 10.2 Finder (Dark Mode)

| Elemento | Hex |
|----------|-----|
| Sidebar background | `#1C1C1E` |
| Sidebar selected item | `#3F638B` |
| Área principal | `#000000` |
| Ícone de pasta | `#0A84FF` |
| Ícone de arquivo | `#E0E0E0` |

## 10.3 Safari (Dark Mode)

| Elemento | Hex |
|----------|-----|
| Toolbar background | `#3A3A3A` (sólido) |
| Address bar | `#1E1E1E` |
| Fundo da página | `#000000` (quando site suporta dark) |

---

# PARTE 11 — CSS COMPLETO PARA COPIAR

```css
/* ============================================
   macOS DARK MODE — Design Tokens Completos
   Baseado na Apple Human Interface Guidelines
   https://developer.apple.com/design/human-interface-guidelines/designing-for-macos
   ============================================ */

:root {
  /* ---------- TIPOGRAFIA ---------- */
  --font-system: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono:   'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
  --font-serif:  'New York', 'Georgia', 'Times New Roman', serif;

  /* ---------- FUNDOS ---------- */
  --mac-bg-primary:   #000000;   /* systemBackground */
  --mac-bg-secondary: #1C1C1E;   /* secondarySystemBackground */
  --mac-bg-tertiary:  #2C2C2E;   /* tertiarySystemBackground */

  /* ---------- TEXTO (LABELS) ---------- */
  --mac-label:            #FFFFFF;
  --mac-label-secondary:  rgba(235, 235, 245, 0.60);
  --mac-label-tertiary:   rgba(235, 235, 245, 0.30);
  --mac-label-quaternary: rgba(235, 235, 245, 0.18);

  /* ---------- CORES DO SISTEMA ---------- */
  --mac-blue:   #0A84FF;
  --mac-green:  #30D158;
  --mac-red:    #FF453A;
  --mac-orange: #FF9F0A;
  --mac-yellow: #FFD60A;
  --mac-pink:   #FF375F;
  --mac-purple: #BF5AF2;
  --mac-teal:   #64D2FF;
  --mac-indigo: #5E5CE6;
  --mac-brown:  #AC8E68;

  /* ---------- CINZAS ---------- */
  --mac-gray:   #8E8E93;
  --mac-gray-2: #636366;
  --mac-gray-3: #48484A;
  --mac-gray-4: #3A3A3C;
  --mac-gray-5: #2C2C2E;
  --mac-gray-6: #1C1C1E;

  /* ---------- CONTROLES ---------- */
  --mac-control-bg:       #1E1E1E;
  --mac-control-text:     rgba(255, 255, 255, 0.80);
  --mac-control-selected: #3F638B;
  --mac-control-disabled: rgba(255, 255, 255, 0.20);
  --mac-focus:            #007AFF;
  --mac-link:             #419CFF;
  --mac-placeholder:      rgba(255, 255, 255, 0.20);

  /* ---------- PREENCHIMENTOS ---------- */
  --mac-fill-primary:    rgba(120, 120, 128, 0.36);
  --mac-fill-secondary:  rgba(120, 120, 128, 0.32);
  --mac-fill-tertiary:   rgba(118, 118, 128, 0.24);
  --mac-fill-quaternary: rgba(118, 118, 128, 0.18);

  /* ---------- SEPARADORES ---------- */
  --mac-separator:        rgba(84, 84, 88, 0.60);
  --mac-separator-opaque: #38383A;

  /* ---------- TERMINAL.APP ---------- */
  --terminal-bg:              #1E1E1E;
  --terminal-titlebar:        #3A3A3A;
  --terminal-titlebar-border: #2D2D2D;
  --terminal-text:            #E0E0E0;
  --terminal-text-dim:        #8E8E93;
  --terminal-folder:          #0A84FF;
  --terminal-cursor:          #E0E0E0;

  /* ---------- DOCK / MENU BAR ---------- */
  --dock-bg:      rgba(30, 30, 30, 0.4);
  --dock-border:  rgba(255, 255, 255, 0.1);
  --menubar-bg:   rgba(30, 30, 30, 0.6);
  --menubar-text: #FFFFFF;
}
```

---

# PARTE 12 — CHECKLIST DE IMPLEMENTAÇÃO

Antes de considerar a implementação completa, verifique:

## Tipografia
- [ ] Fonte do sistema: `-apple-system, BlinkMacSystemFont, 'SF Pro Display'...`
- [ ] Fonte monoespaçada: `'SF Mono', 'Menlo', 'Monaco'...`
- [ ] Título da janela: 13px, weight 500
- [ ] Corpo de texto: 13px, weight 400
- [ ] Terminal/código: 11–12px, fonte monoespaçada

## Cores de Fundo
- [ ] `systemBackground`: `#000000`
- [ ] `secondarySystemBackground`: `#1C1C1E`
- [ ] `tertiarySystemBackground`: `#2C2C2E`

## Cores de Texto
- [ ] `label`: `#FFFFFF`
- [ ] `secondaryLabel`: `rgba(235, 235, 245, 0.60)`
- [ ] `tertiaryLabel`: `rgba(235, 235, 245, 0.30)`
- [ ] `quaternaryLabel`: `rgba(235, 235, 245, 0.18)`

## Cores do Sistema
- [ ] `systemBlue`: `#0A84FF` (dark mode)
- [ ] `systemGreen`: `#30D158`
- [ ] `systemRed`: `#FF453A`
- [ ] `systemOrange`: `#FF9F0A`
- [ ] `systemYellow`: `#FFD60A`

## Controles
- [ ] `controlBackgroundColor`: `#1E1E1E`
- [ ] `controlTextColor`: `rgba(255, 255, 255, 0.80)`
- [ ] `selectedControlColor`: `#3F638B`
- [ ] `disabledControlTextColor`: `rgba(255, 255, 255, 0.20)`
- [ ] `placeholderTextColor`: `rgba(255, 255, 255, 0.20)`
- [ ] `linkColor`: `#419CFF`
- [ ] `separatorColor`: `rgba(84, 84, 88, 0.60)`
- [ ] `opaqueSeparatorColor`: `#38383A`

## Preenchimentos
- [ ] `systemFill`: `rgba(120, 120, 128, 0.36)`
- [ ] `secondarySystemFill`: `rgba(120, 120, 128, 0.32)`
- [ ] `tertiarySystemFill`: `rgba(118, 118, 128, 0.24)`
- [ ] `quaternarySystemFill`: `rgba(118, 118, 128, 0.18)`

## Terminal.app
- [ ] Fundo: `#1E1E1E`
- [ ] Title bar: `#3A3A3A` (sólido, sem glassmorphism)
- [ ] Borda da title bar: `#2D2D2D`
- [ ] Texto principal: `#E0E0E0`
- [ ] Texto secundário: `#8E8E93`
- [ ] Ícone de pasta: `#0A84FF`

## Estados de Janela
- [ ] Key: vibrancy ativo, fundo translúcido
- [ ] Inactive: sem vibrancy, fundo opaco, texto atenuado

---

> **Fontes:** Apple Human Interface Guidelines — Designing for macOS, Apple Developer Documentation (NSColor, NSWindow, NSVisualEffectView), SF Symbols Guidelines, Typography Guidelines.
> 
> **URLs de referência:**
> - https://developer.apple.com/design/human-interface-guidelines/designing-for-macos
> - https://developer.apple.com/design/human-interface-guidelines/color
> - https://developer.apple.com/design/human-interface-guidelines/windows
> - https://developer.apple.com/fonts
