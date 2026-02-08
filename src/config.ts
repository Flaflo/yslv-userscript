import type { Cfg } from "./types"

export const CFG: Cfg = {
  storageKey: "yslv",
  defaultView: "grid", // or "list"

  toggleMountSelector:
    'ytd-browse[page-subtype="subscriptions"] ytd-shelf-renderer .grid-subheader #title-container #subscribe-button,' +
    'ytd-two-column-browse-results-renderer[page-subtype="subscriptions"] ytd-shelf-renderer .grid-subheader #title-container #subscribe-button',

  descStore: {
    key: "yslv_desc_cache_v1",
    ttlMs: 60 * 60 * 1000,
    maxEntries: 1200,
    saveDebounceMs: 250,
  },

  list: {
    maxWidth: 1320, // or "90%"
    rowPadY: 20,
    separator: true,

    thumbW: 240,
    thumbRadius: 14,

    shorts: {
      enabled: true,
      cardW: 170,
    },

    titleClamp: 2,
    descClamp: 2,

    rowHead: {
      enabled: true,
      gap: 12,
      marginBottom: 20,
      avatarSize: 32,
    },

    metaRow: {
      gap: 8,
    },

    desc: {
      marginTop: 10,
      skeleton: {
        enabled: true,
        lines: 2,
        lineGap: 6,
        lineHeights: [12, 12, 12],
        lineWidthsPct: [82, 74, 58],
        radius: 9,
        maxW: 520,
        animMs: 5000,
      },
    },

    descFetch: {
      enabled: true,
      maxTotalFetchesPerNav: 60,
      maxConcurrent: 1,
      sentenceCount: 2,
      maxChars: 260,
    },
  },

  perf: {
    maxItemsPerTick: 60,
    descQueueIntervalMs: 350,
  },

  ids: {
    style: "yslv-subs-style",
    toggle: "yslv-subs-toggle",
  },

  cls: {
    rowHead: "yslv-subs-rowhead",
    rowHeadName: "yslv-subs-rowhead-name",
    metaRow: "yslv-subs-mrow",
    metaCh: "yslv-subs-mch",
    metaRt: "yslv-subs-mrt",
    desc: "yslv-subs-desc",
    descSkel: "yslv-subs-desc-skel",
    btn: "yslv-btn",
    btnIcon: "yslv-btn-ic",
    isShort: "yslv-is-short",
  },

  attr: {
    view: "data-yslv-subs-view",
  },

  cssVars: {
    shimmerX: "--yslvSkelX",
    shortW: "--yslvShortW",
  },
}
