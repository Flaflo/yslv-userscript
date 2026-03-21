export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag)
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
  for (const c of children) e.append(typeof c === "string" ? document.createTextNode(c) : c)
  return e
}

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

  const hosts = Array.from(
    (frag as unknown as ParentNode).querySelectorAll?.(".ytIconWrapperHost, .yt-icon-shape") || [],
  )
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
