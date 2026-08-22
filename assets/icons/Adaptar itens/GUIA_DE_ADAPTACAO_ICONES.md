# 🎨 Guia de Adaptação de Ícones Nativos do macOS

Este documento detalha **quais ícones devem ser convertidos para PNG** (com seus respectivos nomes organizados e onde devem ser usados no projeto), além de listar os arquivos desnecessários que podem ser descartados.

---

## 📌 Sumário
1. [⚙️ Ícones para o Ajustes do Sistema (Settings)](#1-⚙️-ícones-para-o-ajustes-do-sistema-settings)
2. [📁 Ícones para o Finder e Mesa (Desktop)](#2-📁-ícones-para-o-finder-e-mesa-desktop)
3. [💻 Ícones de Dispositivos e Hardware](#3-💻-ícones-de-dispositivos-e-hardware)
4. [🛠️ Utilitários do Sistema e Apps](#4-🛠️-utilitários-do-sistema-e-apps)
5. [🚫 Arquivos Desnecessários (Pode Descartar/Ignorar)](#5-🚫-arquivos-desnecessários-pode-descartarignorar)
6. [💡 Como Converter `.icns` para `.png` no macOS (Terminal)](#6-💡-como-converter-icns-para-png-no-macos-terminal)

---

## 1. ⚙️ Ícones para o Ajustes do Sistema (Settings)

Estes ícones são ideais para a barra lateral do **Ajustes do Sistema** (`settings.js` / `patch.css`) e seus respectivos cards internos:

| Arquivo de Origem | Sugestão de Nome PNG | Onde Usar no Sistema |
| :--- | :--- | :--- |
| `Pacote icones 01/Screen Time.app/.../AppIcon.icns` | `settings-screentime.png` | Ajustes > **Tempo de Uso** |
| `Pacote icones 01/Spotlight.app/.../AppIcon.icns` | `settings-spotlight.png` | Ajustes > **Spotlight** |
| `Pacote icones 01/Siri.app/.../AppIcon.icns` | `settings-siri.png` | Ajustes > **Siri** |
| `Pacote icones 01/Batteries.app/.../AppIcon.icns` | `settings-bateria.png` | Ajustes > **Bateria** |
| `Pacote icones 01/Game Center.app/.../AppIcon.icns` | `settings-gamecenter.png` | Ajustes > **Game Center** |
| `Pacote icones 01/VoiceOver.app/.../VoiceOver.icns` | `settings-acessibilidade.png` | Ajustes > **Acessibilidade** |
| `Pacote icones 01/ScreenSaverEngine.app/.../AppIcon.icns` | `settings-screensaver.png` | Ajustes > **Protetor de Tela** |
| `Pacote icones 01/Dock.app/.../Dock.icns` | `settings-dock.png` | Ajustes > **Mesa e Dock** |
| `Pacote icones 01/ControlCenter.app/.../AppIcon.icns` | `settings-controlcenter.png` | Ajustes > **Central de Controle** |
| `Pacote icones 01/iCloud+.app/.../AppIcon.icns` | `settings-icloud.png` | Ajustes > **Conta Apple / iCloud** |
| `Pacote icones 02/Notifications.icns` | `settings-notificacoes.png` | Ajustes > **Notificações** |
| `Pacote icones 02/GenericTimeMachineDiskIcon.icns` | `settings-timemachine.png` | Ajustes > Geral > **Time Machine** |
| `Pacote icones 02/UsersFolderIcon.icns` ou `Accounts.icns` | `settings-usuarios.png` | Ajustes > **Usuários e Grupos** |
| `Pacote icones 02/FileVaultIcon.icns` | `settings-privacidade.png` | Ajustes > **Privacidade e Segurança** |
| `Pacote icones 02/SidebarDisplay.icns` ou `com.apple.studio-display.icns` | `settings-telas.png` | Ajustes > **Telas** |
| `Pacote icones 02/SidebarInternalDisk.icns` | `settings-armazenamento.png` | Ajustes > Geral > **Armazenamento** |
| `Pacote icones 02/GenericSharepoint.icns` | `settings-compartilhamento.png` | Ajustes > Geral > **Compartilhamento** |
| `Pacote icones 02/SidebarAirDrop.icns` ou `AirDrop.icns` | `settings-airdrop.png` | Ajustes > Geral > **AirDrop e Handoff** |
| `Pacote icones 01/Applications/Keychain Access.app/.../AppIcon.icns` | `settings-senhas.png` | Ajustes > Geral > **Senhas** |
| `Pacote icones 01/Software Update.app/.../SoftwareUpdate.icns` | `settings-atualizacao.png` | Ajustes > Geral > **Atualização de Software** |
| `Pacote icones 01/AddPrinter.app/.../Printer.icns` | `settings-impressoras.png` | Ajustes > **Impressoras e Scanners** |

---

## 2. 📁 Ícones para o Finder e Mesa (Desktop)

Essenciais para o sistema de arquivos virtual do Finder, ícones da Mesa e Lixeira:

| Arquivo de Origem | Sugestão de Nome PNG | Onde Usar no Sistema |
| :--- | :--- | :--- |
| `Pacote icones 02/FinderIcon.icns` | `finder.png` | Dock e Janelas do Finder |
| `Pacote icones 02/TrashIcon.icns` | `trash-empty.png` | Dock (Lixeira vazia) |
| `Pacote icones 02/FullTrashIcon.icns` | `trash-full.png` | Dock (Lixeira cheia) |
| `Pacote icones 02/GenericFolderIcon.icns` | `folder.png` | Pastas comuns do Finder/Mesa |
| `Pacote icones 02/OpenFolderIcon.icns` | `folder-open.png` | Pastas abertas / estado ativo |
| `Pacote icones 02/DocumentsFolderIcon.icns` | `folder-documentos.png` | Pasta Documentos |
| `Pacote icones 02/DownloadsFolder.icns` | `folder-downloads.png` | Pasta Downloads |
| `Pacote icones 02/DesktopFolderIcon.icns` | `folder-mesa.png` | Pasta Mesa (Desktop) |
| `Pacote icones 02/DeveloperFolderIcon.icns` | `folder-developer.png` | Pasta Developer |
| `Pacote icones 02/PicturesFolderIcon.icns` | `folder-imagens.png` | Pasta Imagens |
| `Pacote icones 02/MusicFolderIcon.icns` | `folder-musica.png` | Pasta Música |
| `Pacote icones 02/MovieFolderIcon.icns` | `folder-filmes.png` | Pasta Filmes |
| `Pacote icones 02/PublicFolderIcon.icns` | `folder-publica.png` | Pasta Pública |
| `Pacote icones 02/ApplicationsFolderIcon.icns` | `folder-aplicativos.png` | Pasta Aplicativos |
| `Pacote icones 02/UtilitiesFolder.icns` | `folder-utilitarios.png` | Pasta Utilitários |
| `Pacote icones 02/SmartFolderIcon.icns` | `folder-smart.png` | Pasta Inteligente |
| `Pacote icones 02/GenericDocumentIcon.icns` | `doc-generic.png` | Arquivos de texto / documentos gerais |
| `Pacote icones 02/DiskImageMounter.app/.../diskimage.icns` | `file-dmg.png` | Arquivos `.dmg` (Downloads) |
| `Pacote icones 02/CDAudioVolumeIcon.icns` ou `ClippingSound.icns` | `file-audio.png` | Arquivos `.mp3` / áudio |
| `Pacote icones 02/ClippingPicture.icns` | `file-image.png` | Arquivos de imagem `.jpg` / `.png` |
| `Pacote icones 02/ExecutableBinaryIcon.icns` | `file-binary.png` | Arquivos executáveis / scripts |

---

## 3. 💻 Ícones de Dispositivos e Hardware

Perfeitos para "Sobre Este Mac", AirDrop, Rede e widgets:

| Arquivo de Origem | Sugestão de Nome PNG | Onde Usar no Sistema |
| :--- | :--- | :--- |
| `Pacote icones 02/com.apple.macbookpro-14-2021-space-gray.icns` | `device-macbook-pro.png` | Sobre Este Mac / Ajustes > Geral |
| `Pacote icones 02/com.apple.macbookair-13-2022-midnight.icns` | `device-macbook-air.png` | Hardware MacBook Air |
| `Pacote icones 02/com.apple.imac-2021-silver.icns` | `device-imac.png` | Hardware iMac |
| `Pacote icones 02/com.apple.macstudio.icns` | `device-mac-studio.png` | Hardware Mac Studio |
| `Pacote icones 02/com.apple.macmini-2020.icns` | `device-mac-mini.png` | Hardware Mac mini |
| `Pacote icones 02/com.apple.studio-display.icns` | `device-studio-display.png` | Monitores / Ajustes > Telas |
| `Pacote icones 02/com.apple.iphone-x-1.icns` | `device-iphone.png` | iPhone (AirDrop / Ajustes Wi-Fi) |
| `Pacote icones 02/com.apple.ipad.icns` | `device-ipad.png` | iPad (AirDrop / Sidecar) |
| `Pacote icones 02/com.apple.apple-tv.icns` | `device-appletv.png` | Apple TV / AirPlay |

---

## 4. 🛠️ Utilitários do Sistema e Apps

Ícones para apps e utilitários que podem ser abertos no sistema ou listados no Launchpad/Finder:

| Arquivo de Origem | Sugestão de Nome PNG | Onde Usar no Sistema |
| :--- | :--- | :--- |
| `Pacote icones 01/Applications/Archive Utility.app/.../ArchiveUtility.icns` | `app-archive-utility.png` | Utilitário de Compressão |
| `Pacote icones 01/Applications/Feedback Assistant.app/.../AppIcon.icns` | `app-feedback-assistant.png` | Feedback Assistant |
| `Pacote icones 01/Applications/Wireless Diagnostics.app/.../AppIcon.icns` | `app-wireless-diagnostics.png` | Diagnóstico de Rede sem Fio |
| `Pacote icones 01/Certificate Assistant.app/.../AppIcon.icns` | `app-certificate-assistant.png` | Assistente de Certificados |
| `Pacote icones 01/Automator Installer.app/.../AppIcon.icns` | `app-automator.png` | Automator |

---

## 5. 🚫 Arquivos Desnecessários (Pode Descartar/Ignorar)

Estes arquivos contêm modelos legados dos anos 1999–2010, arquivos de localização ou binários que **não são necessários** no projeto web:

1. **Dispositivos Obsoletos (Pacote 02)**:
   - `com.apple.powerbook-*` (PowerBook G4 12", 15", 17", Titanium)
   - `com.apple.powermac-g4-*` (Graphite, QuickSilver, Mirrored Drive Doors)
   - `com.apple.ibook-g4-*`
   - `com.apple.imac-g4-*`, `com.apple.imac-g5-*`, `com.apple.emac.icns`
   - `com.apple.iphone-3g.icns`, `com.apple.iphone-4-*`, `com.apple.iphone-7-*`, `com.apple.iphone-8-*`
   - `com.apple.ipod-touch-*`
   - `com.apple.xserve-*`
2. **Arquivos de Sistema / Localização**:
   - Todas as pastas de idioma: `ar.lproj`, `de.lproj`, `es.lproj`, `fr.lproj`, `pt_BR.lproj`, `zh_CN.lproj`, etc.
   - Arquivos `.loctable`, `.plist`, `.bin`, `.csdb`, `.mlmodelc`, `.bundle` sem ícones visuais.
3. **Imagens de clipping / miniaturas antigas**:
   - `ClippingUnknown.icns`, `ToolbarCustomizeIcon.icns` antigo, `iDiskGenericIcon.icns` (serviço descontinuado iDisk).

---

## 6. 💡 Como Converter `.icns` para `.png` no macOS (Terminal)

No terminal do seu Mac, você pode converter qualquer `.icns` para `.png` em resolução máxima (512x512 ou 1024x1024) com um único comando nativo do macOS usando o utilitário `sips`:

```bash
# Exemplo para converter um único ícone:
sips -s format png "DesktopFolderIcon.icns" --out "folder-mesa.png"

# Exemplo para converter todos os .icns de uma pasta para .png de uma vez:
for f in *.icns; do
  sips -s format png "$f" --out "${f%.icns}.png"
done
```

> **Dica:** Os PNGs convertidos podem ser salvos diretamente na pasta `assets/icons/` do projeto para uso imediato em `settings.js`, `finder.js` e `desktop.js`.
