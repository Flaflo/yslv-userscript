import type { State } from "../types/state"

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
    descIo: null,

    lastPageSig: "",
  }
}
