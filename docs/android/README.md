# DeepSeek Harness - Android/Termux Port

## Visão Geral

Este é um fork/port experimental do **DeepSeek Harness** otimizado para execução nativa em dispositivos Android utilizando **Termux**.

O projeto foi **portado, compilado, documentado e commitado diretamente em um dispositivo Android** utilizando Termux e DeepSeek Harness, sem dependência de computador desktop.

### Especificações do Port

| Componente | Versão/Detalhes |
|-----------|-----------------|
| **Plataforma** | Android (ARM64/aarch64) |
| **Ambiente** | Termux |
| **Node.js** | v26.3.0 |
| **pnpm** | v11.7.0 |
| **Arquitetura** | ARM64 (aarch64) |
| **Branch oficial** | `android-bionic` |
| **Workspace** | `/data/data/com.termux/files/home/Projetos/deepseek-harness-android` |

## Objetivo do Port

Transformar o DeepSeek Harness em uma aplicação plenamente funcional no Android/Termux, mantendo:

- ✅ Compatibilidade com o código-fonte original
- ✅ Todas as correções de porta já implementadas
- ✅ Artefatos compilados para ARM64 Android
- ✅ Documentação técnica completa
- ✅ Controle de versão estruturado

## Modificações Realizadas

### 1. **Koffi 3.1.1** - Adaptação Android/Bionic

**Arquivo principal:**
```
node_modules/.pnpm_patches/koffi@3.1.1/lib/native/base/base.cc
```

**Alterações históricas:**
- Remoção/isolamento de dependências incompatíveis com Android
- Proteção de `spawn.h` para exclusão no Android
- Implementação Android usando `fstatat` em vez de `statx`
- Substituição de caminhos incompatíveis com `statx`
- Implementação de criação/execução de processos usando:
  - `fork()`
  - `dup2()`
  - `execve()`
  - `_exit()`
- Preservação de `posix_spawn` para Linux
- Correções de `#if`, `#else`, `#endif`
- Validação com pré-processador `clang -E -P`
- Compilação bem-sucedida no Android

### 2. **node-pty** - Prebuilt Compilado para Android

**Artefato compilado:**
```
prebuilds/android-arm64/pty.node
```

**Configuração de compilação:**
- Variáveis: `ANDROID_NDK_HOME=$PREFIX`
- Variáveis: `npm_config_android_ndk_path=$PREFIX`
- Build Android nativo para Termux
- Artefato funcional e preservado

### 3. **Sharp** - Resolução via WASM

**Solução implementada:**
```bash
pnpm add -w @img/sharp-wasm32 --ignore-scripts
```

**Razão:** Sharp não compila nativamente no Android. A versão WASM funciona corretamente.

### 4. **Directory Picker Workspace** - Link Manual

**Problema:** O workspace `packages/client/ui-directory-picker-browse` não foi linkado automaticamente pelo PNPM.

**Solução:**
```bash
# Link manual criado
node_modules/@deepseek-ai/dsh-client-ui-directory-picker-browse → ../../packages/client/ui-directory-picker-browse
```

**Status:** Preservado e documentado para diagnóstico futuro.

### 5. **HMR / expose-internals** - Requisito Node Android

**Problema:** Servidor HMR exigia `--expose-internals`, mas não podia ser passado em `NODE_OPTIONS`.

**Solução funcional:**
```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web
```

**Resultado:** Servidor iniciado em `http://127.0.0.1:3080` com interface web carregando corretamente.

## Arquivos a Incluir no Git

```
packages/client/ui-directory-picker-browse/**
packages/host/directory-picker-auto/**
docs/android/**
README.md
node_modules/.pnpm_patches/koffi@3.1.1/lib/native/base/base.cc
prebuilds/android-arm64/pty.node
```

## Arquivos a Excluir do Git

```
node_modules/          # Dependências instaladas
.pnpm-store/          # Cache pnpm
.dsh/                 # Cache DSH
dist/                 # Artefatos compilados
.tmp/                 # Arquivos temporários
*.log                 # Logs
.env                  # Segredos
```

## Como Iniciar o Servidor

### Comando Funcional

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web
```

### Sem Abrir Navegador (CI/CD)

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open
```

### Acessar a Interface

- **URL:** `http://127.0.0.1:3080`
- **Ambiente:** Abrir em navegador Android após execução

## Instalação e Build

### Pré-requisitos

- Android 7.0+
- Termux instalado
- Node.js v26.3.0+
- pnpm v11.7.0+

### Instalação de Dependências

```bash
cd ~/Projetos/deepseek-harness-android
pnpm install --ignore-scripts
```

### Build

```bash
pnpm build
```

## Limitações Conhecidas

### Pacotes Linux-Native

Os seguintes avisos são **esperados e normais** no Android:

```
native/landlock-run/packages/linux-arm64
native/landlock-run/packages/linux-x64
```

Essas limitações não afetam a funcionalidade do port.

### Funcionalidades Restritas

- APIs POSIX específicas do Linux podem não estar disponíveis
- Alguns syscalls exigem adaptação (ex: `statx` → `fstatat`)
- Suporte a processos é limitado (via `fork + execve` em vez de `posix_spawn`)

## Documentação Técnica

Consulte os documentos específicos:

- **[ENVIRONMENT.md](./ENVIRONMENT.md)** - Ambiente detectado e especificações
- **[PORTING.md](./PORTING.md)** - Processo de port completo
- **[KOFFI.md](./KOFFI.md)** - Detalhes de adaptação do Koffi
- **[NODE-PTY.md](./NODE-PTY.md)** - Compilação e uso de node-pty
- **[SHARP.md](./SHARP.md)** - Solução WASM para Sharp
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Resolução de problemas
- **[BUILD.md](./BUILD.md)** - Instruções de build
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de alterações
- **[FILES-MODIFIED.md](./FILES-MODIFIED.md)** - Lista completa de modificações
- **[KNOWN-LIMITATIONS.md](./KNOWN-LIMITATIONS.md)** - Limitações documentadas
- **[PORTING-REPORT.md](./PORTING-REPORT.md)** - Relatório técnico completo
- **[COMMIT_HISTORY.md](./COMMIT_HISTORY.md)** - Histórico de commits

## Contribuindo

Este é um port experimental. Alterações devem:

1. Preservar compatibilidade Android/Termux
2. Incluir testes no ambiente target
3. Documentar modificações em `docs/android/`
4. Não remover soluções já funcionais
5. Seguir convenções de commit: `feat(android):` ou `docs(android):`

## Estado Funcional

✅ **Servidor web funcionando** - Iniciado em `http://127.0.0.1:3080`  
✅ **Interface web carregando** - Navegador Android responsivo  
✅ **Dependências adaptadas** - Koffi, node-pty, Sharp  
✅ **Documentação completa** - Incluída neste repositório  
✅ **Versionamento estruturado** - Branch `android-bionic`

## Licença

Herdada do projeto original DeepSeek Harness.

---

**Desenvolvido, compilado, documentado e commitado em Android (Termux).**
