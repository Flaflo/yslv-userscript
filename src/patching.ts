import type { Cfg, DescStoreState, State } from "./types"
import { ensureDesc } from "./desc"
import { ensureInlineMeta, ensureRowHeader } from "./meta"

export function patchItem(cfg: Cfg, state: State, store: DescStoreState, item: Element): void {
  if (!state.active || state.view !== "list") return
  if (item.tagName !== "YTD-RICH-ITEM-RENDERER") return
  if (state.processedItems.has(item)) return

  const shortsLockup = item.querySelector("ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model")
  if (shortsLockup && cfg.list.shorts.enabled) {
    state.processedItems.add(item)
    item.classList.add(cfg.cls.isShort)
    return
  }

  item.classList.remove(cfg.cls.isShort)

  const lockup = item.querySelector("yt-lockup-view-model")
  if (!lockup) return

  const textContainer =
    lockup.querySelector(".yt-lockup-metadata-view-model__text-container") || lockup.querySelector("yt-lockup-metadata-view-model")
  if (!textContainer) return

  state.processedItems.add(item)

  ensureRowHeader(cfg, state, item, lockup)
  ensureInlineMeta(cfg, state, textContainer, lockup)
  ensureDesc(cfg, state, store, textContainer, lockup)
}

export function cleanupListArtifacts(cfg: Cfg, state: State): void {
  document.querySelectorAll(`.${cfg.cls.rowHead}`).forEach(n => n.remove())
  document.querySelectorAll(`.${cfg.cls.metaRow}`).forEach(n => n.remove())
  document.querySelectorAll(`.${cfg.cls.desc}`).forEach(n => n.remove())

  state.descQueue.length = 0
  state.descQueued.clear()
  state.lastQueueSig = ""
}
