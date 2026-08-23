# Files modified / added (Android port)

## Modified (patch)

| File | Change | Reason | Impact |
|------|--------|--------|--------|
| `patches/koffi@3.1.1/lib/native/base/base.cc` | Android/Bionic adaptation (`fstatat`, `fork`/`execve`, guarded `spawn.h`) | Koffi must run on Android | Enables Koffi native addon on arm64 |

## Added — source / packages

| File | Change | Reason | Impact |
|------|--------|--------|--------|
| `packages/client/ui-directory-picker-browse/**` | Package source (the directory-picker browser) | Preserved from upstream workspace | GUI directory browsing |
| `packages/host/directory-picker-auto/**` | Package source (auto directory-picker resolver) | Preserved from upstream workspace | Directory-picker seam resolution |
| `patches/koffi@3.1.1/**` | Patched Koffi source + `android_arm64` build | Native addon for Android | Koffi loads on arm64 |
| `prebuilds/pty.node` | Compiled node-pty for Android arm64 | Native PTY support | Terminal/PTY works on Android |

## Added — documentation

| File | Purpose |
|------|---------|
| `README.md` | Project + Android port overview |
| `COMMIT_FILES.md` | Exact commit scope |
| `docs/android/README.md` | Docs index |
| `docs/android/ENVIRONMENT.md` | Detected environment |
| `docs/android/PORTING.md` | How upstream was adapted |
| `docs/android/KOFFI.md` | Koffi patch/build |
| `docs/android/NODE-PTY.md` | node-pty build |
| `docs/android/SHARP.md` | WASM sharp |
| `docs/android/TROUBLESHOOTING.md` | HMR, symlink, warnings |
| `docs/android/BUILD.md` | Build commands |
| `docs/android/CHANGELOG.md` | Change history |
| `docs/android/FILES-MODIFIED.md` | This file |
| `docs/android/KNOWN-LIMITATIONS.md` | Remaining limitations |
| `docs/android/PORTING-REPORT.md` | Full technical report |
| `docs/android/COMMIT_HISTORY.md` | Commit metadata |

## Symlinks / artifacts (runtime)

- `node_modules/@deepseek-ai/dsh-client-ui-directory-picker-browse` →
  `../../packages/client/ui-directory-picker-browse` (created on device; the target
  is versioned, the symlink is a runtime fix)
- `patches/koffi@3.1.1/build/koffi/android_arm64/koffi.node` (compiled artifact)

## Excluded (not committed)

`node_modules/`, caches, logs, build caches (outside the committed `build/koffi`),
temporary artifacts, secrets, personal Termux config. See `.gitignore`.
