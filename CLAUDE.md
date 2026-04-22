# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

MKVToolNix Batch Tool is a Windows desktop app that batch-processes video libraries by **merging, removing, or extracting subtitles** via `mkvmerge` (MKVToolNix) and `ffmpeg`. Users point it at a directory tree and it walks it, pairs videos with matching subtitle files, and runs the selected operation.

The app is a **three-layer Electron application**:

1. **Electron main** (Node.js) — [main.js](main.js): owns the window, spawns the Python backend, handles IPC (minimize/maximize/quit/restart).
2. **React renderer** (Fluent UI) — [src/](src/): the UI the user sees.
3. **Python/Flask backend** — [app.py](app.py) + [resources/modules/](resources/modules/): does the actual work by shelling out to bundled `mkvmerge.exe` and `ffmpeg.exe`.

The renderer talks to Python over `http://localhost:{port}` (REST + Socket.IO). The port is chosen dynamically from 3001–3999 in [main.js](main.js) via `get-port`, passed to Python as `sys.argv[1]`, and exposed to React via an IPC sync call (`get-port-number`).

## Commands

Everything is routed through [scripts/dispatch.js](scripts/dispatch.js), which is called from npm scripts.

**Dev:**
- `npm start` — full dev mode: kills port 3000, starts React dev server, launches Electron, spawns Python in a separate CMD window running `python app.py {port}`.
- `npm run start:react` / `npm run start:electron` — individual services (rarely needed).

**Build:**
- `npm run build` or `npm run build:all` — builds React (`react-scripts build` → `build/`) and Python (PyInstaller → `resources/app/` and `resources/app.debug/`).
- `npm run build:react` / `npm run build:python` — one layer at a time.
- `npm run build:docs` — JSDoc → `docs/`.

**Package (installers):**
- `npm run build:package:windows` — builds everything, runs `electron-packager`, then `electron-wix-msi` → `dist/windows/setup/`.
- `npm run build:package:mac` — DMG via `electron-installer-dmg` → `dist/mac/setup/`. (Note: bundled binaries in `resources/` are Windows `.exe` — macOS packaging exists but is not functionally complete.)

**Test:** `npm test` — runs `react-scripts test` (only `src/tests/App.test.js` currently exists, and it is minimal).

**Clean:** `npm run clean` — removes `build/`, `dist/`, `docs/`, `node_modules/`, lockfiles, pycache, and PyInstaller spec files. Destructive — do not run without asking.

## Python environment

- Python deps in [requirements.txt](requirements.txt): Flask 2.0.1, Flask-SocketIO 3.1.2, chardet, ffmpeg-python, langdetect, pyinstaller.
- PyInstaller is the builder — its options are defined in [scripts/build.js](scripts/build.js) (e.g. `--collect-datas=langdetect` because langdetect ships language profile data that must be bundled).

## Architecture notes

### Directory layout
- [main.js](main.js), [preload.js](preload.js), [app.py](app.py) — app entry points.
- [src/](src/) — React, with path alias `src/` as baseUrl (see [jsconfig.json](jsconfig.json)), so imports read as `components/...`, `utils/...` with no `./`.
- [src/components/](src/components/) — UI, organized by section (`pages/main`, `pages/settings`, `navigation`, `titlebar`, `footer`, `dialog`).
- [src/utils/](src/utils/) — [requests.js](src/utils/requests.js) (Flask HTTP + Socket.IO), [services.js](src/utils/services.js) (Electron IPC helpers, dialog), [settings.js](src/utils/settings.js) (localStorage wrapper).
- [src/theme/](src/theme/) — Fluent UI palette overrides (dark/light).
- [resources/modules/mkvtoolnix.py](resources/modules/mkvtoolnix.py) — `MKVToolNix` class: merge / remove / extract / language detection / ad removal / encoding normalization.
- [resources/modules/filewalker.py](resources/modules/filewalker.py) — `FileWalker` class: directory traversal, video↔subtitle pairing, filename-suffix parsing (`.default`, `.forced`, `.sdh`, `.{lang}`, `.{NN}`).
- [resources/mkvtoolnix/](resources/mkvtoolnix/) and [resources/ffmpeg/](resources/ffmpeg/) — bundled Windows binaries that ship with the installer.
- [scripts/](scripts/) — build/package/start/clean dispatcher classes.

### Flask endpoints (app.py)
- `GET /supported_languages` — returns the ISO-639 map.
- `POST /process_batch` — main worker: body is `{ input, output, settings }`; emits `batch_size` and `processing_subdirectory` Socket.IO events; returns `{ status, warning, error }`.
- `GET /quit` — shuts the Flask server down cleanly when Electron exits.

### The three processing modes
Chosen via settings flags sent from the React `MainPage` dropdown:
- **merge** (default): `MKVToolNix.add_subtitles(...)` → one `mkvmerge -o` per video.
- **remove** (`isRemoveSubtitles`): `MKVToolNix.remove_subtitles(...)` → `mkvmerge -o ... --no-subtitles ...`.
- **extract** (`isExtractSubtitles`): `MKVToolNix.extract_subtitles(...)` → uses `ffprobe` to enumerate streams, then `ffmpeg` with `-c:s srt` to pull each one out.

### Subtitle filename conventions
Parsed in `FileWalker.get_presets_from_suffix` and consumed in `MKVToolNix.add_subtitles`:
- `.default` → default track flag
- `.forced` → forced track flag
- `.sdh` / `.hearing-impaired` → hearing-impaired flag
- `.{2-letter ISO-639-1}` → language override (`.en`, `.nl`, `.es`, ...)
- `.{NN}` / `.{NNN}` → language count suffix (for disambiguation on extract)
- Multiple can stack, e.g. `movie.default.forced.sdh.es.srt`.

### Video↔subtitle pairing rules (in `FileWalker.get_files`)
- If a directory has exactly **one** video, every subtitle in the directory is merged into it (regardless of subtitle name).
- If a directory has **multiple** videos, a subtitle is merged only if the video's basename (without extension/suffix-data) appears in the subtitle's basename.
- Video files are sorted **longest-name first** so that `episode.srt` pairs with `episode.avi` and not with `episode part 2.avi`.
- "Root directory" (the directory the user selected) is treated specially — videos/subtitles there alone do not cause skip-warnings.

### Language detection
`MKVToolNix.determine_language` reads the subtitle file (after forcing UTF-8 via chardet re-encoding if needed), samples ~100 lines of dialogue text, and runs `langdetect.detect`. Special cases:
- `.ass` — skips the config header, reads only `Dialogue:` lines, everything after `}`.
- `.idx` — reads the `id:` field directly (image-based subs contain no text to sniff).
- Strips timestamp lines (`--\>`) and sequence numbers before sniffing.

### Supported file types
Defined in [resources/modules/filewalker.py](resources/modules/filewalker.py):
- **Video:** avi, m4v, mkv, mov, mp4, mpg, mpeg, ogg, ogm, webm, wmv
- **Subtitle:** ass, idx, pgs, smi, srt, ssa, sub, sup, vtt
- `.smi` is auto-converted to `.srt` via ffmpeg during merge (see `incompatible_convertible_extensions`). To add another convertible format, also add it to `subtitle_file_types`.

### State and settings
React has a lightweight global state in [src/components/App.js](src/components/App.js) (no Redux). User settings persist in `window.localStorage` under key `mkvtoolnix-batch-tool-settings` via [src/utils/settings.js](src/utils/settings.js). The `isDebugMode` flag always resets to `false` on startup.

### Error logging
Both Electron (via `console.error` override in [main.js](main.js)) and Flask (via Python `logging`) append to `%APPDATA%/MKVToolNix Batch Tool/error.log` using the same timestamp format. Users are asked to attach this file to bug reports.

## Things to watch out for

- **Electron 10, old stack.** `nodeIntegration: true` + `contextIsolation: false` + `enableRemoteModule: true` are used. Do not "modernize" these without a full audit — the renderer relies on `window.require('electron')` in several places ([src/utils/services.js](src/utils/services.js), [src/utils/requests.js](src/utils/requests.js)).
- **Window size is fixed** at 675×370 (min=max). Design UI within that.
- **`mkvmerge` / `ffmpeg` path resolution** in [mkvtoolnix.py](resources/modules/mkvtoolnix.py) (`get_binary_path`, `get_mkvtoolnix_path`) checks for a dev path first, then falls back to `resources/`. When running `python app.py` from the repo root, the dev path exists; in packaged builds, both binaries sit in `resources/`.
- **Windows shell commands.** Paths are quoted manually in `mkvmerge` command strings. Any change to how options are concatenated risks breaking on paths with spaces — test with a directory like `C:\Users\Test User\Videos\My Movie (2020)\`.
- **Socket.IO version pinning** is load-bearing: `socket.io-client` 2.3.1 pairs with `python-socketio` 2.1.2 + `python-engineio` 3.1.0. Bumping one side requires bumping the other in lockstep.
- **PyInstaller + SocketIO** needs `from engineio.async_drivers import threading` explicitly imported in [app.py](app.py) — if you delete that import thinking it's unused, the packaged `app.exe` will fail to start.
- **This is an open-source public repo.** Do not include local filesystem paths, usernames, or environment-specific details in commits, issues, or generated docs.

## Code style

- ESLint (airbnb + react) in [.eslintrc.js](.eslintrc.js) — most rules are warnings, not errors.
- 2-space indent, single quotes, semicolons, no trailing commas, always-spaced JSX curly braces (`{ foo }` not `{foo}`).
- React class components (not hooks) — the codebase predates hooks adoption. New components can follow suit for consistency unless there's a specific reason to switch.
- JSDoc `@namespace` / `@description` / `@memberof` blocks are used throughout and feed [docs/](docs/). Match the existing style when adding public-facing classes or modules.
