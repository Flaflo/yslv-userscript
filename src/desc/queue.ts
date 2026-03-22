import type { Cfg } from "../types/config"
import type { State } from "../types/state"
import type { DescCache } from "../storage/desc-cache"
import { fetchDescriptionForVideoId, updateDescDomForVid } from "."

export async function pumpDescQueue(cfg: Cfg, state: State, cache: DescCache): Promise<void> {
  if (state.descPumpRunning) return
  state.descPumpRunning = true
  try {
    while (state.active && state.view === "list" && state.descQueue.length) {
      const vid = state.descQueue.shift()
      if (!vid) continue
      state.descQueued.delete(vid)

      const txt = await fetchDescriptionForVideoId(cfg, state, cache, vid)
      updateDescDomForVid(cfg, vid, txt || "")
    }
  } finally {
    state.descPumpRunning = false
  }
}

function scheduleDescPumpInternal(cfg: Cfg, state: State, cache: DescCache): void {
  if (!state.active || state.view !== "list") return
  if (state.descTimer) return

  state.descTimer = window.setTimeout(() => {
    state.descTimer = 0
    if (!state.active || state.view !== "list") return
    cache.prune()
    void pumpDescQueue(cfg, state, cache)
  }, 120)
}

export function ensureDescIo(cfg: Cfg, state: State, cache: DescCache): void {
  if (state.descIo) return

  state.descIo = new IntersectionObserver(
    (entries) => {
      let added = false
      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        const el = entry.target as HTMLElement
        const vid = el.dataset.yslvVid
        if (!vid) continue

        state.descIo?.unobserve(el)

        if (state.descCache.has(vid)) continue
        if (cache.get(vid) != null) continue
        if (state.descInFlight.has(vid)) continue
        if (state.descQueued.has(vid)) continue

        state.descQueued.add(vid)
        state.descQueue.push(vid)
        added = true
      }
      if (added) scheduleDescPumpInternal(cfg, state, cache)
    },
    { rootMargin: "200% 0px" },
  )
}

export function scheduleDescPump(cfg: Cfg, state: State, cache: DescCache): void {
  ensureDescIo(cfg, state, cache)
  scheduleDescPumpInternal(cfg, state, cache)
}

export function cancelDescPump(state: State): void {
  if (state.descTimer) {
    clearTimeout(state.descTimer)
    state.descTimer = 0
  }
}

export function destroyDescIo(state: State): void {
  state.descIo?.disconnect()
  state.descIo = null
}
