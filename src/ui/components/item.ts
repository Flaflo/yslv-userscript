import { h } from "../dom/helpers"

export function paperItem(children: Node[]): HTMLElement {
  const item = document.createElement("tp-yt-paper-item") as HTMLElement
  item.setAttribute("role", "option")
  item.classList.add("yslv-m-item")
  for (const child of children) item.appendChild(child)
  return item
}

export function itemText(label: string, sub?: string): HTMLElement {
  const wrap = h("div", { class: "yslv-m-item-text" })
  wrap.appendChild(h("div", { class: "yslv-m-item-label" }, label))
  if (sub) wrap.appendChild(h("div", { class: "yslv-m-item-sub" }, sub))
  return wrap
}

export function menuItem(label: string, control: Element | Node, sub?: string): HTMLElement {
  return paperItem([itemText(label, sub), control as Node])
}

export function numberItem(
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
