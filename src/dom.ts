export function clearChildren(el: Element | null): void {
  if (!el) return
  while (el.firstChild) el.removeChild(el.firstChild)
}

export function normalizeText(s: unknown): string {
  return String(s || "")
    .replace(/\u200B/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function cloneInto(dest: Element | null, src: Element | null): void {
  if (!dest) return
  clearChildren(dest)
  if (!src) return

  const frag = document.createDocumentFragment()
  for (const n of Array.from(src.childNodes || [])) frag.appendChild(n.cloneNode(true))

  const hosts = Array.from((frag as unknown as ParentNode).querySelectorAll?.(".ytIconWrapperHost, .yt-icon-shape") || [])
  for (const host of hosts) {
    const el = host as Element
    if (!el.querySelector("svg")) el.remove()
  }

  dest.appendChild(frag)
}

export function setTextOnly(dest: Element | null, txt: unknown): void {
  if (!dest) return
  clearChildren(dest)
  dest.textContent = normalizeText(txt)
}

export function svgEl(paths: string[], viewBox?: string): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg"
  const svg = document.createElementNS(NS, "svg")
  svg.setAttribute("viewBox", viewBox || "0 0 24 24")
  svg.setAttribute("aria-hidden", "true")
  for (const d of paths) {
    const p = document.createElementNS(NS, "path")
    p.setAttribute("d", d)
    svg.appendChild(p)
  }
  return svg
}
