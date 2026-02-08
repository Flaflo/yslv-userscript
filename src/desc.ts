import type {Cfg, DescStoreState, State} from "./types"
import {clearChildren} from "./dom"
import {skNorm} from "./skeleton"
import {extractVideoIdFromHref, pickPrimaryVideoAnchor} from "./video"
import {getStoredDesc, pruneDescStore, setStoredDesc} from "./descStore"

export function ensureDesc(cfg: Cfg, state: State, store: DescStoreState, textContainer: Element, lockup: Element): void {
  let desc = textContainer.querySelector(`.${cfg.cls.desc}`) as HTMLElement | null
  if (!desc) {
    desc = document.createElement("div")
    desc.className = cfg.cls.desc
    textContainer.appendChild(desc)
  }

  const vLink = pickPrimaryVideoAnchor(lockup)
  const href = vLink?.getAttribute?.("href") || ""
  const vid = extractVideoIdFromHref(href)

  if (!vid) {
    desc.textContent = ""
    desc.style.display = "none"
    desc.classList.remove(cfg.cls.descSkel)
    delete (desc.dataset as any).yslvVid
    return
  }

  ;(desc.dataset as any).yslvVid = vid

  const mem = state.descCache.get(vid)
  if (mem != null) {
    desc.textContent = mem
    desc.style.display = mem ? "" : "none"
    desc.classList.remove(cfg.cls.descSkel)
    return
  }

  const stored = getStoredDesc(cfg, store, vid)
  if (stored != null) {
    state.descCache.set(vid, stored)
    desc.textContent = stored
    desc.style.display = stored ? "" : "none"
    desc.classList.remove(cfg.cls.descSkel)
    return
  }

  const S = skNorm(cfg)
  if (!S.enabled) {
    desc.textContent = ""
    desc.style.display = "none"
    desc.classList.remove(cfg.cls.descSkel)
    return
  }

  desc.style.display = ""
  desc.classList.add(cfg.cls.descSkel)

  const needs = desc.childElementCount !== S.lines || !desc.querySelector(":scope > span")
  if (needs) {
    clearChildren(desc)
    for (let i = 0; i < S.lines; i++) desc.appendChild(document.createElement("span"))
  }
}

export function summarizeDesc(raw: string, sentenceCount: number, maxChars: number): string {
  let s = String(raw || "").trim()
  if (!s) return ""

  s = s.replace(/\r/g, "").replace(/\n{2,}/g, "\n").replace(/[ \t]{2,}/g, " ").trim()

  const seg =
    typeof Intl !== "undefined" && (Intl as any).Segmenter
      ? new (Intl as any).Segmenter(undefined, { granularity: "sentence" })
      : null

  if (seg) {
    const out: string[] = []
    for (const part of seg.segment(s)) {
      const t = String(part.segment || "").trim()
      if (!t) continue
      out.push(t)
      if (out.length >= sentenceCount) break
    }
    s = out.join(" ").trim()
  } else {
    const urls: string[] = []
    s = s.replace(/\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+/gi, m => {
      const k = `__YSU${urls.length}__`
      urls.push(m)
      return k
    })

    const parts = s.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean)
    s = parts.slice(0, sentenceCount).join(" ").trim()
    s = s.replace(/__YSU(\d+)__/g, (_, i) => urls[Number(i)] || "")
  }

  if (s.length > maxChars) s = s.slice(0, maxChars).trimEnd() + "…"
  return s
}

export async function fetchDescriptionForVideoId(cfg: Cfg, state: State, store: DescStoreState, vid: string): Promise<string> {
  const F = cfg.list.descFetch
  if (!F.enabled) return ""
  if (!vid) return ""

  const mem = state.descCache.get(vid)
  if (mem != null) return mem

  const stored = getStoredDesc(cfg, store, vid)
  if (stored != null) {
    state.descCache.set(vid, stored)
    return stored
  }

  if (state.descInFlight.has(vid)) return state.descInFlight.get(vid) as Promise<string>
  if (state.descFetches >= F.maxTotalFetchesPerNav) return ""

  const p = (async () => {
    while (state.descActive >= F.maxConcurrent) {
      await new Promise<void>(r => setTimeout(r, 35))
    }
    state.descActive++
    state.descFetches++
    try {
      const res = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`, { credentials: "same-origin" })
      const html = await res.text()
      const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{.*?});/s)
      if (!m) return ""
      const json = JSON.parse(m[1]!) as any
      const raw = String(json?.videoDetails?.shortDescription || "").trim()
      if (!raw) return ""
      return summarizeDesc(raw, F.sentenceCount, F.maxChars)
    } catch {
      return ""
    } finally {
      state.descActive--
    }
  })()

  state.descInFlight.set(vid, p)
  const out = await p
  state.descInFlight.delete(vid)

  state.descCache.set(vid, out)
  setStoredDesc(cfg, store, vid, out)
  pruneDescStore(cfg, store)

  return out
}

export function updateDescDomForVid(cfg: Cfg, vid: string, text: string): void {
  const nodes = document.querySelectorAll(`.${cfg.cls.desc}[data-yslv-vid="${CSS.escape(vid)}"]`)
  for (const n of Array.from(nodes)) {
    const el = n as HTMLElement
    if (!el.isConnected) continue
    el.classList.remove(cfg.cls.descSkel)
    clearChildren(el)
    el.textContent = text || ""
    el.style.display = text ? "" : "none"
  }
}

export function buildDescQueueFromDom(cfg: Cfg, state: State, store: DescStoreState): void {
  if (!state.active || state.view !== "list") return
  const descs = document.querySelectorAll(`.${cfg.cls.desc}[data-yslv-vid]`)
  if (!descs.length) return

  let sig = ""
  for (const d of Array.from(descs)) {
    const vid = (d as HTMLElement).dataset.yslvVid || ""
    if (!vid) continue
    sig += `${vid}|`
  }
  if (sig === state.lastQueueSig) return
  state.lastQueueSig = sig

  for (const d of Array.from(descs)) {
    const vid = (d as HTMLElement).dataset.yslvVid || ""
    if (!vid) continue

    const stored = getStoredDesc(cfg, store, vid)
    if (stored != null) {
      state.descCache.set(vid, stored)
      updateDescDomForVid(cfg, vid, stored)
      continue
    }

    if (state.descCache.has(vid)) continue
    if (state.descInFlight.has(vid)) continue
    if (state.descQueued.has(vid)) continue
    state.descQueued.add(vid)
    state.descQueue.push(vid)
  }
}
