import type { ViewMode } from "../types/state"

const STORAGE_KEY = "yslv"
const VIEW_ATTR = "data-yslv-subs-view"

export function isViewMode(v: unknown): v is ViewMode {
  return v === "grid" || v === "list"
}

export function loadView(defaultView: ViewMode = "grid"): ViewMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return isViewMode(raw) ? raw : defaultView
  } catch {
    return defaultView
  }
}

export function saveView(mode: ViewMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {}
}

export function applyViewAttr(mode: ViewMode): void {
  document.documentElement.setAttribute(VIEW_ATTR, mode)
}

export function removeViewAttr(): void {
  document.documentElement.removeAttribute(VIEW_ATTR)
}
