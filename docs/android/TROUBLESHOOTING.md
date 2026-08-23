# Troubleshooting

## HMR: `--expose-internals is required for HMR service`

**Symptom:** running `pnpm dsh web` prints:

```
--expose-internals is required for HMR service
```

**Cause:** the HMR service needs Node internal access.

**Why it is tricky:** `--expose-internals` cannot be passed through `NODE_OPTIONS`
on this Node build.

**Fix:** pass it directly on the CLI:

```bash
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web
# or, without auto-opening a browser:
node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open
```

## directory-picker package not resolved

**Symptom:** `@deepseek-ai/dsh-client-ui-directory-picker-browse` is not found at
runtime even though the workspace exists.

**Cause:** pnpm did not create the symlink under `node_modules/@deepseek-ai/`.

**Fix:** create the symlink manually (on the device):

```
node_modules/@deepseek-ai/dsh-client-ui-directory-picker-browse
  -> ../../packages/client/ui-directory-picker-browse
```

The package source under `packages/client/ui-directory-picker-browse` is what is
versioned; the symlink is the runtime workaround.

## Linux-native package warnings

Packages such as `native/landlock-run/packages/linux-arm64` and `linux-x64` emit
warnings under Android. These are expected and safe to ignore — they are platform
limitations, not errors to fix.

## `pnpm install` fails on native scripts

Use:

```bash
pnpm install --ignore-scripts
```
