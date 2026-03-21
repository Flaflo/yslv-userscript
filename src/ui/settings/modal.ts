import type { UserSettings } from "../../types/settings"
import type { ViewMode } from "../../types/state"
import { loadSettings, saveSettings, defaultSettings } from "../../storage/settings"
import { h } from "../dom/helpers"
import { icons } from "../assets/icons"
import { createToggle, type Toggle } from "../components/toggle"
import { iconButtonStandalone, textButton } from "../components/button"
import modalCss from "./modal.css?raw"

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
  fetchDesc: Toggle
  sentenceCount: HTMLSelectElement
  maxDescChars: HTMLInputElement
  showSkeleton: Toggle
}

function selectEl(id: string, options: { value: string; label: string }[]): HTMLSelectElement {
  const s = h("select", { id, class: "yslv-m-select" })
  for (const o of options) s.appendChild(h("option", { value: o.value }, o.label))
  return s
}

function numOpts(min: number, max: number): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = []
  for (let i = min; i <= max; i++) out.push({ value: String(i), label: String(i) })
  return out
}

function paperItem(children: Node[]): HTMLElement {
  const item = document.createElement("tp-yt-paper-item") as HTMLElement
  item.setAttribute("role", "option")
  item.classList.add("yslv-m-item")
  for (const child of children) item.appendChild(child)
  return item
}

function itemText(label: string, sub?: string): HTMLElement {
  const wrap = h("div", { class: "yslv-m-item-text" })
  wrap.appendChild(h("div", { class: "yslv-m-item-label" }, label))
  if (sub) wrap.appendChild(h("div", { class: "yslv-m-item-sub" }, sub))
  return wrap
}

function menuItem(label: string, control: Element | Node, sub?: string): HTMLElement {
  return paperItem([itemText(label, sub), control as Node])
}

function numberItem(
  label: string,
  id: string,
  min: number,
  max: number,
  step: number,
  sub?: string,
): { item: HTMLElement; input: HTMLInputElement } {
  const input = h("input", {
    id,
    type: "number",
    class: "yslv-m-number",
    min: String(min),
    max: String(max),
    step: String(step),
  })
  const item = menuItem(label, input, sub)
  return { item, input }
}

function createPaperDialog(): HTMLElement {
  const dlg = document.createElement("tp-yt-paper-dialog") as HTMLElement
  dlg.className = "yslv-m-dialog"
  return dlg
}

function openPaperDialog(dlg: HTMLElement): void {
  const applyLayout = () => {
    dlg.style.display = "flex"
    dlg.style.flexDirection = "column"
    dlg.style.position = "relative"
    dlg.style.margin = "0"
  }
  const d = dlg as any
  if (typeof d.open === "function") {
    d.open()
    applyLayout()
  } else {
    customElements.whenDefined("tp-yt-paper-dialog").then(() => {
      if (typeof (dlg as any).open === "function") (dlg as any).open()
      applyLayout()
    })
  }
}

function closePaperDialog(dlg: HTMLElement): void {
  const d = dlg as any
  if (typeof d.close === "function") d.close()
}

function buildModal(refs: Refs) {
  const closeBtn = iconButtonStandalone("Close", icons.close)

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

  // Text section
  refs.titleClamp = selectEl("ym-titleClamp", numOpts(1, 4))
  refs.descClamp = selectEl("ym-descClamp", numOpts(1, 4))
  refs.hideMostRelevant = createToggle()
  refs.hideShorts = createToggle()

  scroll.appendChild(h("div", { class: "yslv-m-section" }, "Text"))
  scroll.appendChild(menuItem("Title lines", refs.titleClamp, "Maximum lines for video titles"))
  scroll.appendChild(menuItem("Description lines", refs.descClamp, "Maximum lines for descriptions"))
  scroll.appendChild(menuItem('Hide "Most Relevant"', refs.hideMostRelevant.el, "Remove the sort label from channels"))
  scroll.appendChild(menuItem("Hide Shorts", refs.hideShorts.el, "Hide the Shorts shelf and all Shorts items"))

  scroll.appendChild(h("div", { class: "yslv-m-divider" }))

  // Descriptions section
  refs.fetchDesc = createToggle()
  refs.sentenceCount = selectEl("ym-sentenceCount", numOpts(1, 5))
  const mc = numberItem("Max characters", "ym-maxDescChars", 100, 400, 10, "Character limit for descriptions")
  refs.maxDescChars = mc.input
  refs.showSkeleton = createToggle()

  scroll.appendChild(h("div", { class: "yslv-m-section" }, "Descriptions"))
  scroll.appendChild(menuItem("Fetch descriptions", refs.fetchDesc.el, "Load video descriptions via API"))
  scroll.appendChild(menuItem("Sentence count", refs.sentenceCount, "Number of sentences to show"))
  scroll.appendChild(mc.item)
  scroll.appendChild(menuItem("Skeleton loading", refs.showSkeleton.el, "Show shimmer placeholder while loading"))

  const resetBtn = textButton("Reset defaults", "text", "mono")
  const saveBtn = textButton("Save", "outline", "call-to-action")
  const footer = h("div", { class: "yslv-m-footer" }, resetBtn, saveBtn)

  const dialog = createPaperDialog()
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
  styleEl.textContent = modalCss
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
