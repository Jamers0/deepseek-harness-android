# Environment

Detected / verified facts about the Android + Termux build & runtime environment
used for this port.

> Hardware specifics of the phone (exact model, chipset, RAM, Android version) were
> **not invented**. Only the values that are verifiable from the toolchain and
> build artifacts are recorded below. To populate the device-specific fields, run
> the read-only commands listed at the end on the device.

## Verified from toolchain / artifacts

| Item            | Value                                              | Source |
|-----------------|----------------------------------------------------|--------|
| Platform        | Android                                            | port context |
| Environment     | Termux                                             | port context |
| Architecture    | `aarch64` / `arm64`                                | `pty.node` ELF header, koffi `android_arm64` build |
| Node.js         | v26.3.0                                            | port context |
| pnpm            | v11.7.0                                            | port context |
| node-pty target | `android-arm64`                                    | `prebuilds/pty.node` (ELF aarch64) |
| Koffi build     | `android_arm64`, Node v26.3.0 (native)             | `patches/koffi@3.1.1/build/.../v26.3.0_native` |
| Branch          | `android-bionic`                                   | intended working branch |

## Read-only commands to detect device specifics (run on the device)

```bash
getprop ro.product.manufacturer     # manufacturer
getprop ro.product.model            # model
getprop ro.build.version.sdk        # Android SDK / API level
getprop ro.build.version.release    # Android version
uname -m                            # CPU architecture
getprop ro.product.cpu.abi          # ABI
nproc                               # number of cores
grep MemTotal /proc/meminfo         # total RAM
free -h                             # available memory
getprop ro.board.platform           # chipset (if exposed)
df -h /data /sdcard                 # storage
uname -a                            # kernel version
pkg show termux-api 2>/dev/null; echo "Termux: $(cat $PREFIX/etc/termux/termux-version 2>/dev/null)"
node -v; pnpm -v
```

Record the output of these commands in this file once available. Do **not** invent
values that cannot be obtained via these read-only queries.
