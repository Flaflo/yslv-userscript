import { h } from "../dom/helpers"

export function selectEl(id: string, options: { value: string; label: string }[]): HTMLSelectElement {
  const s = h("select", { id, class: "yslv-m-select" })
  for (const o of options) s.appendChild(h("option", { value: o.value }, o.label))
  return s
}

export function numOpts(min: number, max: number): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = []
  for (let i = min; i <= max; i++) out.push({ value: String(i), label: String(i) })
  return out
}
