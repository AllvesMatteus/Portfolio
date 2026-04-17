# 🌌 Portfolio Interativo — Mateus Alves v2.5

<p align="center">
  <img src="https://img.shields.io/badge/MateusOS-v2.5.1-6366f1?style=for-the-badge&logo=apple-terminal" alt="Version">
  <img src="https://img.shields.io/badge/Status-Online-22c55e?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-0ea5e9?style=for-the-badge" alt="Maintained">
  <img src="https://img.shields.io/badge/License-MIT-white?style=for-the-badge" alt="License">
</p>

---

## 🚀 Sobre o Projeto

Este repositório contém meu portfólio pessoal, projetado para transcender a experiência de um site estático. Ele combina uma interface visual premium (GUI) com um terminal interativo completo (CLI), inspirado na estética minimalista do **macOS** e no poder do **Oh My Zsh**, permitindo que recrutadores e desenvolvedores explorem meu trabalho através de comandos Unix reais ou navegação tradicional.

> **"Turning coffee into logic since 2020."**

---

## 🛠️ Tech Stack & Ferramentas

### Core Development
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

### Bibliotecas & Recursos
- **Lucide Icons:** Conjunto de ícones consistentes e leves.
- **Geist Mono:** Tipografia otimizada para legibilidade de código.
- **Tailwind Engine:** Motor dinâmico para estilização em tempo real.

---

## 💎 Funcionalidades de Destaque

### 1. ⌨️ MateusOS (Terminal CLI)
Uma réplica funcional de um terminal ZSH (adaptado do ecossistema macOS + Oh My Zsh) que inclui:
- **VFS (Virtual File System):** Explore diretórios como `/Users/mateus` e `/var/root`.
- **Command Handler:** Suporte a `ls`, `cd`, `cat`, `pwd`, `id`, `clear`, `sudo`, `npm run`, entre outros.
- **Smart Autocomplete:** Use `Tab` ou `➔` para completar comandos dinamicamente.
- **Histórico:** Navegue por comandos anteriores com as setas `↑` e `↓`.
- **Navegação por seção:** Abra seções individuais do portfólio diretamente pelo terminal.
- **Animações de seção:** Cada seção exibe suas animações de reveal ao ser aberta via CLI.

### 2. 🏗️ Engineering Mode (ROOT)
Acesso via `sudo -i` que desbloqueia:
- **ZSH Pro:** Prompt customizado em vermelho estilo root, com título scramble animado.
- **Scripts NPM:** Simulação de fluxos de deploy e compilação (`npm run dev`).
- **Neofetch:** Resumo técnico do sistema e hardware simulado.
- **VFS Completo:** Navegação irrestrita por `/var/root`, `/etc` e demais diretórios.
- **Help contextual:** O `help` exibe comandos específicos do modo root com tema vermelho.

### 3. 🖥️ Controles de Janela Inteligentes
Os botões macOS do terminal têm comportamentos distintos:
- **🔴 X (Fechar):** Reseta completamente o terminal (sai do sudo, limpa sessão). Ao reabrir, executa o boot animation completo do zero.
- **🟡 − (Minimizar):** Apenas minimiza a janela para a GUI. Ao reabrir, continua de onde parou.
- **🟢 ⊕ (Maximizar):** Expande o terminal para tela cheia.

### 4. ⏳ Time Travel Protocol (Legacy)
Uma "Máquina do Tempo" secreta desbloqueável via modo root, que redireciona para o portfólio original de 2020, demonstrando a evolução profissional ao longo do tempo.

### 5. 🌍 I18n Multilingual
Troca instantânea de idioma (Português/Inglês) afetando textos do site, placeholders e outputs do terminal simultaneamente via `lang [pt|en]`.

---

## 📐 Arquitetura do Projeto

```bash
📂 Portfolio/
├── 📄 index.html           # Ponto de entrada (GUI + CLI)
├── 📂 assets/
│   ├── 📂 css/
│   │   └── 🎨 style.css    # Design System & Animações Customizadas
│   ├── 📂 js/
│   │   ├── ⚡ main.js      # Lógica da GUI, Animações e Observadores de Scroll
│   │   ├── 🖥️ terminal.js  # Engine do VFS, Processamento de CLI e Controles de Janela
│   │   ├── 🌍 i18n.js      # Gerenciamento de Traduções (pt/en)
│   │   └── ⚙️ tailwind-config.js
├── 📂 docs/
│   ├── 📜 legacy.html      # Portfólio de 2020 (Preservado & Protegido)
│   └── 📘 terminal_commands.md  # Manual completo de comandos
└── 📄 README.md
```

---

## ⚡ Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AllvesMatteus/Portfolio.git
   ```
2. **Abra o `index.html`:**
   Não requer etapa de build ou instalação de dependências. Basta abrir diretamente no navegador ou usar o **Live Server** (VS Code).

3. **Explore o Terminal:**
   Abra o site e tente digitar `sudo -i` para desbloquear o modo root.

---

## 🤝 Conecte-se Comigo

<p align="left">
  <a href="https://www.linkedin.com/in/allves-mateus/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/AllvesMatteus" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="mailto:allves.matteus@hotmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
</p>

---

## 🎨 Créditos & Inspiração

Este projeto foi desenvolvido com base em referências de design e ferramentas de código aberto:
- **Design Base:** Inspirado no template original da [Aura Build](https://aura.build/templates/7ARR67L).
- **Terminal UI:** Adaptado da experiência visual do **macOS** com o framework **Oh My Zsh**.
- **Engine:** Construído sobre os princípios de design da **Apple**.

## ⚖️ Direitos Autorais e Licença

Este projeto é de uso pessoal e educacional:
- **Lógica e Implementação:** Todo o código JavaScript (incluindo o motor do MateusOS), estrutura HTML e CSS customizado são de autoria de **Mateus Alves**.
- **Design e Ativos:** O conceito visual é adaptado de fontes de terceiros (citadas em Créditos). O uso de marcas e logotipos (Apple, macOS, Neofetch) é puramente estético e para fins de demonstração de portfólio.
- **Licença:** Este repositório está sob a licença [MIT](LICENSE). Sinta-se à vontade para usar partes da lógica para estudo, desde que os devidos créditos sejam mantidos.

---
<p align="center">
  Codado a base de ☕ por <strong>Mateus Alves</strong> — Atualizado em Abril de 2026.
</p>
