import type { Cfg, DescStoreState, ShimmerState, State, ViewMode } from "./types"
import { clearViewAttr, loadView, saveView, applyViewAttr } from "./viewStorage"
import { isSubsPage, pageSig } from "./page"
import { ensureDescStoreLoaded, pruneDescStore } from "./descStore"
import { ensureStyle } from "./style"
import { ensureToggle, paintToggle, removeToggle } from "./toggle"
import { attachObserver, attachPageManagerObserver, enqueueAllOnce } from "./observer"
import { cleanupListArtifacts } from "./patching"
import { ensureDescQueueLoop } from "./queue"
import { startShimmer, stopShimmer } from "./shimmer"
import { restoreMovedAvatars, restoreMovedMetaAnchors } from "./meta"

export function createApp(cfg: Cfg, state: State, shimmer: ShimmerState, store: DescStoreState) {
  function resetNavState(): void {
    state.processedItems = new WeakSet()
    state.q.length = 0
    state.qSet.clear()

    state.descInFlight.clear()
    state.descCache.clear()
    state.descFetches = 0
    state.descActive = 0

    state.descQueue.length = 0
    state.descQueued.clear()
    state.descPumpRunning = false
    state.lastQueueSig = ""

    state.observedTarget = null
  }

  function teardown(): void {
    stopShimmer(cfg, shimmer)

    if (state.view === "list") {
      cleanupListArtifacts(cfg, state)
      restoreMovedAvatars(state)
      restoreMovedMetaAnchors(state)
    }

    state.mo?.disconnect()
    state.mo = null
    state.observedTarget = null

    if (state.descTimer) {
      clearInterval(state.descTimer)
      state.descTimer = 0
    }

    resetNavState()
    removeToggle(cfg)
    clearViewAttr(cfg)
  }

  function ensureToggleMountLoop(): void {
    if (!state.active) return

    ensureToggle(cfg, state, {
      onSwitchView(next: ViewMode) {
        if (next === state.view) return

        if (state.view === "list") {
          cleanupListArtifacts(cfg, state)
          restoreMovedAvatars(state)
          restoreMovedMetaAnchors(state)
        }

        resetNavState()
        state.view = next
        saveView(cfg, next)
        applyViewAttr(cfg, next)

        attachObserver(cfg, state, store)
        ensureDescQueueLoop(cfg, state, store, shimmer)

        if (next === "list") {
          enqueueAllOnce(cfg, state, store)
          startShimmer(cfg, state, shimmer)
        } else {
          stopShimmer(cfg, shimmer)
        }

        paintToggle(cfg, state)
      },
    })

    if (state.active && !document.getElementById(cfg.ids.toggle)) setTimeout(ensureToggleMountLoop, 250)
  }

  function apply(): void {
    ensureDescStoreLoaded(cfg, store)
    pruneDescStore(cfg, store)

    ensureStyle(cfg, state)
    ensureToggleMountLoop()

    attachObserver(cfg, state, store)
    attachPageManagerObserver(cfg, state, store, () => {
      attachObserver(cfg, state, store)
      ensureToggleMountLoop()
    })

    ensureDescQueueLoop(cfg, state, store, shimmer)

    if (state.view === "list") {
      enqueueAllOnce(cfg, state, store)
      startShimmer(cfg, state, shimmer)
    } else {
      stopShimmer(cfg, shimmer)
    }
  }

  function syncActive(isNavFinish: boolean): void {
    const shouldBeActive = isSubsPage()
    const sig = pageSig()

    if (shouldBeActive && !state.active) {
      state.active = true
      state.lastPageSig = sig
      state.view = loadView(cfg)
      applyViewAttr(cfg, state.view)
      apply()
      return
    }

    if (!shouldBeActive && state.active) {
      state.active = false
      state.lastPageSig = sig
      teardown()
      return
    }

    if (shouldBeActive && state.active) {
      ensureToggleMountLoop()
      paintToggle(cfg, state)
      attachObserver(cfg, state, store)

      if (state.view === "list") {
        if (isNavFinish && sig !== state.lastPageSig) {
          state.lastPageSig = sig
          resetNavState()
          enqueueAllOnce(cfg, state, store)
          startShimmer(cfg, state, shimmer)
        }
      } else {
        stopShimmer(cfg, shimmer)
      }
    }
  }

  function init(): void {
    syncActive(true)

    window.addEventListener("yt-navigate-finish", () => syncActive(true), { passive: true })
    window.addEventListener("popstate", () => syncActive(true), { passive: true })

    setTimeout(() => {
      attachPageManagerObserver(cfg, state, store, () => {
        attachObserver(cfg, state, store)
        ensureToggleMountLoop()
      })
    }, 250)
  }

  return { init }
}
