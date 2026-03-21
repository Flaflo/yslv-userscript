# Privacy Policy

**Last updated: 2026-03-21**

## Overview

YSLV is a browser extension / userscript that restores a list-style layout for YouTube's Subscriptions feed. It runs on `https://www.youtube.com/*` in order to modify the page layout locally in your browser.

## Data Collection

**YSLV does not collect, transmit, sell, or share personal data.**

- No analytics or tracking
- No advertising identifiers
- No third-party data sharing
- No telemetry

## Network Requests

YSLV makes requests **only** to YouTube's own API (`https://www.youtube.com/youtubei/v1/player`) to fetch video descriptions displayed in list view. These requests go directly from your browser to YouTube - no data passes through any third-party server. This feature can be disabled in settings.

## Local Storage

YSLV stores the following data locally in your browser:

- **Settings** (view mode, layout preferences, feature toggles) - stored via the browser's extension storage API (`storage.sync`) or `localStorage` in the userscript variant. Depending on your browser and sign-in state, `storage.sync` may sync settings across devices (e.g. Google Chrome) or remain local-only (e.g. Firefox, ungoogled-chromium)
- **Description cache** - fetched video descriptions are cached in `localStorage` with automatic expiration to reduce redundant requests

No stored data is transmitted to any external server.

## Site Access

The extension requires access to `https://www.youtube.com/*` to run a content script that applies DOM/CSS modifications to the YouTube Subscriptions page. YSLV does not collect or send any page data off your device.

## Contact

If you have questions, you can contact the author via the project homepage: [https://github.com/Flaflo/yslv-userscript](https://github.com/Flaflo/yslv-userscript)

This policy applies only to the YSLV extension and userscript.
