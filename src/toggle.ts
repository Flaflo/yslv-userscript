import type { Cfg, State, ViewMode } from "./types"
import { svgEl } from "./dom"
import { getActiveSubsDoc } from "./page"

export function paintToggle(cfg: Cfg, state: State): void {
  const root = document.getElementById(cfg.ids.toggle)
  if (!root) return
  root.querySelectorAll<HTMLButtonElement>("button[data-mode]").forEach(b => {
    const m = b.getAttribute("data-mode")
    if (m === state.view) b.setAttribute("data-active", "")
    else b.removeAttribute("data-active")
  })
}

export function removeToggle(cfg: Cfg): void {
  const root = document.getElementById(cfg.ids.toggle)
  if (root) root.remove()
}

type EnsureToggleDeps = {
  onSwitchView: (next: ViewMode) => void
}

export function ensureToggle(cfg: Cfg, state: State, deps: EnsureToggleDeps): void {
  const existing = document.getElementById(cfg.ids.toggle)
  if (existing && existing.isConnected) {
    paintToggle(cfg, state)
    return
  }

  const subscribeBtn = (getActiveSubsDoc() as ParentNode).querySelector(cfg.toggleMountSelector) as Element | null
  const titleContainer = (subscribeBtn as any)?.closest?.("#title-container") || null
  if (!subscribeBtn || !titleContainer) return

  document.querySelectorAll(`#${cfg.ids.toggle}`).forEach(n => n.remove())

  const root = document.createElement("div")
  root.id = cfg.ids.toggle

  const mkBtn = (mode: ViewMode, label: string, svg: SVGSVGElement) => {
    const b = document.createElement("button")
    b.className = cfg.cls.btn
    b.type = "button"
    b.setAttribute("data-mode", mode)
    b.setAttribute("aria-label", label)

    const ic = document.createElement("span")
    ic.className = cfg.cls.btnIcon
    ic.appendChild(svg)
    b.appendChild(ic)

    return b
  }

  const bGrid = mkBtn("grid", "Grid", svgEl(["M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"]))
  const bList = mkBtn(
    "list",
    "List",
    svgEl(["M4 6h3v3H4V6zm5 0h11v3H9V6zM4 11h3v3H4v-3zm5 0h11v3H9v-3zM4 16h3v3H4v-3zm5 0h11v3H9v-3z"])
  )

  root.appendChild(bGrid)
  root.appendChild(bList)

  root.addEventListener("click", e => {
    const target = e.target as Element | null
    const btn = target?.closest?.("button[data-mode]") as HTMLButtonElement | null
    if (!btn) return
    const mode = btn.getAttribute("data-mode")
    if (mode !== "grid" && mode !== "list") return
    const next = mode as ViewMode
    if (next === state.view) return
    deps.onSwitchView(next)
  })

  subscribeBtn.insertAdjacentElement("afterend", root)
  paintToggle(cfg, state)
}
