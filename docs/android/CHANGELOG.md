# Changelog — DeepSeek Harness Android Port

## android-bionic (initial port)

- Adapted `koffi@3.1.1` for Android/Bionic (`lib/native/base/base.cc`):
  - `spawn.h` guarded off on Android
  - `statx` replaced by `fstatat` on Android
  - process creation via `fork()` + `dup2()` + `execve()` + `_exit()`
  - `posix_spawn` preserved for Linux
  - preprocessor-validated and compiled for `android_arm64`
- Compiled `node-pty` for Android arm64; artifact at `prebuilds/pty.node`
- Resolved `sharp` via `@img/sharp-wasm32` (`--ignore-scripts`)
- Fixed `directory-picker` resolution with manual
  `node_modules/@deepseek-ai/dsh-client-ui-directory-picker-browse` symlink
- Documented `--expose-internals` requirement for HMR / `dsh web`
- Added full `docs/android/` documentation and root `README.md`
