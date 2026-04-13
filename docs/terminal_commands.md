# 🖥️ Manual de Comandos — MateusOS (Terminal v2.5)

Este documento descreve as funcionalidades e comandos disponíveis no **MateusOS**, o terminal interativo integrado ao portfólio.

---

## 🛠️ Navegação Básica (Usuário Padrão)

### `help`
Exibe a central de ajuda. No sistema atual, o prompt limpo permite foco total nos comandos.

**Português (PT):**
```text
mateus@MacBook-Pro ~ % help
NAVEGAÇÃO
  open sobre      # Informações profissionais
  open projetos   # Galeria de trabalhos
  open habilidades # Stack tecnológica
  open contato    # Redes sociais e email
  open formacao   # Trajetória acadêmica

SISTEMA
  gui             # Alterna para a interface visual
  lang [en|pt]    # Idioma / Language
  clear           # Limpa a tela
  reset           # Reiniciar terminal
  sudo -i         # Acessar modo administrador

# Setas ↑↓ para histórico | Tab para autocompletar
mateus@MacBook-Pro ~ %
```

### `open [seção]`
Abre diretamente uma seção do portfólio. 
**Exemplos:** `open sobre`, `open projetos`.

### `lang [en|pt]`
Altera instantaneamente o idioma do sistema (Textos e Terminal).

---

## 🏗️ Modo de Engenharia (ROOT)

Para acessar recursos avançados e explorar o "backstage" do projeto, use privilégios elevados.

### `sudo -i`
Habilita o modo ROOT e o acesso ao Sistema de Arquivos Virtual (VFS).

```text
mateus@MacBook-Pro ~ % sudo -i
Password: 
(Efeito Scramble no título do terminal)
root@MacBook-Pro ~ # 
```

### 📂 Manipulação de Arquivos (VFS)
Comandos Unix clássicos para explorar a estrutura do projeto.

*   `ls`: Listar arquivos no diretório atual.
*   `cd [Caminho]`: Mudar de diretório (suporta `..` e `~`).
*   `pwd`: Exibe o caminho completo do diretório atual.
*   `cat [Arquivo]`: Lê o conteúdo de arquivos `.md` (dispara a visualização da seção).

**Exemplo de uso:**
```text
root@MacBook-Pro ~ # ls
about.md  skills.md  projects.md  experience.md  education.md  contact.md

root@MacBook-Pro ~ # cat projects.md
Routing to projects... (Production Build)
root@MacBook-Pro ~ # 
```

### 🚀 Automação e Dev
*   `npm run dev`: Simula o início do servidor de desenvolvimento Vite.
*   `neofetch` (ou `system`): Exibe o resumo técnico do sistema (Hardware simulado e links).
*   `omz`: Instala visualmente o pacote *Oh My Zsh* para personalizar o prompt.

---

## 🏆 Segredos (Easter Eggs)

### `legacy`
Comando especial que ativa o **Time Travel Protocol**. Disponível apenas para usuários que explorarem o sistema no modo ROOT e visualizarem as seções técnicas.

```text
root@MacBook-Pro ~ # npm run legacy
WARNING: TIME TRAVEL PROTOCOL ACTIVATED...
Loading Legacy Environment [2020.v1]...
Redirecting... Enjoy the evolution!
```

---

## 🎨 Guia de Estilo (ZSH Theme)

| Elemento | Estilo / Classe | Finalidade |
| :--- | :--- | :--- |
| **Comandos Válidos** | `text-[#28C840]` (Verde) | Feedback imediato de sintaxe correta. |
| **Comandos Inválidos** | `text-[#FF3B30]` (Vermelho) | Alerta de erro de digitação. |
| **Dicas de Sistema** | `text-gray-500` | Instruções e descrições curtas. |
| **Prompt Root** | `text-red-500` | Indica privilégios de administrador. |

---
*Manual técnico atualizado em 13 de Abril de 2026 por Mateus Alves.*
