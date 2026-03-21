# Development

This repo produces three distribution artifacts:

- **Userscript** - `dist/yslv.user.js`
- **Chromium extension** - `dist-ext/chromium/` + `dist-ext/yslv-chromium.zip`
- **Firefox extension** - `dist-ext/firefox/` + `dist-ext/yslv-firefox.zip`

## Prerequisites

- Node.js 22+
- npm

## Build

```bash
npm install
npm run build
```

Or individually:

```bash
npm run build:userscript
npm run build:ext
```

## Load unpacked (development)

### Chromium

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** and select `dist-ext/chromium`

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on**
3. Select `dist-ext/firefox/manifest.json`

## Build pipeline

The build uses Vite in library mode:

- **Userscript** - built as IIFE via `vite.config.ts`, then the userscript header (from `userscript.header.txt`) is prepended with the version from `package.json`.
- **Extensions** - built as minified IIFE via `vite.ext.config.ts`, then `scripts/build-extensions.mjs` copies the browser-specific manifests, injects the version, bundles icons, and creates zip archives.
- **SVG icons** - a custom Vite plugin (`plugins/vite-svg-icondef.ts`) reads `.svg` files at build time and emits `{ viewBox, paths }` objects, so icons live as real SVG files but are inlined as data at build time.

## Commit style convention

This project uses [gitmoji,dev](https://gitmoji.dev/) as commit style convention.

