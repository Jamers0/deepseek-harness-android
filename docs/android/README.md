# DeepSeek Harness — Android / Termux Port (docs)

This folder contains the permanent technical documentation for the Android/Bionic
port of DeepSeek Harness.

## Index

- [README.md](README.md) — this file
- [ENVIRONMENT.md](ENVIRONMENT.md) — detected device and runtime
- [PORTING.md](PORTING.md) — how the upstream was adapted to Bionic
- [KOFFI.md](KOFFI.md) — Koffi patch & compilation
- [NODE-PTY.md](NODE-PTY.md) — node-pty compilation
- [SHARP.md](SHARP.md) — WASM sharp resolution
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — HMR, expose-internals, directory-picker
- [BUILD.md](BUILD.md) — build commands
- [CHANGELOG.md](CHANGELOG.md) — change history
- [FILES-MODIFIED.md](FILES-MODIFIED.md) — exact modified/added files
- [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md) — remaining limitations
- [PORTING-REPORT.md](PORTING-REPORT.md) — full technical report
- [COMMIT_HISTORY.md](COMMIT_HISTORY.md) — commit metadata

## Scope

Only Android-port-related changes are versioned. `node_modules/`, caches, logs,
build caches, temporary artifacts, secrets and personal Termux config are excluded
(see `.gitignore` at repository root).

## Note on hardware

No device model / chipset / RAM / Android version was invented. Only the facts that
could be verified from the build artifacts and the porting context are recorded
(see `ENVIRONMENT.md`). The "Android device" used is the phone running Termux; its
exact model is not asserted here unless obtained via read-only device queries.
