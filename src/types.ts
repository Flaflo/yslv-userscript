export type ViewMode = "grid" | "list"

export type DescStoreEntry = {
  t: number
  d: string
}

export type DescStoreObject = Record<string, DescStoreEntry>

export type SkeletonNorm = {
  enabled: boolean
  lines: number
  gap: number
  h: (i: number) => number
  w: (i: number) => number
  r: number
  maxW: number
  ms: number
}

export type Cfg = {
  storageKey: string
  defaultView: ViewMode
  toggleMountSelector: string

  descStore: {
    key: string
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
    descQueueIntervalMs: number
  }

  ids: {
    style: string
    toggle: string
  }

  cls: {
    rowHead: string
    rowHeadName: string
    metaRow: string
    metaCh: string
    metaRt: string
    desc: string
    descSkel: string
    btn: string
    btnIcon: string
    isShort: string
  }

  attr: {
    view: string
  }

  cssVars: {
    shimmerX: string
    shortW: string
  }
}

export type MovedNodeInfo = {
  parent: Node
  nextSibling: ChildNode | null
}

export type MovedAvatarInfo = MovedNodeInfo & {
  avatarEl: Element
}

export type MovedMetaAnchorInfo = MovedNodeInfo & {
  a: HTMLAnchorElement
}

export type State = {
  active: boolean
  view: ViewMode
  styleEl: HTMLStyleElement | null

  q: Element[]
  qSet: Set<Element>
  processing: boolean

  processedItems: WeakSet<Element>

  movedAvatars: WeakMap<Element, MovedAvatarInfo>
  movedMetaAnchors: WeakMap<Element, MovedMetaAnchorInfo>

  mo: MutationObserver | null
  observedTarget: Element | null

  pmMo: MutationObserver | null

  descCache: Map<string, string>
  descInFlight: Map<string, Promise<string>>
  descFetches: number
  descActive: number

  descQueue: string[]
  descQueued: Set<string>
  descTimer: number
  descPumpRunning: boolean
  lastQueueSig: string

  lastPageSig: string
}

export type ShimmerState = {
  raf: number
  running: boolean
  t0: number
}

export type DescStoreState = {
  obj: DescStoreObject | null
  dirty: boolean
  saveT: number
}
