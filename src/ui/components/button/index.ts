const YT_ICON_BTN = [
  "yt-spec-button-shape-next",
  "yt-spec-button-shape-next--text",
  "yt-spec-button-shape-next--mono",
  "yt-spec-button-shape-next--size-m",
  "yt-spec-button-shape-next--icon-button",
].join(" ")

function appendTouchFeedback(btn: HTMLButtonElement): void {
  const fb = document.createElement("div")
  fb.setAttribute("aria-hidden", "true")
  fb.className = "yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response"

  const stroke = document.createElement("div")
  stroke.className = "yt-spec-touch-feedback-shape__stroke"

  const fill = document.createElement("div")
  fill.className = "yt-spec-touch-feedback-shape__fill"

  fb.appendChild(stroke)
  fb.appendChild(fill)
  btn.appendChild(fb)

  const DOWN = "yt-spec-touch-feedback-shape--down"
  btn.addEventListener("mousedown", () => fb.classList.add(DOWN))
  btn.addEventListener("mouseup", () => fb.classList.remove(DOWN))
  btn.addEventListener("mouseleave", () => fb.classList.remove(DOWN))
}

export const YT_ICON_BTN_ACTIVE = YT_ICON_BTN.replace("--text", "--tonal")

function wrapInButtonViewModel(btn: HTMLButtonElement): Element {
  const vm = document.createElement("button-view-model")
  vm.className = "ytSpecButtonViewModelHost"
  vm.appendChild(btn)
  return vm
}

export function iconButton(label: string, icon: () => SVGSVGElement): Element {
  const b = document.createElement("button")
  b.className = YT_ICON_BTN
  b.type = "button"
  b.setAttribute("aria-label", label)

  const ic = document.createElement("div")
  ic.className = "yt-spec-button-shape-next__icon"
  ic.appendChild(icon())
  b.appendChild(ic)
  appendTouchFeedback(b)

  return wrapInButtonViewModel(b)
}

export function iconButtonStandalone(label: string, icon: () => SVGSVGElement): HTMLButtonElement {
  const b = document.createElement("button")
  b.className = YT_ICON_BTN
  b.type = "button"
  b.setAttribute("aria-label", label)

  const ic = document.createElement("div")
  ic.className = "yt-spec-button-shape-next__icon"
  ic.appendChild(icon())
  b.appendChild(ic)
  appendTouchFeedback(b)

  return b
}

type TextButtonStyle = "text" | "outline"
type TextButtonColor = "mono" | "call-to-action"

export function textButton(
  text: string,
  style: TextButtonStyle = "text",
  color: TextButtonColor = "mono",
): HTMLButtonElement {
  const b = document.createElement("button")
  b.className = [
    "yt-spec-button-shape-next",
    `yt-spec-button-shape-next--${style}`,
    `yt-spec-button-shape-next--${color}`,
    "yt-spec-button-shape-next--size-m",
  ].join(" ")
  b.type = "button"

  const content = document.createElement("div")
  content.className = "yt-spec-button-shape-next__button-text-content"

  const span = document.createElement("span")
  span.className = "yt-core-attributed-string"
  span.textContent = text
  content.appendChild(span)

  b.appendChild(content)
  appendTouchFeedback(b)
  return b
}
