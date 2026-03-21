const YT_BTN = "yt-spec-button-shape-next"
const YT_BTN_TEXT = `${YT_BTN}--text`
const YT_BTN_TONAL = `${YT_BTN}--tonal`
const YT_BTN_MONO = `${YT_BTN}--mono`
const YT_BTN_SIZE_M = `${YT_BTN}--size-m`
const YT_BTN_ICON = `${YT_BTN}--icon-button`
const YT_BTN_ICON_WRAP = `${YT_BTN}__icon`
const YT_BTN_TEXT_CONTENT = `${YT_BTN}__button-text-content`
const YT_ATTR_STRING = "yt-core-attributed-string"
const YT_TOUCH_FB = "yt-spec-touch-feedback-shape"
const YT_TOUCH_FB_RESPONSE = `${YT_TOUCH_FB}--touch-response`
const YT_TOUCH_FB_DOWN = `${YT_TOUCH_FB}--down`
const YT_TOUCH_FB_STROKE = `${YT_TOUCH_FB}__stroke`
const YT_TOUCH_FB_FILL = `${YT_TOUCH_FB}__fill`
const YT_BTN_VM_HOST = "ytSpecButtonViewModelHost"

export const YT_ICON_BTN = [YT_BTN, YT_BTN_TEXT, YT_BTN_MONO, YT_BTN_SIZE_M, YT_BTN_ICON].join(" ")
export const YT_ICON_BTN_ACTIVE = [YT_BTN, YT_BTN_TONAL, YT_BTN_MONO, YT_BTN_SIZE_M, YT_BTN_ICON].join(" ")

function appendTouchFeedback(btn: HTMLButtonElement): void {
  const fb = document.createElement("div")
  fb.setAttribute("aria-hidden", "true")
  fb.className = `${YT_TOUCH_FB} ${YT_TOUCH_FB_RESPONSE}`

  const stroke = document.createElement("div")
  stroke.className = YT_TOUCH_FB_STROKE

  const fill = document.createElement("div")
  fill.className = YT_TOUCH_FB_FILL

  fb.appendChild(stroke)
  fb.appendChild(fill)
  btn.appendChild(fb)

  btn.addEventListener("mousedown", () => fb.classList.add(YT_TOUCH_FB_DOWN))
  btn.addEventListener("mouseup", () => fb.classList.remove(YT_TOUCH_FB_DOWN))
  btn.addEventListener("mouseleave", () => fb.classList.remove(YT_TOUCH_FB_DOWN))
}

function wrapInButtonViewModel(btn: HTMLButtonElement): Element {
  const vm = document.createElement("button-view-model")
  vm.className = YT_BTN_VM_HOST
  vm.appendChild(btn)
  return vm
}

export function iconButton(label: string, icon: () => SVGSVGElement, opts: { wrap: false }): HTMLButtonElement
export function iconButton(label: string, icon: () => SVGSVGElement, opts?: { wrap?: true }): Element
export function iconButton(
  label: string,
  icon: () => SVGSVGElement,
  opts?: { wrap?: boolean },
): HTMLButtonElement | Element {
  const b = document.createElement("button")
  b.className = YT_ICON_BTN
  b.type = "button"
  b.setAttribute("aria-label", label)

  const ic = document.createElement("div")
  ic.className = YT_BTN_ICON_WRAP
  ic.appendChild(icon())
  b.appendChild(ic)
  appendTouchFeedback(b)

  return opts?.wrap === false ? b : wrapInButtonViewModel(b)
}

type TextButtonStyle = "text" | "outline"
type TextButtonColor = "mono" | "call-to-action"

export function textButton(
  text: string,
  style: TextButtonStyle = "text",
  color: TextButtonColor = "mono",
): HTMLButtonElement {
  const b = document.createElement("button")
  b.className = [YT_BTN, `${YT_BTN}--${style}`, `${YT_BTN}--${color}`, YT_BTN_SIZE_M].join(" ")
  b.type = "button"

  const content = document.createElement("div")
  content.className = YT_BTN_TEXT_CONTENT

  const span = document.createElement("span")
  span.className = YT_ATTR_STRING
  span.textContent = text
  content.appendChild(span)

  b.appendChild(content)
  appendTouchFeedback(b)
  return b
}
