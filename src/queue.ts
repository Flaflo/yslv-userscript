import type { Cfg, DescStoreState, ShimmerState, State } from "./types"
import { buildDescQueueFromDom, fetchDescriptionForVideoId, updateDescDomForVid } from "./desc"
import { pruneDescStore } from "./descStore"
import { startShimmer, stopShimmer } from "./shimmer"

export async function pumpDescQueue(cfg: Cfg, state: State, store: DescStoreState): Promise<void> {
  if (state.descPumpRunning) return
  state.descPumpRunning = true
  try {
    while (state.active && state.view === "list" && state.descQueue.length) {
      const vid = state.descQueue.shift()
      if (!vid) continue
      state.descQueued.delete(vid)

      const txt = await fetchDescriptionForVideoId(cfg, state, store, vid)
      updateDescDomForVid(cfg, vid, txt || "")
    }
  } finally {
    state.descPumpRunning = false
  }
}

export function ensureDescQueueLoop(cfg: Cfg, state: State, store: DescStoreState, shimmer: ShimmerState): void {
  if (state.descTimer) clearInterval(state.descTimer)
  if (!state.active) return

  state.descTimer = window.setInterval(() => {
    if (!state.active || state.view !== "list") {
      stopShimmer(cfg, shimmer)
      return
    }

    pruneDescStore(cfg, store)
    buildDescQueueFromDom(cfg, state, store)
    void pumpDescQueue(cfg, state, store)

    if (document.querySelector(`.${cfg.cls.desc}.${cfg.cls.descSkel}`)) startShimmer(cfg, state, shimmer)
    else stopShimmer(cfg, shimmer)
  }, cfg.perf.descQueueIntervalMs)
}
