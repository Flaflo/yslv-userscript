// YouTube ships two parallel class systems for buttons during the v2_0 rollout:
//   - legacy kebab: yt-spec-button-shape-next, --text, __icon, ...
//   - new camelCase: ytSpecButtonShapeNextHost, ytSpecButtonShapeNextText, ...
// Emit both so whichever stylesheet the page currently loads will style our buttons.

const BTN_BASE = ["yt-spec-button-shape-next", "ytSpecButtonShapeNextHost"]
const BTN_TEXT = ["yt-spec-button-shape-next--text", "ytSpecButtonShapeNextText"]
const BTN_TONAL = ["yt-spec-button-shape-next--tonal", "ytSpecButtonShapeNextTonal"]
const BTN_MONO = ["yt-spec-button-shape-next--mono", "ytSpecButtonShapeNextMono"]
const BTN_SIZE_M = ["yt-spec-button-shape-next--size-m", "ytSpecButtonShapeNextSizeM"]
const BTN_ICON = ["yt-spec-button-shape-next--icon-button", "ytSpecButtonShapeNextIconButton"]
const BTN_OUTLINE = ["yt-spec-button-shape-next--outline", "ytSpecButtonShapeNextOutline"]
const BTN_CTA = ["yt-spec-button-shape-next--call-to-action", "ytSpecButtonShapeNextCallToAction"]

const BTN_ICON_WRAP = ["yt-spec-button-shape-next__icon", "ytSpecButtonShapeNextIcon"]
const BTN_TEXT_CONTENT = ["yt-spec-button-shape-next__button-text-content", "ytSpecButtonShapeNextButtonTextContent"]
const ATTR_STRING = ["yt-core-attributed-string", "ytCoreAttributedString"]

const TOUCH_FB = ["yt-spec-touch-feedback-shape", "ytSpecTouchFeedbackShapeHost"]
const TOUCH_FB_RESPONSE = ["yt-spec-touch-feedback-shape--touch-response", "ytSpecTouchFeedbackShapeTouchResponse"]
const TOUCH_FB_DOWN = "yt-spec-touch-feedback-shape--down"
const TOUCH_FB_STROKE = ["yt-spec-touch-feedback-shape__stroke", "ytSpecTouchFeedbackShapeStroke"]
const TOUCH_FB_FILL = ["yt-spec-touch-feedback-shape__fill", "ytSpecTouchFeedbackShapeFill"]

const BTN_VM_HOST = "ytSpecButtonViewModelHost"

const cls = (...groups: string[][]) => groups.flat().join(" ")

export const YT_ICON_BTN = cls(BTN_BASE, BTN_TEXT, BTN_MONO, BTN_SIZE_M, BTN_ICON)
export const YT_ICON_BTN_ACTIVE = cls(BTN_BASE, BTN_TONAL, BTN_MONO, BTN_SIZE_M, BTN_ICON)

function appendTouchFeedback(btn: HTMLButtonElement): void {
  const fb = document.createElement("div")
  fb.setAttribute("aria-hidden", "true")
  fb.className = cls(TOUCH_FB, TOUCH_FB_RESPONSE)

  const stroke = document.createElement("div")
  stroke.className = TOUCH_FB_STROKE.join(" ")

  const fill = document.createElement("div")
  fill.className = TOUCH_FB_FILL.join(" ")

  fb.appendChild(stroke)
  fb.appendChild(fill)
  btn.appendChild(fb)

  btn.addEventListener("mousedown", () => fb.classList.add(TOUCH_FB_DOWN))
  btn.addEventListener("mouseup", () => fb.classList.remove(TOUCH_FB_DOWN))
  btn.addEventListener("mouseleave", () => fb.classList.remove(TOUCH_FB_DOWN))
}

function wrapInButtonViewModel(btn: HTMLButtonElement): Element {
  const vm = document.createElement("button-view-model")
  vm.className = BTN_VM_HOST
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
  ic.className = BTN_ICON_WRAP.join(" ")
  ic.appendChild(icon())
  b.appendChild(ic)
  appendTouchFeedback(b)

  return opts?.wrap === false ? b : wrapInButtonViewModel(b)
}

type TextButtonStyle = "text" | "outline"
type TextButtonColor = "mono" | "call-to-action"

const STYLE_CLASSES: Record<TextButtonStyle, string[]> = {
  text: BTN_TEXT,
  outline: BTN_OUTLINE,
}

const COLOR_CLASSES: Record<TextButtonColor, string[]> = {
  mono: BTN_MONO,
  "call-to-action": BTN_CTA,
}

export function textButton(
  text: string,
  style: TextButtonStyle = "text",
  color: TextButtonColor = "mono",
): HTMLButtonElement {
  const b = document.createElement("button")
  b.className = cls(BTN_BASE, STYLE_CLASSES[style], COLOR_CLASSES[color], BTN_SIZE_M)
  b.type = "button"

  const content = document.createElement("div")
  content.className = BTN_TEXT_CONTENT.join(" ")

  const span = document.createElement("span")
  span.className = ATTR_STRING.join(" ")
  span.textContent = text
  content.appendChild(span)

  b.appendChild(content)
  appendTouchFeedback(b)
  return b
}
