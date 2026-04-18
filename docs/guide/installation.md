# Installation

## Download

Grab the latest `axgstaio.exe` from the [releases page](https://github.com/bohmaan/AxgstAIO/releases/latest).

## Folder

Put it in any user-writable folder. Avoid `C:\Program Files\`.

```
C:\Users\<you>\Desktop\AxgstAIO\
    axgstaio.exe
    tasks.csv
    proxies.txt
```

## Defender exclusion

PyInstaller binaries get false-flagged. Add an exclusion (admin PowerShell):

```powershell
Add-MpPreference -ExclusionPath "C:\Users\<you>\Desktop\AxgstAIO"
```

## First launch

Double-click the exe. It creates `sessions/`, `tasks/`, `proxy/` subfolders and checks for updates.

Once it finishes updating, prepare your [CSV](/guide/csv-format), drop a [`proxies.txt`](/guide/proxies), and run again.
