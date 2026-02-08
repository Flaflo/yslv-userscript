import type { Cfg, DescStoreObject, DescStoreState } from "./types"

function nowMs(): number {
  return Date.now()
}

export function ensureDescStoreLoaded(cfg: Cfg, st: DescStoreState): void {
  if (st.obj) return

  let raw: string
  try {
    raw = localStorage.getItem(cfg.descStore.key) || ""
  } catch {
    raw = ""
  }

  let obj: DescStoreObject = {}
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === "object") obj = parsed as DescStoreObject
    } catch {
      obj = {}
    }
  }

  st.obj = obj
  pruneDescStore(cfg, st)
}

export function scheduleDescStoreSave(cfg: Cfg, st: DescStoreState): void {
  if (st.saveT) return

  st.saveT = window.setTimeout(() => {
    st.saveT = 0
    if (!st.dirty) return
    st.dirty = false
    try {
      localStorage.setItem(cfg.descStore.key, JSON.stringify(st.obj || {}))
    } catch {}
  }, Math.max(0, Number(cfg.descStore.saveDebounceMs) || 250))
}

export function pruneDescStore(cfg: Cfg, st: DescStoreState): void {
  ensureDescStoreLoaded(cfg, st)

  const ttl = Math.max(1, Number(cfg.descStore.ttlMs) || 3600000)
  const maxEntries = Math.max(50, Number(cfg.descStore.maxEntries) || 1200)
  const tNow = nowMs()

  const obj = st.obj || {}
  const entries: Array<[string, number]> = []

  for (const k of Object.keys(obj)) {
    const e = obj[k]
    const t = Number(e?.t || 0)
    if (!t || tNow - t >= ttl) {
      delete obj[k]
      st.dirty = true
      continue
    }
    entries.push([k, t])
  }

  if (entries.length > maxEntries) {
    entries.sort((a, b) => a[1] - b[1])
    const drop = entries.length - maxEntries
    for (let i = 0; i < drop; i++) {
      delete obj[entries[i]![0]]
      st.dirty = true
    }
  }

  if (st.dirty) scheduleDescStoreSave(cfg, st)
}

export function getStoredDesc(cfg: Cfg, st: DescStoreState, vid: string): string | null {
  if (!vid) return null
  ensureDescStoreLoaded(cfg, st)

  const ttl = Math.max(1, Number(cfg.descStore.ttlMs) || 3600000)
  const tNow = nowMs()
  const obj = st.obj || {}
  const e = obj[vid]
  if (!e) return null

  const t = Number(e.t || 0)

  if (!t || tNow - t >= ttl) {
    delete obj[vid]
    st.dirty = true
    scheduleDescStoreSave(cfg, st)
    return null
  }

  return e.d
}

export function setStoredDesc(cfg: Cfg, st: DescStoreState, vid: string, desc: string): void {
  if (!vid) return
  ensureDescStoreLoaded(cfg, st)

  const obj = st.obj || {}
  obj[vid] = { t: nowMs(), d: String(desc || "") }

  st.dirty = true
  pruneDescStore(cfg, st)
  scheduleDescStoreSave(cfg, st)
}
