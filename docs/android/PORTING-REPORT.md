# Porting Report — DeepSeek Harness on Android / Termux

## Resumo

O DeepSeek Harness foi portado para executar nativamente em Android via Termux,
preservando a compatibilidade Linux. O trabalho consistiu em adaptar o `koffi@3.1.1`
para Bionic, compilar o `node-pty` para arm64, resolver o `sharp` via WASM, corrigir
o linkage do `directory-picker` e documentar todo o estado funcional.

## Descrição completa

O estado atual do projeto (workspace Android) foi consolidado, documentado e
versionado. Nenhuma correção já concluída foi revertida; o objetivo foi preservar,
documentar e versionar — não reconstruir.

## Ambiente

Hardware e software realmente detectados estão em `ENVIRONMENT.md`. Resumo verificável:

- Plataforma: Android / Termux
- Arquitetura: `aarch64` (ARM64)
- Node.js: v26.3.0
- pnpm: v11.7.0
- node-pty: `android-arm64` (ELF aarch64)
- Koffi build: `android_arm64`, Node v26.3.0

## Problemas encontrados

1. `koffi` não compilava em Bionic (dependências Linux, `statx`, `spawn.h`).
2. `node-pty` precisava de build nativo para Android arm64.
3. `sharp` nativo não compilava no Termux.
4. `pnpm dsh web` exigia `--expose-internals`.
5. `directory-picker` não era resolvido (symlink ausente).

## Soluções

1. Patch em `base.cc`: `fstatat`, `fork`/`dup2`/`execve`/`_exit`, `spawn.h` protegido,
   `posix_spawn` preservado para Linux; validado com `clang -E -P` e compilado.
2. `node-pty` compilado com `ANDROID_NDK_HOME=$PREFIX`; artefato em `prebuilds/pty.node`.
3. `sharp` substituído por `@img/sharp-wasm32` (`--ignore-scripts`).
4. `--expose-internals` passado direto na CLI.
5. Symlink manual `node_modules/@deepseek-ai/dsh-client-ui-directory-picker-browse`.

## Arquivos alterados

Ver `FILES-MODIFIED.md` (tabela arquivo / alteração / motivo / impacto).

## Dependências nativas

- **Koffi**: patch + build `android_arm64` (ver `KOFFI.md`).
- **node-pty**: prebuild `prebuilds/pty.node` (ver `NODE-PTY.md`).
- **Sharp**: WASM via `@img/sharp-wasm32` (ver `SHARP.md`).

## Inicialização

Comando funcional:

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web
```

## Resultado

Serviço iniciado em `http://127.0.0.1:3080` e interface web carregada no navegador
Android.

## Limitações

Ver `KNOWN-LIMITATIONS.md`.
