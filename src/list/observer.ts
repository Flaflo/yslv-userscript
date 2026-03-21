import type { Cfg } from "../types/config"
import type { State } from "../types/state"
import type { DescCache } from "../storage/desc-cache"
import { getActiveSubsRoot } from "../ui/dom/page"
import { patchItem } from "./patching"
import { scheduleDescPump } from "../desc/queue"
import { SEL_PAGE_MANAGER, SEL_RICH_ITEM, TAG_RICH_ITEM } from "../core/selectors"

let patching = false

export function enqueue(cfg: Cfg, state: State, cache: DescCache, node: Element): void {
  if (!state.active || state.view !== "list") return
  if (node.tagName === TAG_RICH_ITEM) {
    if (state.processedItems.has(node) || state.qSet.has(node)) return
    state.qSet.add(node)
    state.q.push(node)
    scheduleProcess(cfg, state, cache)
    return
  }

  const found = node.querySelectorAll ? node.querySelectorAll(SEL_RICH_ITEM) : []
  for (const it of Array.from(found)) enqueue(cfg, state, cache, it as Element)
}

function scheduleProcess(cfg: Cfg, state: State, cache: DescCache): void {
  if (state.processing) return
  state.processing = true

  const run = () => {
    state.processing = false
    processQueue(cfg, state, cache)
  }

  const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: any) => void)
  if (ric) ric(run, { timeout: 300 })
  else setTimeout(run, 80)
}

function processQueue(cfg: Cfg, state: State, cache: DescCache): void {
  if (!state.active || state.view !== "list") {
    state.q.length = 0
    state.qSet.clear()
    return
  }

  patching = true
  state.mo?.disconnect()

  let n = 0
  while (state.q.length && n < cfg.perf.maxItemsPerTick) {
    const item = state.q.shift()
    if (!item) continue
    state.qSet.delete(item)
    patchItem(cfg, state, cache, item)
    n++
  }

  patching = false
  if (state.mo && state.observedTarget) {
    state.mo.observe(state.observedTarget, { childList: true, subtree: true })
  }

  if (n > 0) scheduleDescPump(cfg, state, cache)
  if (state.q.length) scheduleProcess(cfg, state, cache)
}

export function enqueueAllOnce(cfg: Cfg, state: State, cache: DescCache): void {
  if (!state.active || state.view !== "list") return
  const root = getActiveSubsRoot()
  const scope = root && (root as any).querySelectorAll ? (root as ParentNode) : document
  const items = (scope as ParentNode).querySelectorAll?.(SEL_RICH_ITEM) || []
  for (const it of Array.from(items)) enqueue(cfg, state, cache, it as Element)
}

export function attachObserver(cfg: Cfg, state: State, cache: DescCache): void {
  if (!state.active) return

  const target = getActiveSubsRoot() || document.documentElement
  if (state.observedTarget === target && state.mo) return

  state.mo?.disconnect()
  state.observedTarget = target

  state.mo = new MutationObserver((muts) => {
    if (patching || !state.active || state.view !== "list") return
    for (const m of muts) {
      for (const node of Array.from(m.addedNodes)) {
        if (node && (node as any).nodeType === 1) enqueue(cfg, state, cache, node as Element)
      }

      // Polymer restamping detection
      if (m.type === "childList" && m.removedNodes.length) {
        const mutTarget = m.target as Element
        if (!mutTarget?.closest) continue
        const item = mutTarget.closest(SEL_RICH_ITEM) as Element | null
        if (item && state.processedItems.has(item) && !item.querySelector(`.${cfg.cls.desc}`)) {
          state.processedItems.delete(item)
          enqueue(cfg, state, cache, item)
        }
      }
    }
  })

  state.mo.observe(target, { childList: true, subtree: true })
}

export function attachPageManagerObserver(cfg: Cfg, state: State, cache: DescCache, onTick: () => void): void {
  if (state.pmMo) return
  const pm = document.querySelector(SEL_PAGE_MANAGER)
  if (!pm) return

  let pmTimer: ReturnType<typeof setTimeout> | null = null

  state.pmMo = new MutationObserver(() => {
    if (!state.active || pmTimer) return
    pmTimer = setTimeout(() => {
      pmTimer = null
      if (!state.active) return
      onTick()
      if (state.view === "list") enqueueAllOnce(cfg, state, cache)
    }, 200)
  })

  state.pmMo.observe(pm, { childList: true, subtree: false })
}
