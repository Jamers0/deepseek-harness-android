# Build

The native Android artifacts are already committed, so a normal checkout does not
require recompilation. Rebuild only when necessary.

## Install

```bash
pkg install nodejs clang make cmake
npm install -g pnpm@11.7.0
pnpm install --ignore-scripts
```

## Rebuild Koffi (only if needed)

```bash
cd patches/koffi@3.1.1
cnoke.cjs build          # produces build/koffi/android_arm64/koffi.node
```

## Rebuild node-pty (only if needed)

```bash
ANDROID_NDK_HOME=$PREFIX \
npm_config_android_ndk_path=$PREFIX \
  <node-pty build command>
# place the result at prebuilds/pty.node
```

## Run

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open
```
