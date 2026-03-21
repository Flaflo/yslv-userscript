import type { State } from "../../types/state"
import type { ViewMode } from "../../types/state"
import { iconButton, YT_ICON_BTN_ACTIVE } from "../components/button/button"
import { icons } from "../assets/icons"
import { getActiveSubsDoc } from "../dom/page"

export const TOGGLE_ID = "yslv-subs-toggle"

const TOGGLE_MOUNT_SELECTOR =
  'ytd-browse[page-subtype="subscriptions"] ytd-shelf-renderer .grid-subheader #title-container #subscribe-button,' +
  'ytd-two-column-browse-results-renderer[page-subtype="subscriptions"] ytd-shelf-renderer .grid-subheader #title-container #subscribe-button'

const YT_ICON_BTN_BASE = [
  "yt-spec-button-shape-next",
  "yt-spec-button-shape-next--text",
  "yt-spec-button-shape-next--mono",
  "yt-spec-button-shape-next--size-m",
  "yt-spec-button-shape-next--icon-button",
].join(" ")

export function paintToggleBar(state: State): void {
  const root = document.getElementById(TOGGLE_ID)
  if (!root) return
  root.querySelectorAll<HTMLButtonElement>("button[data-mode]").forEach((b) => {
    const m = b.getAttribute("data-mode")
    b.className = m === state.view ? YT_ICON_BTN_ACTIVE : YT_ICON_BTN_BASE
  })
}

export function removeToggleBar(): void {
  const root = document.getElementById(TOGGLE_ID)
  if (root) root.remove()
}

type ToggleBarDeps = {
  onSwitchView: (next: ViewMode) => void
  onSettings: () => void
}

export function ensureToggleBar(state: State, deps: ToggleBarDeps): void {
  const existing = document.getElementById(TOGGLE_ID)
  if (existing && existing.isConnected) {
    paintToggleBar(state)
    return
  }

  const subscribeBtn = (getActiveSubsDoc() as ParentNode).querySelector(TOGGLE_MOUNT_SELECTOR) as Element | null
  const titleContainer = (subscribeBtn as any)?.closest?.("#title-container") || null
  if (!subscribeBtn || !titleContainer) return

  document.querySelectorAll(`#${TOGGLE_ID}`).forEach((n) => n.remove())

  const root = document.createElement("div")
  root.id = TOGGLE_ID

  const gridWrap = iconButton("Grid view", icons.grid)
  const gridBtn = gridWrap.querySelector("button")!
  gridBtn.setAttribute("data-mode", "grid")
  root.appendChild(gridWrap)

  const listWrap = iconButton("List view", icons.list)
  const listBtn = listWrap.querySelector("button")!
  listBtn.setAttribute("data-mode", "list")
  root.appendChild(listWrap)

  const settingsWrap = iconButton("Settings", icons.settings)
  const settingsBtn = settingsWrap.querySelector("button")!
  settingsBtn.addEventListener("click", () => deps.onSettings())
  root.appendChild(settingsWrap)

  root.addEventListener("click", (e) => {
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
  paintToggleBar(state)
}
