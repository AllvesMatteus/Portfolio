# 🖥️ Manual de Comandos — MateusOS (Terminal v2.5.1)

Este documento descreve as funcionalidades e comandos disponíveis no **MateusOS**, o terminal interativo integrado ao portfólio.

---

## 🖱️ Controles de Janela

| Botão | Cor | Comportamento |
| :---- | :-- | :------------ |
| ⊕ Maximizar | 🟢 Verde | Expande o terminal para tela cheia |
| − Minimizar | 🟡 Amarelo | Oculta o terminal e abre a GUI — **sessão preservada** |
| × Fechar | 🔴 Vermelho | Fecha e **reseta** o terminal — reinicia o boot ao reabrir |

> O botão `>_ TERMINAL ESC` no canto inferior esquerdo da GUI retorna ao terminal no estado em que foi minimizado.

---

## 🛠️ Usuário Padrão (`mateus@MacBook-Pro ~ %`)

### `help`
Exibe a central de ajuda com todos os comandos disponíveis para o modo atual.

### `open [seção]`
Abre diretamente uma seção isolada do portfólio (com animações de reveal).

| Seção         | Descrição               |
| :------------ | :---------------------- |
| `sobre`       | Informações profissionais |
| `habilidades` | Stack tecnológica        |
| `projetos`    | Galeria de trabalhos     |
| `contato`     | Redes sociais e email    |
| `formacao`    | Trajetória acadêmica     |

**Exemplo:** `open projetos`

### `lang [en|pt]`
Altera instantaneamente o idioma do sistema (textos do site e terminal).

### `gui`
Alterna para a interface visual (GUI), exibindo o portfólio completo.

### `whoami`
Exibe o usuário atual. No modo padrão, retorna informações completas do perfil.

### `id`
Exibe uid/gid/groups no formato Unix real.

```
uid=501(mateus) gid=20(staff) groups=20(staff),12(everyone),61(localaccounts)
```

### `clear`
Limpa o terminal.

### `reset`
Reinicia o terminal (recarrega a página).

### `sudo -i`
Eleva os privilégios para o modo **ROOT** (modo administrador).

### `github`
Abre o perfil do GitHub em uma nova aba.

### `linkedin`
Abre o perfil do LinkedIn em uma nova aba.

---

## 🏗️ Modo Root (`root@MacBook-Pro ~ #`)

Acesso via `sudo -i`. O prompt muda para vermelho e são desbloqueados o VFS e os scripts NPM.

---

### 📂 Navegação VFS

| Comando         | Descrição                                                |
| :-------------- | :------------------------------------------------------- |
| `ls`            | Listar arquivos do diretório atual                       |
| `ls [caminho]`  | Listar conteúdo de um diretório específico               |
| `cd [caminho]`  | Mudar de diretório (suporta `..` e `~`)                  |
| `pwd`           | Exibir o caminho completo do diretório atual             |
| `cat [arquivo]` | Ler o conteúdo de um arquivo `.md` (navega para a seção) |

**Estrutura do VFS:**
```
/
├── Applications/
├── Users/
│   └── mateus/
│       ├── about.md
│       ├── skills.md
│       ├── projects.md
│       ├── experience.md
│       ├── education.md
│       └── contact.md
└── var/
    └── root/
        ├── .zshrc
        └── .ssh/
```

---

### 🚀 Scripts NPM

> **Requer `npm run dev` antes de navegar pelas seções em modo root.**

| Comando               | Descrição                               |
| :-------------------- | :-------------------------------------- |
| `npm run dev`         | Inicia o servidor de desenvolvimento    |
| `npm run sobre`       | Navega para a seção Sobre               |
| `npm run habilidades` | Navega para a seção Habilidades         |
| `npm run projetos`    | Navega para a seção Projetos            |
| `npm run contato`     | Navega para a seção Contato             |
| `npm run formacao`    | Navega para a seção Formação            |
| `npm run experiencia` | Navega para a seção Experiência         |

---

### 🔧 Ferramentas de Sistema

| Comando         | Descrição                                                   |
| :-------------- | :---------------------------------------------------------- |
| `neofetch`      | Resumo técnico do sistema (uptime, shell, resolução...)     |
| `system`        | Alias para `neofetch`                                       |
| `omz`           | Instalar visualmente o pacote Oh My Zsh                     |
| `whoami`        | Exibe `root` (comportamento Unix real)                      |
| `id`            | Exibe `uid=0(root) gid=0(wheel) groups=...` (formato real)  |
| `lang [en\|pt]` | Alterar idioma do sistema                                   |
| `clear`         | Limpar o terminal                                           |
| `exit`          | Encerrar sessão root e retornar ao modo usuário             |
| `github`        | Abre o perfil no GitHub                                     |
| `linkedin`      | Abre o perfil no LinkedIn                                   |

---

## 🎨 Guia de Estilo (ZSH Theme)

| Elemento           | Cor                     | Finalidade                            |
| :----------------- | :---------------------- | :------------------------------------ |
| Comandos válidos   | Verde `#28C840`         | Feedback imediato de sintaxe correta  |
| Comandos inválidos | Vermelho `#FF3B30`      | Alerta de erro de digitação          |
| Dicas de sistema   | `text-gray-500`         | Instruções e descrições               |
| Prompt Root        | Vermelho `text-red-500` | Indica privilégios de administrador   |
| Prompt Usuário     | Índigo `text-indigo-400`| Modo padrão                           |
| Títulos ROOT help  | Vermelho `text-red-500` | Categorias do help em modo root       |

---

*Manual técnico atualizado em 17 de Abril de 2026 por Mateus Alves.*
