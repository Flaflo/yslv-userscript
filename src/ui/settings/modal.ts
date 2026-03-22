import type { UserSettings } from "../../types/settings"
import type { ViewMode } from "../../types/state"
import { loadSettings, saveSettings, defaultSettings } from "../../storage/settings"
import { h } from "../dom/helpers"
import { icons } from "../assets/icons"
import { createToggle, type Toggle } from "../components/toggle"
import { iconButton, textButton } from "../components/button"
import { createPaperDialog, openPaperDialog, closePaperDialog } from "../components/dialog"
import { menuItem, numberItem } from "../components/item"
import { selectEl, numOpts } from "../components/select"
import allCss from "./modal.bundle.css?inline"

const MODAL_ID = "yslv-settings-modal"
const STYLE_ID = "yslv-settings-modal-style"

type Refs = {
  defaultView: HTMLSelectElement
  maxWidth: HTMLInputElement
  thumbW: HTMLInputElement
  thumbRadius: HTMLInputElement
  separator: Toggle
  titleClamp: HTMLSelectElement
  descClamp: HTMLSelectElement
  hideMostRelevant: Toggle
  hideShorts: Toggle
  hideMiniGuide: Toggle
  fetchDesc: Toggle
  sentenceCount: HTMLSelectElement
  maxDescChars: HTMLInputElement
  showSkeleton: Toggle
}

function buildModal(refs: Refs) {
  const closeBtn = iconButton("Close", icons.close, { wrap: false })

  const header = h(
    "div",
    { class: "yslv-m-header" },
    h("span", { class: "yslv-m-header-title" }, "YSLV Settings"),
    closeBtn,
  )

  const scroll = h("div", { class: "yslv-m-scroll" })

  // Layout section
  refs.defaultView = selectEl("ym-defaultView", [
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
  ])
  refs.maxWidth = h("input", {
    id: "ym-maxWidth",
    type: "number",
    class: "yslv-m-number",
    min: "600",
    max: "2400",
    step: "20",
  })
  const tw = numberItem("Thumbnail width", "ym-thumbW", 160, 320, 4, "Width of video thumbnails (px)")
  refs.thumbW = tw.input
  const tr = numberItem("Border radius", "ym-thumbRadius", 0, 20, 1, "Roundness of thumbnail corners (px)")
  refs.thumbRadius = tr.input
  refs.separator = createToggle()

  scroll.appendChild(h("div", { class: "yslv-m-section" }, "Layout"))
  scroll.appendChild(menuItem("Default view", refs.defaultView, "View mode when page loads"))
  scroll.appendChild(menuItem("Max list width", refs.maxWidth, "Maximum width of the list in pixels"))
  scroll.appendChild(tw.item)
  scroll.appendChild(tr.item)
  scroll.appendChild(menuItem("Row separator", refs.separator.el, "Show divider line between rows"))

  scroll.appendChild(h("div", { class: "yslv-m-divider" }))

  // Content section
  refs.titleClamp = selectEl("ym-titleClamp", numOpts(1, 4))
  refs.descClamp = selectEl("ym-descClamp", numOpts(1, 4))
  refs.hideMostRelevant = createToggle()
  refs.hideShorts = createToggle()
  refs.hideMiniGuide = createToggle()

  scroll.appendChild(h("div", { class: "yslv-m-section" }, "Content"))
  scroll.appendChild(menuItem("Title lines", refs.titleClamp, "Maximum lines for video titles"))
  scroll.appendChild(menuItem('Hide "Most Relevant"', refs.hideMostRelevant.el, "Remove the Most Relevant section"))
  scroll.appendChild(menuItem("Hide Shorts", refs.hideShorts.el, "Hide the Shorts shelf and all Shorts items"))
  scroll.appendChild(menuItem("Hide mini guide", refs.hideMiniGuide.el, "Hide the sidebar icon bar in list view"))

  scroll.appendChild(h("div", { class: "yslv-m-divider" }))

  // Descriptions section
  refs.fetchDesc = createToggle()
  refs.sentenceCount = selectEl("ym-sentenceCount", numOpts(1, 5))
  const mc = numberItem("Max characters", "ym-maxDescChars", 100, 400, 10, "Character limit for descriptions")
  refs.maxDescChars = mc.input
  refs.showSkeleton = createToggle()

  scroll.appendChild(h("div", { class: "yslv-m-section" }, "Descriptions"))
  scroll.appendChild(menuItem("Fetch descriptions", refs.fetchDesc.el, "Load video descriptions via API"))
  scroll.appendChild(menuItem("Description lines", refs.descClamp, "Maximum lines for descriptions"))
  scroll.appendChild(menuItem("Sentence count", refs.sentenceCount, "Number of sentences to show"))
  scroll.appendChild(mc.item)
  scroll.appendChild(menuItem("Skeleton loading", refs.showSkeleton.el, "Show shimmer placeholder while loading"))

  const resetBtn = textButton("Reset defaults", "text", "mono")
  const saveBtn = textButton("Save", "outline", "call-to-action")
  const footer = h("div", { class: "yslv-m-footer" }, resetBtn, saveBtn)

  const dialog = createPaperDialog("yslv-m-dialog")
  dialog.append(header, scroll, footer)

  const backdrop = h("div", { class: "yslv-m-backdrop" })
  const overlay = h("div", { id: MODAL_ID })
  overlay.append(backdrop, dialog)

  return { overlay, dialog, backdrop, closeBtn, resetBtn, saveBtn }
}

function populateForm(refs: Refs, s: UserSettings): void {
  refs.defaultView.value = s.defaultView
  refs.maxWidth.value = String(s.maxWidth)
  refs.thumbW.value = String(s.thumbW)
  refs.thumbRadius.value = String(s.thumbRadius)
  refs.separator.checked = s.separator
  refs.titleClamp.value = String(s.titleClamp)
  refs.descClamp.value = String(s.descClamp)
  refs.hideMostRelevant.checked = s.hideMostRelevant
  refs.hideShorts.checked = s.hideShorts
  refs.hideMiniGuide.checked = s.hideMiniGuide
  refs.fetchDesc.checked = s.fetchDesc
  refs.sentenceCount.value = String(s.sentenceCount)
  refs.maxDescChars.value = String(s.maxDescChars)
  refs.showSkeleton.checked = s.showSkeleton
}

function readForm(refs: Refs): UserSettings {
  return {
    defaultView: refs.defaultView.value as ViewMode,
    maxWidth: Number(refs.maxWidth.value) || 1320,
    thumbW: Number(refs.thumbW.value) || 240,
    thumbRadius: Number(refs.thumbRadius.value),
    separator: refs.separator.checked,
    titleClamp: Number(refs.titleClamp.value) || 2,
    descClamp: Number(refs.descClamp.value) || 2,
    hideMostRelevant: refs.hideMostRelevant.checked,
    hideShorts: refs.hideShorts.checked,
    hideMiniGuide: refs.hideMiniGuide.checked,
    fetchDesc: refs.fetchDesc.checked,
    sentenceCount: Number(refs.sentenceCount.value) || 2,
    maxDescChars: Number(refs.maxDescChars.value) || 260,
    showSkeleton: refs.showSkeleton.checked,
  }
}

function closeModal(dialog: HTMLElement): void {
  closePaperDialog(dialog)
  document.getElementById(MODAL_ID)?.remove()
  document.getElementById(STYLE_ID)?.remove()
}

export async function openSettingsModal(onChanged?: () => void): Promise<void> {
  if (document.getElementById(MODAL_ID)) return

  const settings = await loadSettings()

  const styleEl = document.createElement("style")
  styleEl.id = STYLE_ID
  styleEl.textContent = allCss
  document.head.appendChild(styleEl)

  const refs = {} as Refs
  const { overlay, dialog, backdrop, closeBtn, resetBtn, saveBtn } = buildModal(refs)

  document.body.appendChild(overlay)
  document.body.style.overflow = "hidden"
  openPaperDialog(dialog)
  populateForm(refs, settings)

  function doClose() {
    closeModal(dialog)
    document.body.style.overflow = ""
    document.removeEventListener("keydown", onKey)
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") doClose()
  }

  document.addEventListener("keydown", onKey)
  backdrop.addEventListener("click", doClose)
  closeBtn.addEventListener("click", doClose)

  saveBtn.addEventListener("click", async () => {
    const s = readForm(refs)
    await saveSettings(s)
    onChanged?.()
    doClose()
  })

  resetBtn.addEventListener("click", () => {
    const defaults = defaultSettings()
    populateForm(refs, defaults)
  })
}
