import type { Cfg } from "../types/config"
import type { State } from "../types/state"
import type { DescCache } from "../storage/desc-cache"
import { buildDescQueueFromDom, fetchDescriptionForVideoId, updateDescDomForVid } from "."

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

export function scheduleDescPump(cfg: Cfg, state: State, cache: DescCache): void {
  if (!state.active || state.view !== "list") return

  if (state.descTimer) return

  state.descTimer = window.setTimeout(() => {
    state.descTimer = 0
    if (!state.active || state.view !== "list") return

    cache.prune()
    buildDescQueueFromDom(cfg, state, cache)
    void pumpDescQueue(cfg, state, cache)
  }, 120)
}

export function cancelDescPump(state: State): void {
  if (state.descTimer) {
    clearTimeout(state.descTimer)
    state.descTimer = 0
  }
}
