# YouTube Subscription List View (YSLV)
[![Greasy Fork Version](https://img.shields.io/greasyfork/v/565188?label=Greasy%20Fork)](https://greasyfork.org/en/scripts/565188-youtube-subscription-list-view)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ehfpipcmnkpnekkkamdigmflojhmpnbg?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/ehfpipcmnkpnekkkamdigmflojhmpnbg)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/youtube-subscription-list-view?label=Mozilla%20Add-ons)](https://addons.mozilla.org/en-US/firefox/addon/youtube-subscription-list-view/)
[![CI](https://github.com/Flaflo/yslv-userscript/actions/workflows/ci.yml/badge.svg)](https://github.com/Flaflo/yslv-userscript/actions/workflows/ci.yml)

Restore the **list view** for the YouTube **Subscriptions** page faithful to the original layout, inline metadata, video descriptions, and a grid/list toggle placed exactly where it used to be.

---

## Features

- List-style Subscriptions layout matching the original YouTube design
- Grid / List toggle on the Subscriptions page
- Lazy-loaded video descriptions via InnerTube API
- In-page settings dialog (gear icon) with live preview
- Configurable thumbnail size, title/description line clamps, layout width
- Option to hide "Most Relevant" section
- Option to hide Shorts shelf
- Dark and light mode compatible
- No external dependencies
- Available as userscript, Chrome extension, and Firefox add-on

---

## Installation

### Userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Install from [Greasy Fork](https://greasyfork.org/en/scripts/565188-youtube-subscription-list-view)
3. Open the YouTube Subscriptions page
4. Use the toggle to switch between **Grid** and **List**

### Chrome

Install from the [Chrome Web Store](https://chromewebstore.google.com/detail/ehfpipcmnkpnekkkamdigmflojhmpnbg).

### Firefox

Install from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/youtube-subscription-list-view/).

---

## Configuration

Click the **gear icon** in the toggle bar on the Subscriptions page to open the settings dialog. All changes are previewed live and persisted automatically.

| Setting | Description |
|---|---|
| Default view | Grid or List on page load |
| Thumbnail width | Thumbnail size in pixels |
| Thumbnail radius | Border radius in pixels |
| Max layout width | Maximum width of the list container |
| Title line clamp | Max lines for video titles |
| Description line clamp | Max lines for descriptions |
| Hide Most Relevant | Remove the "Most Relevant" section |
| Hide Shorts | Remove the Shorts shelf |
| Fetch descriptions | Load video descriptions via API |
| Sentence count | Number of sentences to show |
| Max description chars | Character limit for descriptions |
| Show skeleton | Show loading placeholders |
| Separator lines | Show dividers between videos |

---

## Performance

- DOM patching via `MutationObserver`
- Lazy loading with `IntersectionObserver`
- Request throttling and caching
- Automatic cleanup when leaving the Subscriptions page

---

## Scope

This script **only runs on** `https://www.youtube.com/feed/subscriptions`. Other YouTube pages remain untouched.

---

## License

MIT
