# Koffi — Android/Bionic patch & build

## Package

- `koffi@3.1.1`
- Patched source: `patches/koffi@3.1.1/lib/native/base/base.cc`
- Compiled build: `patches/koffi@3.1.1/build/koffi/android_arm64/`
  - `koffi.node` (the compiled native addon)
  - `v26.3.0_native/Release/` (CMake build dir for Node v26.3.0)

## What was changed in `base.cc`

- Removal / isolation of dependencies incompatible with Android.
- `spawn.h` guarded so it is not used on Android.
- Android implementation uses `fstatat` (instead of `statx`).
- Android process creation uses `fork()` + `dup2()` + `execve()` + `_exit()`.
- `posix_spawn` preserved for Linux via `#if` / `#else` / `#endif` guards.
- Corrections to `#if`/`#else`/`#endif` pairing and function braces/structure.

## Verification

- Preprocessor check: `clang -E -P` on the modified file.
- Final target compiled successfully for Android (`android_arm64`).

## Do NOT revert

These changes are required for Koffi to load on Android. Do not recompile or revert
without need.
