# Known limitations

- `statx` and `posix_spawn` paths are not used on Android; the port relies on
  `fstatat` + `fork`/`dup2`/`execve`/`_exit`.
- Linux-native prebuilt packages (`native/landlock-run/packages/linux-arm64`,
  `linux-x64`) are skipped and emit warnings under Android — expected.
- Native `sharp` (libvips) is replaced by `@img/sharp-wasm32`; some native-only
  image features may differ.
- `--expose-internals` must be passed on the CLI (not via `NODE_OPTIONS`) on this
  Node build for HMR / `dsh web`.
- The `directory-picker` package requires a manual `node_modules/@deepseek-ai/...`
  symlink after `pnpm install` because pnpm does not create it automatically.
- Exact phone model / chipset / RAM / Android version are not asserted here; only
  verifiable toolchain/artifact facts are recorded (see `ENVIRONMENT.md`).
- Recompiling Koffi / node-pty on a different device or Node/NDK version may require
  re-running the native build steps.
