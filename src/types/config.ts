export type Cfg = {
  defaultView: "grid" | "list"

  descStore: {
    ttlMs: number
    maxEntries: number
    saveDebounceMs: number
  }

  list: {
    maxWidth: number | string
    rowPadY: number
    separator: boolean

    thumbW: number
    thumbRadius: number

    shorts: {
      enabled: boolean
      cardW: number
    }

    hideMostRelevant: boolean
    hideShorts: boolean
    hideMiniGuide: boolean
    hideLiveStreams: boolean

    titleClamp: number
    descClamp: number

    rowHead: {
      enabled: boolean
      gap: number
      marginBottom: number
      avatarSize: number
    }

    metaRow: {
      gap: number
    }

    desc: {
      marginTop: number
      skeleton: {
        enabled: boolean
        lines: number
        lineGap: number
        lineHeights: number[]
        lineWidthsPct: number[]
        radius: number
        maxW: number
        animMs: number
      }
    }

    descFetch: {
      enabled: boolean
      maxTotalFetchesPerNav: number
      maxConcurrent: number
      sentenceCount: number
      maxChars: number
    }
  }

  perf: {
    maxItemsPerTick: number
  }
}
