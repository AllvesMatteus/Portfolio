#  Manual Técnico de Substituição e Fidelidade macOS — MateusOS v2.5

Este documento é o **guia definitivo e exaustivo** de especificação técnica para tornar o terminal do portfólio (**MateusOS**) 100% fiel a um sistema macOS real rodando em um MacBook Pro (ZSH nativo), com separação estrita de privilégios entre **Modo Normal** (Usuário Comum) e **Modo Root** (Engenharia para Devs).

---

## 📐 1. Arquitetura do Sistema e Modos de Operação

O terminal opera sob a experiência do shell ZSH nativo do macOS em uma estrutura de **VFS (Virtual File System)** simulada via JavaScript no frontend, estritamente dividida em dois níveis de privilégio:

### 1️⃣ Modo Usuário Padrão (`mateus@MacBook-Pro ~ %`) — Visitantes Comuns
- **Diretório Base:** `/Users/mateus`
- **Prompt:** `mateus@MacBook-Pro ~ %` (Theme ZSH Padrão)
- **Foco de Uso:** Navegação simples pelas seções do portfólio.
- **Comandos Permitidos:** `open`, `cat`, `ls`, `pwd`, `whoami`, `pbcopy`, `clear`, `exit`, `reset`, `man intro`, `date`, `uptime`, `sudo -i`.
- **Restrições:** Tentativas de acessar diretórios do sistema (`/var/root`, `/etc`) ou comandos avançados geram aviso de permissão negada:
  ```text
  zsh: permission denied: [comando]
  # Dica: use sudo -i para acessar ferramentas de engenharia.
  ```
- **Manual Oficial:** Ao digitar `man intro`, `man` ou `help`, exibe estritamente a lista de navegação simples e a instrução destacada para elevar privilégios via `sudo -i`.

### 2️⃣ Modo Engenharia / Superusuário (`root@MacBook-Pro ~ #`) — Desenvolvedores
- **Diretório Base:** `/var/root`
- **Prompt:** `root@MacBook-Pro ~ #` (Theme ZSH Root Vermelho)
- **Acesso:** Desbloqueado via `sudo -i`, `sudo -s` ou `sudo su` (com aviso de segurança *Sudo Lecture* e senha invisível *No Echo*).
- **Foco de Uso:** Desenvolvedores de verdade que querem explorar a arquitetura e ferramentas do desenvolvedor.
- **Comandos Desbloqueados:** Todos os do modo básico + `system_profiler`, `defaults`, `caffeinate`, `git log`, `cat /etc/hosts`, `cat ~/.ssh/id_ed25519.pub`, `tail -f /var/log/system.log`, `npm run dev` e acesso irrestrito a todo o VFS.
- **Manual Oficial:** Ao digitar `man` ou `help` no modo root, exibe a suíte completa de engenharia.

---

## 📊 2. Tabela Geral de Substituições e Nível de Acesso

| Comando | Nível de Acesso | O que faz no Mac Real | Como está no Site Atual | Como Deve Ser Substituído | Como Deve Ser Exibido (Saída) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `open` | Modo Normal & Root | Abre arquivos, pastas e URLs | Navega apenas por palavras soltas | Exigir extensão (`open about.md`) ou URLs | Ação gráfica ou link em nova aba |
| `cat` | Modo Normal & Root | Lê conteúdo de arquivos texto | Navega para seções da GUI | Exibir texto puro de arquivos do VFS | Conteúdo textual do arquivo |
| `ls` / `ls -la` | Modo Normal & Root | Lista arquivos e diretórios | Lista simples sem flags | Adicionar suporte a `-la`, `-l`, `-a` | Lista detalhada com permissões BSD |
| `pwd` | Modo Normal & Root | Exibe o diretório atual | Exibe caminho do VFS | Manter o caminho sem cores | `/Users/mateus` ou `/var/root` |
| `whoami` | Modo Normal & Root | Retorna o usuário ativo | Card visual formatado | Retornar `mateus` (Normal) ou `root` (Root) | String pura do nome do usuário |
| `pbcopy` | Modo Normal & Root | Copia para a área de transferência | Não existia | Copiar e-mail/links para o clipboard real | `[Copied to clipboard!]` |
| `sw_vers` | Modo Normal & Root | Versão do macOS | Tratado só como easter-egg | Retornar ProductName e ProductVersion | Datos nativos de versão |
| `uname -a` | Modo Normal & Root | Informações do Kernel Darwin | Não existia | Adicionar comando `uname -a` | String do Kernel Darwin x86_64 |
| `clear` | Modo Normal & Root | Limpa a tela do terminal | Limpa a div `output` | Manter a limpeza de buffer | Tela limpa imediatamente |
| `exit` / `logout` | Modo Normal & Root | Encerra a sessão | Minimiza/reseta janela | Exibir encerramento no padrão ZSH | `zsh: logout` e `[Process completed]` |
| `reset` | Modo Normal & Root | Reinicia estado do terminal | Dá `location.reload()` | Reiniciar estado sem dar F5 | Animação de boot reiniciada |
| `date` / `uptime` | Modo Normal & Root | Data e tempo de atividade | Não existia | Adicionar utilitários de data/tempo | Data BSD e uptime |
| `sudo -i` | Transição de Modo | Eleva privilégios para root | Pede senha com efeito pulse | Adicionar Sudo Lecture da Apple e senha sem eco | Prompt de senha sem eco e aviso |
| `system_profiler` | **Exclusivo Root** | Relatório de Hardware Apple | neofetch genérico | Relatório de hardware "Sobre Este Mac" | Especificações de CPU, RAM e perfil |
| `defaults` | **Exclusivo Root** | Altera configurações do Mac | Não existia | Alterar preferências de tema/idioma | `System preference updated.` |
| `caffeinate` | **Exclusivo Root** | Previne hibernação | Não existia | Easter-egg de energia/cafeína | Mensagem temática de cafeína |
| `git log` | **Exclusivo Root** | Histórico de commits | Não existia | Exibir commits reais do repositório | Lista de commits com hash e datas |
| `cat /etc/hosts` | **Exclusivo Root** | Configuração de rede | Não existia | Exibir hosts de rede simulados | IPs e domínios locais |
| `tail -f system.log` | **Exclusivo Root** | Log de sistema em tempo real | Não existia | Exibir stream de logs do servidor | Log contínuo de inicialização |

---

## 🛠️ 3. Especificação Detalhada por Comando e por Modo

---

### 1. `open`
* **Disponibilidade:** Modo Normal & Modo Root
* **O que faz no Mac Real:** Abre arquivos no app padrão, diretórios no Finder ou URLs no navegador.
* **Comportamento no Modo Normal (`mateus@MacBook-Pro ~ %`):**
  - `open about.md` (ou `contact.md`, `projects.md`, `skills.md`, `experience.md`, `education.md`) ➔ Abre visualmente a seção correspondente no portfólio.
  - `open https://github.com/AllvesMatteus` ➔ Abre o link em nova aba no navegador.
  - `open .` ➔ Minimiza o terminal e abre a interface gráfica (GUI).
* **Comportamento no Modo Root (`root@MacBook-Pro ~ #`):**
  - Permite abrir também arquivos de sistema e scripts de desenvolvimento (`open -a TextEdit /etc/hosts`).

---

### 2. `cat`
* **Disponibilidade:** Modo Normal & Modo Root (com restrição de VFS no Modo Normal)
* **O que faz no Mac Real:** Lê e exibe o conteúdo textual de um arquivo no stdout.
* **Comportamento no Modo Normal (`mateus@MacBook-Pro ~ %`):**
  - Permite ler os arquivos de perfil do usuário (`cat about.md`, `cat contact.md`).
  - Se tentar ler arquivos protegidos do root (`cat /var/root/.ssh/id_ed25519.pub` ou `cat /etc/hosts`):
    ```text
    cat: /var/root/.ssh/id_ed25519.pub: Permission denied
    # Dica: use sudo -i para elevar privilégios.
    ```
* **Comportamento no Modo Root (`root@MacBook-Pro ~ #`):**
  - Lê qualquer arquivo do VFS livremente (ex: `cat /etc/hosts`, `cat /var/root/.ssh/id_ed25519.pub`).

---

### 3. `ls` / `ls -la`
* **Disponibilidade:** Modo Normal & Modo Root (com restrição de VFS no Modo Normal)
* **O que faz no Mac Real:** Lista arquivos e diretórios aceitando flags BSD (`-l`, `-a`, `-la`).
* **Comportamento no Modo Normal (`mateus@MacBook-Pro ~ %`):**
  - Em `/Users/mateus`, lista os 6 arquivos de perfil (`about.md`, `skills.md`, etc.).
  - Se tentar `ls /var/root`:
    ```text
    ls: /var/root: Permission denied
    ```
* **Comportamento no Modo Root (`root@MacBook-Pro ~ #`):**
  - Lista qualquer pasta do sistema (`/var/root`, `/etc`, `/System`, `/Applications`). Exibe arquivos ocultos (`.zshrc`, `.ssh`) ao usar `ls -la`.

---

### 4. `pwd`
* **Disponibilidade:** Modo Normal & Modo Root
* **O que faz no Mac Real:** Exibe o caminho absoluto do diretório atual.
* **Comportamento no Modo Normal:** Retorna `/Users/mateus` (ou subpastas).
* **Comportamento no Modo Root:** Retorna `/var/root` (ou subpastas do sistema).

---

### 5. `whoami`
* **Disponibilidade:** Modo Normal & Modo Root
* **O que faz no Mac Real:** Retorna a string pura do usuário ativo.
* **Comportamento no Modo Normal:** Retorna `mateus`. Se usado `whoami --verbose`, mostra o card de perfil.
* **Comportamento no Modo Root:** Retorna `root`.

---

### 6. `pbcopy` / `pbpaste`
* **Disponibilidade:** Modo Normal & Modo Root
* **O que faz no Mac Real:** Copia/cola dados para a área de transferência nativa.
* **Comportamento no Modo Normal & Root:**
  - `pbcopy email` ➔ Copia `allves.matteus@hotmail.com` para a área de transferência do visitante.
  - `pbcopy linkedin` ➔ Copia o link do LinkedIn.
  - Retorno: `[OK] Item copied to system clipboard.`

---

### 7. `sudo -i` / `sudo su` (A Transição de Modo)
* **Disponibilidade:** Executável no Modo Normal para transicionar ao Modo Root.
* **O que faz no Mac Real:** Eleva os privilégios do usuário para superusuário `root`.
* **Fluxo de Execução:**
  1. Exibe a mensagem de aviso oficial da Apple (*Sudo Lecture*).
  2. Solicita a senha no prompt `Password:` com digitação sem eco (invisível).
  3. Ao confirmar, altera o prompt para `root@MacBook-Pro ~ #` (em vermelho) e altera a pasta atual para `/var/root`.

---

### 8. `system_profiler` (Relatório "Sobre Este Mac")
* **Disponibilidade:** Exclusivo do Modo Root (Engenharia)
* **Comportamento no Modo Normal:**
  ```text
  zsh: permission denied: system_profiler
  # Dica: use sudo -i para acessar ferramentas de engenharia.
  ```
* **Comportamento no Modo Root:**
  Exibe o relatório técnico completo de hardware e perfil profissional do desenvolvedor.

---

### 9. `defaults` (Gerenciador de Preferências)
* **Disponibilidade:** Exclusivo do Modo Root (Engenharia)
* **Comportamento no Modo Normal:**
  ```text
  zsh: permission denied: defaults
  # Dica: use sudo -i para acessar ferramentas de engenharia.
  ```
* **Comportamento no Modo Root:**
  - `defaults write com.apple.Theme Dark` ➔ Alterna o tema visual do portfólio.

---

### 10. `caffeinate` (Prevenção de Repouso)
* **Disponibilidade:** Exclusivo do Modo Root (Engenharia)
* **Comportamento no Modo Normal:**
  ```text
  zsh: permission denied: caffeinate
  # Dica: use sudo -i para acessar ferramentas de engenharia.
  ```
* **Comportamento no Modo Root:**
  Exibe o easter-egg temático de energia e cafeína.

---

### 11. `git log`
* **Disponibilidade:** Exclusivo do Modo Root (Engenharia)
* **Comportamento no Modo Normal:**
  ```text
  zsh: permission denied: git
  # Dica: use sudo -i para acessar ferramentas de engenharia.
  ```
* **Comportamento no Modo Root:**
  Exibe o histórico de commits do repositório do portfólio.

---

### 12. `man intro` / `man` (Página de Manual Contextual)
* **Disponibilidade:** Modo Normal & Modo Root (com saídas diferentes para cada modo)
* **Saída no Modo Normal (`man intro`):**
```text
INTRO(1)                 BSD General Commands Manual                INTRO(1)

NAME
     intro — Introdução aos comandos básicos do MateusOS (macOS ZSH)

DESCRIPTION
     O MateusOS simula o terminal nativo ZSH do macOS. O modo usuário permite
     a navegação básica pelas seções do portfólio de Mateus Alves.

BASIC COMMANDS (Modo Normal)
     open [arquivo.md]  Abre seções do portfólio (ex: open about.md).
     cat [arquivo.md]   Exibe o conteúdo texto de um arquivo.
     ls [-la]           Lista arquivos do diretório atual.
     pwd                Exibe o caminho do diretório atual.
     whoami             Exibe o nome do usuário ativo.
     pbcopy [item]      Copia e-mail/links para a área de transferência.
     clear              Limpa o buffer do terminal.
     exit               Encerra a sessão do terminal.

ELEVATED PRIVILEGES (Modo Engenharia / Devs)
     sudo -i            Eleva privilégios para modo ROOT e desbloqueia
                        ferramentas avançadas (git log, system_profiler,
                        defaults, caffeinate, logs do servidor e VFS completo).

MateusOS v2.5                  August 20, 2026                 INTRO(1)
```

* **Saída no Modo Root (`man` no modo superusuário):**
```text
MAN(1)                   BSD General Commands Manual                  MAN(1)

NAME
     root-tools — Ferramentas de Engenharia & Admin (Root Mode)

ADVANCED COMMANDS
     git log            Histórico real de commits do projeto.
     system_profiler    Relatório completo de hardware "Sobre Este Mac".
     defaults write     Altera preferências do sistema (temas/idiomas).
     caffeinate         Evita repouso do sistema e injeta energia.
     cat /etc/hosts     Arquivo de configuração de rede local.
     cat ~/.ssh/*.pub   Chave pública SSH demonstrativa.
     tail -f system.log Visualizador de logs de servidor em tempo real.
     npm run dev        Servidor simulado de desenvolvimento.

MateusOS v2.5 (ROOT)           August 20, 2026                   MAN(1)
```

---

## 🎯 4. Conclusão da Especificação

Este manual estabelece a **separação estrita e explicativa por modo de acesso**, garantindo que o visitante comum tenha uma navegação simples e intuitiva pelo portfólio, enquanto o desenvolvedor que acionar o `sudo -i` desbloqueie um terminal completo de engenharia.
