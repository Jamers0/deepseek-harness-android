# node-pty — Android arm64 compilation

## Artifact

- Compiled `pty.node` (ELF 64-bit LSB shared object, ARM aarch64).
- Committed at: `prebuilds/pty.node`
  (port notes reference `prebuilds/android-arm64/pty.node`).

## Build environment

```bash
ANDROID_NDK_HOME=$PREFIX
npm_config_android_ndk_path=$PREFIX
```

plus the Termux Android build configuration required for native node addons.

## Notes

- This prebuild is functional on the target device and MUST be preserved.
- Do not remove or overwrite it unless recompiling is explicitly required.
