import type { Cfg } from "../types/config"

export const CFG: Cfg = {
  defaultView: "grid", // or "list"

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

    hideMostRelevant: true,
    hideShorts: false,
    hideMiniGuide: false,

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
      maxConcurrent: 3,
      sentenceCount: 2,
      maxChars: 260,
    },
  },

  perf: {
    maxItemsPerTick: 60,
  },

  cls: {
    rowHead: "yslv-subs-rowhead",
    rowHeadName: "yslv-subs-rowhead-name",
    metaRow: "yslv-subs-mrow",
    metaCh: "yslv-subs-mch",
    metaRt: "yslv-subs-mrt",
    desc: "yslv-subs-desc",
    descSkel: "yslv-subs-desc-skel",
    isShort: "yslv-is-short",
    patched: "yslv-patched",
  },
}
