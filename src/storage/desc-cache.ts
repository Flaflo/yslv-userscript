import type { DescStoreObject } from "../types/storage"

export interface DescCache {
  get(videoId: string): string | null
  set(videoId: string, desc: string): void
  clear(): void
  load(): void
  prune(): void
}

export function createDescCache(opts: {
  key: string
  ttlMs: number
  maxEntries: number
  saveDebounceMs: number
}): DescCache {
  let obj: DescStoreObject | null = null
  let dirty = false
  let saveTimer = 0

  function scheduleSave(): void {
    if (saveTimer) return
    saveTimer = window.setTimeout(() => {
      saveTimer = 0
      if (!dirty || !obj) return
      try {
        localStorage.setItem(opts.key, JSON.stringify(obj))
      } catch {}
      dirty = false
    }, opts.saveDebounceMs)
  }

  function ensureLoaded(): DescStoreObject {
    if (obj) return obj
    try {
      const raw = localStorage.getItem(opts.key)
      obj = raw ? (JSON.parse(raw) as DescStoreObject) : {}
    } catch {
      obj = {}
    }
    return obj
  }

  return {
    load(): void {
      ensureLoaded()
    },

    prune(): void {
      const data = ensureLoaded()
      const now = Date.now()
      const keys = Object.keys(data)

      for (const k of keys) {
        if (now - data[k]!.t > opts.ttlMs) {
          delete data[k]
          dirty = true
        }
      }

      const remaining = Object.keys(data)
      if (remaining.length > opts.maxEntries) {
        remaining
          .sort((a, b) => data[a]!.t - data[b]!.t)
          .slice(0, remaining.length - opts.maxEntries)
          .forEach((k) => {
            delete data[k]
            dirty = true
          })
      }

      if (dirty) scheduleSave()
    },

    get(videoId: string): string | null {
      const data = ensureLoaded()
      const entry = data[videoId]
      if (!entry) return null
      if (Date.now() - entry.t > opts.ttlMs) {
        delete data[videoId]
        dirty = true
        scheduleSave()
        return null
      }
      return entry.d
    },

    set(videoId: string, desc: string): void {
      const data = ensureLoaded()
      data[videoId] = { t: Date.now(), d: desc }
      dirty = true
      scheduleSave()
    },

    clear(): void {
      obj = {}
      dirty = true
      scheduleSave()
    },
  }
}
