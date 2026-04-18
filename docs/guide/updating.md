# Updating

AxgstAIO updates itself on every launch by checking the [GitHub releases page](https://github.com/bohmaan/AxgstAIO/releases/latest) for a tag newer than the embedded `APP_VERSION`.

## How it works

1. On start, the launcher calls the GitHub API to fetch the latest release.
2. If the release tag (e.g. `v1.2.1`) is different from the bundled version (e.g. `1.2.0`), it downloads the `.exe` asset.
3. The current running exe is renamed to `axgstaio.exe.old` (Windows lets you rename a running exe).
4. The new exe takes its place.
5. **Restart** the launcher to pick up the new binary.

## Manual update

If auto-update fails (Defender, corporate firewall, missing GitHub asset), download the new `.exe` manually from the [releases page](https://github.com/bohmaan/AxgstAIO/releases/latest) and replace the file yourself.

## Known issues

### `Cannot create a file when that file already exists` (WinError 183)

Pre-v1.1.2 updater used `Path.rename()` which on Windows fails if the destination exists. If you're stuck in this loop:

1. Close the launcher.
2. Delete stale files:
   ```powershell
   del axgstaio.exe.old
   del axgstaio.exe.tmp
   ```
3. Download v1.1.2+ manually and replace.

After v1.1.2 this is fixed — the updater uses `os.replace()` which overwrites atomically on Windows.

### Antivirus quarantining the new exe

PyInstaller exes get false-flagged. Whitelist the folder — see [Installation](/guide/installation).

### `Update failed: HTTP 403`

Usually GitHub API rate-limit. Wait an hour or use an authenticated token (bundled, but may be revoked).

## Checking your current version

The version prints on launch:

```
==========================================
          AxgstAIO 1.2.1
==========================================
```

Or from PowerShell:

```powershell
.\axgstaio.exe --version
```

(Flag may not be implemented in all builds — prefer the banner.)
