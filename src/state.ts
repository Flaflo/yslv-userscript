import type { DescStoreState, ShimmerState, State, ViewMode } from "./types"

export function createState(): State {
  return {
    active: false,
    view: "grid",
    styleEl: null,

    q: [],
    qSet: new Set(),
    processing: false,

    processedItems: new WeakSet(),

    movedAvatars: new WeakMap(),
    movedMetaAnchors: new WeakMap(),

    mo: null,
    observedTarget: null,

    pmMo: null,

    descCache: new Map(),
    descInFlight: new Map(),
    descFetches: 0,
    descActive: 0,

    descQueue: [],
    descQueued: new Set(),
    descTimer: 0,
    descPumpRunning: false,
    lastQueueSig: "",

    lastPageSig: "",
  }
}

export function createShimmerState(): ShimmerState {
  return {
    raf: 0,
    running: false,
    t0: 0,
  }
}

export function createDescStoreState(): DescStoreState {
  return {
    obj: null,
    dirty: false,
    saveT: 0,
  }
}

export function isViewMode(v: unknown): v is ViewMode {
  return v === "grid" || v === "list"
}
