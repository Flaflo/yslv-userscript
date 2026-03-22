import type { Cfg } from "../types/config"
import type { State } from "../types/state"
import type { DescCache } from "../storage/desc-cache"
import { ensureDesc } from "../desc"
import { ensureInlineMeta, ensureRowHeader, restoreMovedAvatars, restoreMovedMetaAnchors } from "./meta"
import { SEL_YSLV, SEL_LOCKUP, TAG_RICH_ITEM } from "../core/selectors"

export function patchItem(cfg: Cfg, state: State, cache: DescCache, item: Element): void {
  if (!state.active || state.view !== "list") return
  if (item.tagName !== TAG_RICH_ITEM) return
  if (state.processedItems.has(item)) return

  const shortsLockup = item.querySelector(SEL_LOCKUP.shortsLockup)
  if (shortsLockup && cfg.list.shorts.enabled) {
    state.processedItems.add(item)
    item.classList.add(SEL_YSLV.isShort)
    return
  }

  item.classList.remove(SEL_YSLV.isShort)

  const lockup = item.querySelector(SEL_LOCKUP.root)
  if (!lockup) return

  const textContainer =
    lockup.querySelector(SEL_LOCKUP.textContainer) || lockup.querySelector(SEL_LOCKUP.textContainerFallback)
  if (!textContainer) return

  state.processedItems.add(item)
  item.classList.add(SEL_YSLV.patched)

  ensureRowHeader(cfg, state, item, lockup)
  ensureInlineMeta(cfg, state, textContainer, lockup)
  ensureDesc(cfg, state, cache, textContainer, lockup)
}

export function cleanupListArtifacts(cfg: Cfg, state: State): void {
  restoreMovedAvatars(state)
  restoreMovedMetaAnchors(state)

  document.querySelectorAll(`.${SEL_YSLV.patched}`).forEach((n) => n.classList.remove(SEL_YSLV.patched))
  document.querySelectorAll(`.${SEL_YSLV.rowHead}`).forEach((n) => n.remove())
  document.querySelectorAll(`.${SEL_YSLV.metaRow}`).forEach((n) => n.remove())
  document.querySelectorAll(`.${SEL_YSLV.desc}`).forEach((n) => n.remove())

  state.descQueue.length = 0
  state.descQueued.clear()
}
