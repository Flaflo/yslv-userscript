import type { Cfg } from "../types/config"
import type { State, ViewMode } from "../types/state"
import type { DescCache } from "../storage/desc-cache"
import { loadView, saveView, applyViewAttr, removeViewAttr } from "../storage/view"
import { isSubsPage, pageSig } from "../ui/dom/page"
import { ensureStyle } from "../ui/style"
import { ensureToggleBar, paintToggleBar, removeToggleBar, TOGGLE_ID } from "../ui/toggle-bar"
import { attachObserver, attachPageManagerObserver, enqueueAllOnce } from "../list/observer"
import { cleanupListArtifacts } from "../list/patching"
import { cancelDescPump, destroyDescIo, ensureDescIo, scheduleDescPump } from "../desc/queue"

export function createApp(cfg: Cfg, state: State, cache: DescCache, onSettings?: () => void) {
  function resetNavState(): void {
    state.processedItems = new WeakSet()
    state.q.length = 0
    state.qSet.clear()

    state.descInFlight.clear()
    state.descCache.clear()
    state.descActive = 0

    state.descQueue.length = 0
    state.descQueued.clear()
    state.descPumpRunning = false

    state.observedTarget = null
  }

  function teardown(): void {
    if (state.view === "list") {
      cleanupListArtifacts(cfg, state)
    }

    state.mo?.disconnect()
    state.mo = null
    state.observedTarget = null

    cancelDescPump(state)
    destroyDescIo(state)

    resetNavState()
    removeToggleBar()
    removeViewAttr()
  }

  function ensureToggleMountLoop(): void {
    if (!state.active) return

    ensureToggleBar(state, {
      onSwitchView(next: ViewMode) {
        if (next === state.view) return

        if (state.view === "list") {
          cleanupListArtifacts(cfg, state)
        }

        resetNavState()
        state.view = next
        saveView(next)
        applyViewAttr(next)

        attachObserver(cfg, state, cache)
        scheduleDescPump(cfg, state, cache)

        if (next === "list") {
          enqueueAllOnce(cfg, state, cache)
        }

        paintToggleBar(state)
      },
      onSettings() {
        onSettings?.()
      },
    })

    if (state.active && !document.getElementById(TOGGLE_ID)) setTimeout(ensureToggleMountLoop, 250)
  }

  function apply(): void {
    cache.load()
    cache.prune()

    ensureStyle(cfg, state)
    ensureDescIo(cfg, state, cache)
    ensureToggleMountLoop()

    attachObserver(cfg, state, cache)
    attachPageManagerObserver(cfg, state, cache, () => {
      attachObserver(cfg, state, cache)
      ensureToggleMountLoop()
    })

    scheduleDescPump(cfg, state, cache)

    if (state.view === "list") {
      enqueueAllOnce(cfg, state, cache)
    }
  }

  function syncActive(isNavFinish: boolean): void {
    const shouldBeActive = isSubsPage()
    const sig = pageSig()

    if (shouldBeActive && !state.active) {
      state.active = true
      state.lastPageSig = sig
      state.view = loadView(cfg.defaultView)
      applyViewAttr(state.view)
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
      paintToggleBar(state)
      attachObserver(cfg, state, cache)

      if (state.view === "list") {
        if (isNavFinish && sig !== state.lastPageSig) {
          state.lastPageSig = sig
          resetNavState()
          enqueueAllOnce(cfg, state, cache)
        }
      }
    }
  }

  function init(): void {
    syncActive(true)

    window.addEventListener("yt-navigate-finish", () => syncActive(true), { passive: true })
    window.addEventListener("popstate", () => syncActive(true), { passive: true })

    setTimeout(() => {
      attachPageManagerObserver(cfg, state, cache, () => {
        attachObserver(cfg, state, cache)
        ensureToggleMountLoop()
      })
    }, 250)
  }

  return { init }
}
