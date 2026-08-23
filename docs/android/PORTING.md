# Porting — how the upstream was adapted to Android/Bionic

## 1. Overview

The upstream DeepSeek Harness targets Linux. On Android/Termux (Bionic libc) several
native assumptions break. This port adapts only what is necessary and keeps the
Linux code paths intact behind preprocessor guards.

## 2. Linux APIs that do not work directly on Android

- `statx` — not available / behaves differently under Bionic.
- `posix_spawn` — kept for Linux; not relied upon on Android.
- Native `sharp` (libvips) — not buildable cleanly on Termux without heavy patching.
- Some Linux-native prebuilt packages (`native/landlock-run/packages/linux-arm64`,
  `linux-x64`) emit warnings and are skipped.

## 3. `statx` handling

In `patches/koffi@3.1.1/lib/native/base/base.cc` the `statx`-based code path is
guarded so it is not compiled/used on Android. The Android implementation uses
`fstatat` instead for file metadata queries.

Reference (confirmed in `base.cc`):

```cpp
struct stat sb;
if (fstatat(fd, pathname, &sb, stat_flags) < 0) { ... }
```

and for directory enumeration:

```cpp
if (fstatat(dirfd(dirp), dent->d_name, &sb, AT_SYMLINK_NOFOLLOW) < 0) { ... }
```

## 4. `posix_spawn` handling

`posix_spawn` is preserved for the Linux build via `#if ... #else ... #endif`
guards. On Android the spawn path is implemented with the lower-level primitives
below.

## 5. `fork` + `execve` on Android

The Android process-creation path uses the classic UNIX primitives instead of
`posix_spawn`:

```cpp
// inside the Android branch of RunProcess / similar
const char *argv[] = { "sh", "-c", cmd_line, nullptr };
execve("/system/bin/sh", const_cast<char **>(argv),
       new_env.ptr ? new_env.ptr : environ);
_exit(127);
```

with `fork()` / `dup2()` used to set up the child file descriptors before `execve`.
`spawn.h` usage is protected so it is not pulled in on Android.

## 6. Koffi compilation

Koffi `3.1.1` was patched (see `KOFFI.md`) and compiled for `android_arm64` with
the Termux toolchain. The build output is in
`patches/koffi@3.1.1/build/koffi/android_arm64/`. Validation was done with the
preprocessor (`clang -E -P`) before the final compile.

## 7. node-pty compilation

`node-pty` was compiled for Android arm64 and the resulting `pty.node` was placed at
`prebuilds/pty.node` (committed). Build used:

```bash
ANDROID_NDK_HOME=$PREFIX
npm_config_android_ndk_path=$PREFIX
```

plus the Termux Android build configuration. The prebuild must be preserved.

## 8. Where `pty.node` lives

```
prebuilds/pty.node      (ELF 64-bit LSB shared object, ARM aarch64)
```

Originally referenced as `prebuilds/android-arm64/pty.node` in the port notes; in
this repo it is committed at `prebuilds/pty.node`.

## 9. Sharp resolved via WASM

Instead of the native (libvips) build, `@img/sharp-wasm32` is used:

```bash
pnpm add -w @img/sharp-wasm32 --ignore-scripts
```

This avoids the native compilation problem entirely.

## 10. Why some Linux-native packages warn

Packages like `native/landlock-run/packages/linux-arm64` and `linux-x64` are
platform-specific Linux prebuilds. On Android they cannot be used, so pnpm warns.
These warnings are **expected limitations** of the Android runtime, not modifications
to be removed.

## 11. directory-picker problem diagnosis

The workspace `packages/client/ui-directory-picker-browse` declares the package
`@deepseek-ai/dsh-client-ui-directory-picker-browse`, but pnpm did not create the
expected symlink under `node_modules/@deepseek-ai/`. The `package.json` is correct
and the workspace is recognized by pnpm.

## 12. Why the symlink was necessary

To make the package resolvable at runtime, a manual symlink was created:

```
node_modules/@deepseek-ai/dsh-client-ui-directory-picker-browse
  -> ../../packages/client/ui-directory-picker-browse
```

This is a workspace-linking workaround, not an architectural change, and must be
preserved. (When committing from a clean copy, the package source under
`packages/client/ui-directory-picker-browse` is versioned; the symlink itself is a
runtime fix applied on the device.)

## 13. HMR requires `--expose-internals`

Running `pnpm dsh web` surfaced:

```
--expose-internals is required for HMR service
```

`--expose-internals` cannot be passed through `NODE_OPTIONS` on this Node build, so
it is passed on the CLI directly (see `TROUBLESHOOTING.md`).

## 14. How to start the web server (functional command)

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web
```

This starts: `dsh web: http://127.0.0.1:3080`

To avoid auto-opening a browser on the device:

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open
```

## 15. How to open the workspace

In Termux, start the server (command above) and open
`http://127.0.0.1:3080` in the Android browser.

## 16. Android-specific parts

- Koffi `base.cc` Android branch (`fstatat`, `fork`/`dup2`/`execve`/`_exit`,
  `spawn.h` guarded).
- `prebuilds/pty.node` (Android arm64).
- `@img/sharp-wasm32` instead of native sharp.
- `--expose-internals` CLI flag requirement.
- Manual `node_modules/@deepseek-ai/...` symlink for directory-picker.

## 17. Linux-compatible parts (kept)

- `posix_spawn` path (guarded for Linux).
- All non-Android code in `base.cc` is unchanged in structure.
- Workspace structure, package sources, and web UI (except the symlink fix).

## 18. Remaining limitations

See `KNOWN-LIMITATIONS.md`.
