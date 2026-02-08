import type { Cfg, DescStoreState, State } from "./types"
import { getActiveSubsRoot } from "./page"
import { patchItem } from "./patching"

export function enqueue(cfg: Cfg, state: State, store: DescStoreState, node: Element): void {
  if (!state.active || state.view !== "list") return
  if (node.tagName === "YTD-RICH-ITEM-RENDERER") {
    if (state.qSet.has(node)) return
    state.qSet.add(node)
    state.q.push(node)
    scheduleProcess(cfg, state, store)
    return
  }

  const found = node.querySelectorAll ? node.querySelectorAll("ytd-rich-item-renderer") : []
  for (const it of Array.from(found)) enqueue(cfg, state, store, it as Element)
}

function scheduleProcess(cfg: Cfg, state: State, store: DescStoreState): void {
  if (state.processing) return
  state.processing = true

  const run = () => {
    state.processing = false
    processQueue(cfg, state, store)
  }

  const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: any) => void)
  if (ric) ric(run, { timeout: 300 })
  else setTimeout(run, 80)
}

function processQueue(cfg: Cfg, state: State, store: DescStoreState): void {
  if (!state.active || state.view !== "list") {
    state.q.length = 0
    state.qSet.clear()
    return
  }

  let n = 0
  while (state.q.length && n < cfg.perf.maxItemsPerTick) {
    const item = state.q.shift()
    if (!item) continue
    state.qSet.delete(item)
    patchItem(cfg, state, store, item)
    n++
  }

  if (state.q.length) scheduleProcess(cfg, state, store)
}

export function enqueueAllOnce(cfg: Cfg, state: State, store: DescStoreState): void {
  if (!state.active || state.view !== "list") return
  const root = getActiveSubsRoot()
  const scope = root && (root as any).querySelectorAll ? (root as ParentNode) : document
  const items = (scope as ParentNode).querySelectorAll?.("ytd-rich-item-renderer") || []
  for (const it of Array.from(items)) enqueue(cfg, state, store, it as Element)
}

export function attachObserver(cfg: Cfg, state: State, store: DescStoreState): void {
  if (!state.active) return

  const target = getActiveSubsRoot() || document.documentElement
  if (state.observedTarget === target && state.mo) return

  state.mo?.disconnect()
  state.observedTarget = target

  state.mo = new MutationObserver(muts => {
    if (!state.active || state.view !== "list") return
    for (const m of muts) {
      for (const node of Array.from(m.addedNodes)) {
        if (node && (node as any).nodeType === 1) enqueue(cfg, state, store, node as Element)
      }
    }
  })

  state.mo.observe(target, { childList: true, subtree: true })
}

export function attachPageManagerObserver(cfg: Cfg, state: State, store: DescStoreState, onTick: () => void): void {
  if (state.pmMo) return
  const pm = document.querySelector("ytd-page-manager")
  if (!pm) return

  state.pmMo = new MutationObserver(() => {
    if (!state.active) return
    onTick()
    if (state.view === "list") {
      setTimeout(() => {
        if (!state.active || state.view !== "list") return
        enqueueAllOnce(cfg, state, store)
      }, 60)
    }
  })

  state.pmMo.observe(pm, { childList: true, subtree: true })
}
