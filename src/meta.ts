import type { Cfg, State } from "./types"
import { clearChildren, cloneInto, normalizeText, setTextOnly } from "./dom"

function pickChannelDisplaySource(lockup: Element): Element | null {
  const a =
    lockup.querySelector('yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/@"]') ||
    lockup.querySelector('yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/channel/"]') ||
    lockup.querySelector('a[href^="/@"]') ||
    lockup.querySelector('a[href^="/channel/"]') ||
    null

  if (a) return a

  return (
    lockup.querySelector(
      'yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row span.yt-content-metadata-view-model__metadata-text'
    ) || null
  )
}

function pickChannelAnchor(lockup: Element): HTMLAnchorElement | null {
  return (
    lockup.querySelector('yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/@"]') ||
    lockup.querySelector('yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row a[href^="/channel/"]') ||
    lockup.querySelector('a[href^="/@"]') ||
    lockup.querySelector('a[href^="/channel/"]') ||
    null
  ) as HTMLAnchorElement | null
}

function getChannelHref(lockup: Element): string {
  const a = pickChannelAnchor(lockup)
  const href = String(a?.getAttribute?.("href") || "").trim()
  if (!href) return ""
  try {
    return new URL(href, location.origin).href
  } catch {
    return ""
  }
}

function getChannelName(lockup: Element): string {
  const src = pickChannelDisplaySource(lockup)
  return normalizeText(src?.textContent || "")
}

function isIconish(node: Element | null): boolean {
  if (!node) return false
  if (node.matches("yt-icon-shape, .yt-icon-shape")) return true
  if (node.querySelector("yt-icon-shape, .yt-icon-shape")) return true
  if (node.querySelector("svg, img")) return true
  if (node.getAttribute("role") === "img") return true
  if (node.querySelector('[role="img"]')) return true
  return false
}

function collectBadgeNodesFromAnchor(a: HTMLAnchorElement | null): Element[] {
  const out: Element[] = []
  if (!a) return out

  const candidates = a.querySelectorAll(
    ".yt-core-attributed-string__image-element, .ytIconWrapperHost, .yt-core-attributed-string__image-element--image-alignment-vertical-center, yt-icon-shape, .yt-icon-shape"
  )

  const seen = new Set<string>()
  for (const el of Array.from(candidates)) {
    const node = el as Element
    let root =
      node.closest(".yt-core-attributed-string__image-element") ||
      node.closest(".ytIconWrapperHost") ||
      node.closest(".yt-core-attributed-string__image-element--image-alignment-vertical-center") ||
      node

    if (!root || root === a) continue
    if (!isIconish(root)) continue

    const key = `${root.tagName}|${root.getAttribute("class") || ""}|${root.getAttribute("aria-label") || ""}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(root)
  }

  return out
}

function normalizeMetaAnchorInPlace(a: HTMLAnchorElement | null, nameText: string): void {
  if (!a) return
  const name = normalizeText(nameText)
  if (!name) return

  const badgeRoots = collectBadgeNodesFromAnchor(a)
  const badges: Element[] = []

  for (const r of badgeRoots) {
    if (!r.isConnected) continue
    badges.push(r)
  }

  for (const b of badges) {
    try {
      b.parentNode?.removeChild(b)
    } catch {}
  }

  clearChildren(a)
  a.appendChild(document.createTextNode(name))

  for (const b of badges) {
    if (!isIconish(b)) continue
    const wrap = document.createElement("span")
    wrap.style.display = "inline-flex"
    wrap.style.alignItems = "center"
    wrap.style.marginLeft = "4px"
    wrap.appendChild(b)
    a.appendChild(wrap)
  }

  for (const s of Array.from(a.querySelectorAll(":scope > span"))) {
    const el = s as Element
    if (!el.querySelector || !isIconish(el)) el.remove()
  }
}

function detachMetaAnchorOnce(cfg: Cfg, state: State, lockup: Element): HTMLAnchorElement | null {
  if (state.movedMetaAnchors.has(lockup)) return state.movedMetaAnchors.get(lockup)?.a || null

  const a = pickChannelAnchor(lockup)
  if (!a || !a.parentNode) return null

  const parent = a.parentNode
  const nextSibling = a.nextSibling
  state.movedMetaAnchors.set(lockup, { a, parent, nextSibling })
  return a
}

export function restoreMovedMetaAnchors(state: State): void {
  const entries: Array<{ a: HTMLAnchorElement; parent: Node; nextSibling: ChildNode | null }> = []
  document.querySelectorAll("yt-lockup-view-model").forEach(lockup => {
    const info = state.movedMetaAnchors.get(lockup)
    if (!info) return
    entries.push(info)
  })

  for (const info of entries) {
    const { a, parent, nextSibling } = info
    if (!a || !parent) continue
    if (!a.isConnected) continue
    if (a.parentNode === parent) continue
    try {
      if (nextSibling && nextSibling.parentNode === parent) parent.insertBefore(a, nextSibling)
      else parent.appendChild(a)
    } catch {}
  }

  state.movedMetaAnchors = new WeakMap()
}

function setHeaderNameTextOnly(destLink: HTMLAnchorElement | null, lockup: Element): void {
  if (!destLink) return
  const href = getChannelHref(lockup)
  destLink.href = href || "javascript:void(0)"

  const src = pickChannelDisplaySource(lockup)
  setTextOnly(destLink, src?.textContent || "")
}

function getRightMetaRowsText(lockup: Element): string {
  const chName = getChannelName(lockup)
  const rows = Array.from(lockup.querySelectorAll("yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row"))
    .map(r => normalizeText((r as Element).textContent || ""))
    .filter(Boolean)
    .filter(t => (chName ? t !== chName : true))

  if (!rows.length) return ""

  const out: string[] = []
  const seen = new Set<string>()
  for (const t of rows) {
    const k = t.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    out.push(t)
  }

  if (!out.length) return ""
  if (out.length === 1) {
    if (chName && out[0] === chName) return ""
    return out[0] ?? ""
  }

  return out.slice(1).join(" • ")
}

export function ensureInlineMeta(cfg: Cfg, state: State, textContainer: Element, lockup: Element): Element {
  let row = textContainer.querySelector(`.${cfg.cls.metaRow}`)
  if (!row) {
    row = document.createElement("div")
    row.className = cfg.cls.metaRow

    const heading =
      textContainer.querySelector(".yt-lockup-metadata-view-model__heading-reset") || textContainer.querySelector("h3")
    if (heading && heading.parentNode) heading.parentNode.insertBefore(row, heading.nextSibling)
    else textContainer.appendChild(row)
  }

  ;(row as HTMLElement).style.display = "flex"

  let left = row.querySelector(`:scope > .${cfg.cls.metaCh}`)
  if (!left) {
    left = document.createElement("div")
    left.className = cfg.cls.metaCh
    row.appendChild(left)
  }

  const srcA = detachMetaAnchorOnce(cfg, state, lockup)
  const chName = getChannelName(lockup)

  if (srcA) {
    try {
      srcA.style.margin = "0"
    } catch {}
    normalizeMetaAnchorInPlace(srcA, chName)
    clearChildren(left)
    left.appendChild(srcA)
  } else {
    let link = left.querySelector("a")
    if (!link) {
      link = document.createElement("a")
      left.appendChild(link)
    }

    ;(link as HTMLAnchorElement).href = getChannelHref(lockup) || "javascript:void(0)"

    const src = pickChannelDisplaySource(lockup)
    if (src) cloneInto(link, src)
    else setTextOnly(link, chName || "")
  }

  const right = getRightMetaRowsText(lockup)
  let r = row.querySelector(`:scope > .${cfg.cls.metaRt}`)
  if (right) {
    if (!r) {
      r = document.createElement("div")
      r.className = cfg.cls.metaRt
      row.appendChild(r)
    }
    r.textContent = right
    ;(r as HTMLElement).style.display = ""
  } else if (r) {
    r.textContent = ""
    ;(r as HTMLElement).style.display = "none"
  }

  return row
}

export function ensureRowHeader(cfg: Cfg, state: State, item: Element, lockup: Element): void {
  if (!cfg.list.rowHead.enabled) return

  let head = item.querySelector(`:scope > .${cfg.cls.rowHead}`)
  if (!head) {
    head = document.createElement("div")
    head.className = cfg.cls.rowHead
    item.prepend(head)
  }

  ;(head as HTMLElement).style.display = "flex"

  let name = head.querySelector(`:scope > a.${cfg.cls.rowHeadName}`) as HTMLAnchorElement | null
  if (!name) {
    name = document.createElement("a")
    name.className = cfg.cls.rowHeadName
    head.appendChild(name)
  }

  setHeaderNameTextOnly(name, lockup)

  if (state.movedAvatars.has(item)) return
  const avatarEl = lockup.querySelector(".yt-lockup-metadata-view-model__avatar")
  if (!avatarEl || !avatarEl.parentNode) return

  const parent = avatarEl.parentNode
  const nextSibling = avatarEl.nextSibling
  state.movedAvatars.set(item, { avatarEl, parent, nextSibling })

  try {
    head.insertBefore(avatarEl, head.firstChild)
  } catch {}
}

export function restoreMovedAvatars(state: State): void {
  document.querySelectorAll("ytd-rich-item-renderer").forEach(item => {
    const info = state.movedAvatars.get(item)
    if (!info) return
    const { avatarEl, parent, nextSibling } = info
    if (!avatarEl || !parent) return
    if (!avatarEl.isConnected) return
    if (avatarEl.parentNode === parent) return
    try {
      if (nextSibling && nextSibling.parentNode === parent) parent.insertBefore(avatarEl, nextSibling)
      else parent.appendChild(avatarEl)
    } catch {}
  })
  state.movedAvatars = new WeakMap()
}
