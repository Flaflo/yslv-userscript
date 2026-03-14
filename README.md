# YouTube Subscription List View (YSLV)
[![Greasy Fork Version](https://img.shields.io/greasyfork/v/565188?label=Greasy%20Fork)](https://greasyfork.org/en/scripts/565188-youtube-subscription-list-view)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ehfpipcmnkpnekkkamdigmflojhmpnbg?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/ehfpipcmnkpnekkkamdigmflojhmpnbg)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/youtube-subscription-list-view?label=Mozilla%20Add-ons)](https://addons.mozilla.org/en-US/firefox/addon/youtube-subscription-list-view/)

Restore the **list view** for the YouTube **Subscriptions** page faithful to the original layout, inline metadata, video descriptions, and a grid/list toggle placed exactly where it used to be.

---

## Features


- List-style Subscriptions layout
- Grid / List toggle on the Subscriptions page
- Lazy-loaded video descriptions
- Dark and light mode compatible
- No external dependencies

---

## Configuration

All settings are configurable via the `CFG` object at the top of the script.

### Default view

```js
defaultView: "grid" // or "list"
```

### Positioning
If you dont like the centering you can change the maxWidth of the list in the config:

```js
list: {
  maxWidth: "90%",
}
```

### Description loading

```js
descFetch: {
  enabled: true,
  maxTotalFetchesPerNav: 60,
  maxConcurrent: 1,
  sentenceCount: 2,
  maxChars: 260,
},
```

---

## Performance

- DOM patching via `MutationObserver`
- Lazy loading with `IntersectionObserver`
- Request throttling and caching
- Automatic cleanup when leaving the Subscriptions page

---

## Scope

This script **only runs on**:

https://www.youtube.com/feed/subscriptions

Other YouTube pages remain untouched.

---

## Installation

1. Install **Tampermonkey** or **Violentmonkey**
2. Install the script from Greasy Fork
3. Open the YouTube Subscriptions page
4. Use the toggle to switch between **Grid** and **List**

---

## License

MIT
