import type { Cfg } from "../types/config"
import type { State } from "../types/state"
import { clearChildren, cloneInto, normalizeText, setTextOnly } from "../ui/dom/helpers"
import { SEL_YSLV, SEL_CHANNEL, SEL_LOCKUP, SEL_PAGE } from "../core/selectors"

function pickChannelDisplaySource(lockup: Element): Element | null {
  const a =
    lockup.querySelector(SEL_CHANNEL.anchorMetaHandle) ||
    lockup.querySelector(SEL_CHANNEL.anchorMetaId) ||
    lockup.querySelector(SEL_CHANNEL.anchorHandle) ||
    lockup.querySelector(SEL_CHANNEL.anchorId) ||
    null

  if (a) return a

  return lockup.querySelector(SEL_CHANNEL.textSpan) || null
}

function pickChannelAnchor(lockup: Element): HTMLAnchorElement | null {
  return (lockup.querySelector(SEL_CHANNEL.anchorMetaHandle) ||
    lockup.querySelector(SEL_CHANNEL.anchorMetaId) ||
    lockup.querySelector(SEL_CHANNEL.anchorHandle) ||
    lockup.querySelector(SEL_CHANNEL.anchorId) ||
    null) as HTMLAnchorElement | null
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

function detachMetaAnchorOnce(state: State, lockup: Element): HTMLAnchorElement | null {
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
  document.querySelectorAll(SEL_LOCKUP.root).forEach((lockup) => {
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
      a.style.margin = ""
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
  const rows = Array.from(lockup.querySelectorAll(SEL_LOCKUP.metadataRow))
    .map((r) => normalizeText((r as Element).textContent || ""))
    .filter(Boolean)
    .filter((t) => (chName ? t !== chName : true))

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
  let row = textContainer.querySelector(`.${SEL_YSLV.metaRow}`)
  if (!row) {
    row = document.createElement("div")
    row.className = SEL_YSLV.metaRow

    const heading = textContainer.querySelector(SEL_LOCKUP.headingReset) || textContainer.querySelector("h3")
    if (heading && heading.parentNode) heading.parentNode.insertBefore(row, heading.nextSibling)
    else textContainer.appendChild(row)
  }

  ;(row as HTMLElement).style.display = "flex"

  let left = row.querySelector(`:scope > .${SEL_YSLV.metaCh}`)
  if (!left) {
    left = document.createElement("div")
    left.className = SEL_YSLV.metaCh
    row.appendChild(left)
  }

  const srcA = detachMetaAnchorOnce(state, lockup)
  const chName = getChannelName(lockup)

  if (srcA) {
    try {
      srcA.style.margin = "0"
    } catch {}
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
  let r = row.querySelector(`:scope > .${SEL_YSLV.metaRt}`)
  if (right) {
    if (!r) {
      r = document.createElement("div")
      r.className = SEL_YSLV.metaRt
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

  let head = item.querySelector(`:scope > .${SEL_YSLV.rowHead}`)
  if (!head) {
    head = document.createElement("div")
    head.className = SEL_YSLV.rowHead
    item.prepend(head)
  }

  ;(head as HTMLElement).style.display = "flex"

  let name = head.querySelector(`:scope > a.${SEL_YSLV.rowHeadName}`) as HTMLAnchorElement | null
  if (!name) {
    name = document.createElement("a")
    name.className = SEL_YSLV.rowHeadName
    head.appendChild(name)
  }

  setHeaderNameTextOnly(name, lockup)

  if (state.movedAvatars.has(item)) return
  const avatarEl = lockup.querySelector(SEL_LOCKUP.avatar)
  if (!avatarEl || !avatarEl.parentNode) return

  const parent = avatarEl.parentNode
  const nextSibling = avatarEl.nextSibling
  state.movedAvatars.set(item, { avatarEl, parent, nextSibling })

  try {
    head.insertBefore(avatarEl, head.firstChild)
  } catch {}
}

export function restoreMovedAvatars(state: State): void {
  document.querySelectorAll(SEL_PAGE.richItem).forEach((item) => {
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
