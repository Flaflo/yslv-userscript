import type { Cfg } from "../types/config"
import type { State } from "../types/state"
import type { DescCache } from "../storage/desc-cache"
import { ensureDesc } from "../desc/desc"
import { ensureInlineMeta, ensureRowHeader, restoreMovedAvatars, restoreMovedMetaAnchors } from "./meta"
import {
  SEL_LOCKUP,
  SEL_SHORTS_LOCKUP,
  SEL_TEXT_CONTAINER,
  SEL_TEXT_CONTAINER_FALLBACK,
  TAG_RICH_ITEM,
} from "../core/selectors"

export function patchItem(cfg: Cfg, state: State, cache: DescCache, item: Element): void {
  if (!state.active || state.view !== "list") return
  if (item.tagName !== TAG_RICH_ITEM) return
  if (state.processedItems.has(item)) return

  const shortsLockup = item.querySelector(SEL_SHORTS_LOCKUP)
  if (shortsLockup && cfg.list.shorts.enabled) {
    state.processedItems.add(item)
    item.classList.add(cfg.cls.isShort)
    return
  }

  item.classList.remove(cfg.cls.isShort)

  const lockup = item.querySelector(SEL_LOCKUP)
  if (!lockup) return

  const textContainer = lockup.querySelector(SEL_TEXT_CONTAINER) || lockup.querySelector(SEL_TEXT_CONTAINER_FALLBACK)
  if (!textContainer) return

  state.processedItems.add(item)
  item.classList.add(cfg.cls.patched)

  ensureRowHeader(cfg, state, item, lockup)
  ensureInlineMeta(cfg, state, textContainer, lockup)
  ensureDesc(cfg, state, cache, textContainer, lockup)
}

export function cleanupListArtifacts(cfg: Cfg, state: State): void {
  restoreMovedAvatars(state)
  restoreMovedMetaAnchors(state)

  document.querySelectorAll(`.${cfg.cls.patched}`).forEach((n) => n.classList.remove(cfg.cls.patched))
  document.querySelectorAll(`.${cfg.cls.rowHead}`).forEach((n) => n.remove())
  document.querySelectorAll(`.${cfg.cls.metaRow}`).forEach((n) => n.remove())
  document.querySelectorAll(`.${cfg.cls.desc}`).forEach((n) => n.remove())

  state.descQueue.length = 0
  state.descQueued.clear()
  state.lastQueueSig = ""
}
