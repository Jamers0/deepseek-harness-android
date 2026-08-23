# Sharp — WASM resolution

## Problem

The native `sharp` (libvips) build does not compile cleanly on Android/Termux.

## Solution

Use the WebAssembly build instead:

```bash
pnpm add -w @img/sharp-wasm32 --ignore-scripts
```

`@img/sharp-wasm32` provides the same image-processing API via WASM, avoiding the
native toolchain entirely.

## Notes

- Do not remove this solution; it is what makes image processing work on Android.
- Installed with `--ignore-scripts` to avoid native postinstall steps.
