import type { MovedAvatarInfo, MovedMetaAnchorInfo } from "./dom"

export type ViewMode = "grid" | "list"

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
