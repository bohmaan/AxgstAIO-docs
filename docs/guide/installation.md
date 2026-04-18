# Installation

AxgstAIO ships as a single standalone Windows `.exe` — no Python install required on your machine.

## System requirements

- **OS:** Windows 10 or 11 (64-bit)
- **RAM:** 2 GB minimum, 4 GB recommended for 20+ concurrent tasks
- **Network:** stable broadband, proxy-ready
- **Disk:** 200 MB free (exe + session cache)

## Steps

### 1. Download the binary

Grab `axgstaio.exe` from the [latest release](https://github.com/bohmaan/AxgstAIO/releases/latest).

### 2. Pick a folder

Any folder works. **Don't** put it in `C:\Program Files\…` — the bot writes cache files next to itself and needs write permission.

Recommended:
```
C:\Users\<you>\Desktop\AxgstAIO\
    axgstaio.exe
    tasks.csv
    proxies.txt
```

### 3. Whitelist with Windows Defender

Because AxgstAIO is an unsigned PyInstaller exe, Defender frequently flags it. Add an **exclusion** for the folder to prevent random deletes:

```powershell
Add-MpPreference -ExclusionPath "C:\Users\<you>\Desktop\AxgstAIO"
```

(Run PowerShell as Administrator.)

### 4. First launch

Double-click `axgstaio.exe`. It will:

- Create `tasks/`, `proxy/`, `sessions/` subdirectories
- Check GitHub for a newer version and self-update if available
- Print a version banner and wait for your input

::: warning
If you see `Cannot create a file when that file already exists` on update, you have a stale `.old` or `.tmp` file from a crashed previous update. Delete those and restart:

```powershell
del axgstaio.exe.old
del axgstaio.exe.tmp
```

Fixed in v1.1.2+.
:::

## Folder layout after first run

```
AxgstAIO\
├─ axgstaio.exe
├─ tasks.csv
├─ proxies.txt
├─ sessions\
│   ├─ zalando_<email_hash>.json
│   └─ ss_<email_hash>.json
├─ tasks\
└─ proxy\
```

`sessions/` contains cookie jars per account per site. Safe to delete if you want a clean login on next run.

## Next

- [Quick Start](/guide/quick-start) — first task
- [Updating](/guide/updating) — how the auto-update works
