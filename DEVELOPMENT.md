# Browser extensions (Chromium + Firefox)

This repo can be built as:
- a **Userscript** (`dist/yslv.user.js`)
- a **Chromium extension** (`dist-ext/chromium` + `dist-ext/yslv-chromium.zip`)
- a **Firefox extension** (`dist-ext/firefox` + `dist-ext/yslv-firefox.zip`)

## Build

```bash
npm i
npm run build
```

Or individually:

```bash
npm run build:userscript
npm run build:ext
```

## Load unpacked

### Chromium

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked**
4. Select `dist-ext/chromium`

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on**
3. Select `dist-ext/firefox/manifest.json`
