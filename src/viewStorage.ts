import type { Cfg, ViewMode } from "./types"
import { isViewMode } from "./state"

export function loadView(cfg: Cfg): ViewMode {
  try {
    const v = localStorage.getItem(cfg.storageKey)
    return isViewMode(v) ? v : cfg.defaultView
  } catch {
    return cfg.defaultView
  }
}

export function saveView(cfg: Cfg, v: ViewMode): void {
  try {
    localStorage.setItem(cfg.storageKey, v)
  } catch {}
}

export function applyViewAttr(cfg: Cfg, v: ViewMode): void {
  document.documentElement.setAttribute(cfg.attr.view, v)
}

export function clearViewAttr(cfg: Cfg): void {
  document.documentElement.removeAttribute(cfg.attr.view)
}
