# DeepSeek Harness — Android / Termux Port

> **Experimental Android/Termux port** of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) with full native ARM64 compilation and documentation.

This repository holds the changes required to run the DeepSeek Harness ("dsh") web GUI
natively on **Android** through **Termux**, preserving the Linux compatibility that already
existed in the upstream project. It is a fork/port focused on the Android device as the
build and runtime host — not a reimplementation.

«Este port foi desenvolvido, compilado, documentado e commitado diretamente em um dispositivo
Android utilizando Termux e DeepSeek Harness, sem utilização de computador desktop.»

---

## Platform

| Item                | Value                                                      |
|---------------------|------------------------------------------------------------|
| Platform            | Android                                                    |
| Environment         | Termux                                                     |
| Architecture        | ARM64 (`aarch64`)                                          |
| Node.js             | v26.3.0                                                    |
| pnpm                | v11.7.0                                                    |
| Node-PTY prebuild   | `prebuilds/android-arm64/pty.node` → committed as `prebuilds/pty.node` |
| Koffi patch         | `patches/koffi@3.1.1/lib/native/base/base.cc`             |
| Official branch     | `android-bionic`                                           |

---

## Objective

- Run the DeepSeek Harness web GUI (`dsh web`) on an Android phone via Termux.
- Preserve exactly the modifications needed to make the upstream project work on Android/Bionic.
- Keep Linux compatibility wherever possible.

This is **not** a fresh rebuild: existing fixes are preserved, not reverted.

---

## Special dependencies

| Dependency     | Android strategy                                                              |
|----------------|--------------------------------------------------------------------------------|
| `koffi@3.1.1`  | Patched `lib/native/base/base.cc` for Bionic; compiled for `android_arm64`.     |
| `node-pty`     | Compiled for Android arm64; artifact committed at `prebuilds/pty.node`.         |
| `sharp`        | Replaced native build with `@img/sharp-wasm32` (`pnpm add -w @img/sharp-wasm32 --ignore-scripts`). |

---

## Setup / Install

```bash
pkg install nodejs clang make cmake
npm install -g pnpm@11.7.0
pnpm install --ignore-scripts
```

> `pnpm install --ignore-scripts` is required on Android. Some Linux-native
> packages (e.g. `native/landlock-run/packages/linux-arm64`, `linux-x64`) emit
> warnings — these are **expected limitations** of running on Android, not errors.

---

## Build (Android native artifacts)

The native artifacts are already committed; you normally do **not** need to
recompile. To rebuild:

```bash
cd patches/koffi@3.1.1 && cnoke.cjs build   # Koffi for android_arm64
# node-pty: build with
#   ANDROID_NDK_HOME=$PREFIX npm_config_android_ndk_path=$PREFIX
# and place the result at prebuilds/pty.node
```

---

## Run

The web server currently starts with:

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web
```

or, to avoid opening a browser automatically on the device:

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open
```

Server: **http://127.0.0.1:3080**

> `--expose-internals` cannot be passed via `NODE_OPTIONS` on this Node build, so
> it is passed directly on the CLI. See `docs/android/TROUBLESHOOTING.md`.

---

## Known limitations

- `statx` and `posix_spawn` paths are not usable directly on Android/Bionic; the
  port falls back to `fstatat` + `fork`/`dup2`/`execve`/`_exit`.
- Some Linux-native packages emit warnings and are skipped.
- See `docs/android/KNOWN-LIMITATIONS.md`.

---

## Repository layout (this port)

```
README.md
COMMIT_FILES.md                     # exact scope of what is committed
packages/client/ui-directory-picker-browse/   # Android symlink fix target
packages/host/directory-picker-auto/
patches/koffi@3.1.1/                # patched + compiled Koffi for android_arm64
prebuilds/pty.node                  # compiled node-pty for Android arm64
docs/android/                       # full porting documentation
```

---

## Documentation

See [`docs/android/`](docs/android/):

- `README.md` — index of the Android documentation
- `ENVIRONMENT.md` — detected device/runtime facts
- `PORTING.md` — how the upstream was adapted to Bionic
- `KOFFI.md` — Koffi patch & build details
- `NODE-PTY.md` — node-pty compilation details
- `SHARP.md` — WASM sharp resolution
- `TROUBLESHOOTING.md` — HMR, `--expose-internals`, directory-picker symlink
- `BUILD.md` — build commands
- `CHANGELOG.md` — change history of the port
- `FILES-MODIFIED.md` — exact list of modified/added files
- `KNOWN-LIMITATIONS.md` — what is still not fully portable
- `PORTING-REPORT.md` — full technical report
- `COMMIT_HISTORY.md` — commit SHA / author / tool used

---

## License

Inherited from upstream DeepSeek Harness (MIT for the modified packages; see
individual `package.json` / `LICENSE.txt` files).
