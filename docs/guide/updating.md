# Updating

On every launch the bot compares its embedded version against the latest [GitHub release](https://github.com/bohmaan/AxgstAIO/releases/latest). Newer release → auto-download + self-replace. Restart to apply.

## Manual update

Download the `.exe` from the releases page and overwrite the file yourself.

## WinError 183 (`Cannot create a file when that file already exists`)

Stale leftovers from a crashed prior update. Close the launcher, then:

```powershell
del axgstaio.exe.old
del axgstaio.exe.tmp
```

Fixed permanently in v1.1.2+.

## Defender blocking the new exe

Add the folder to exclusions:

```powershell
Add-MpPreference -ExclusionPath "C:\Users\<you>\Desktop\AxgstAIO"
```
