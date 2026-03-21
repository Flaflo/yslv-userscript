import { SEL_VIDEO_ANCHORS } from "../core/selectors"

export function isShortsHref(href: string): boolean {
  const h = String(href || "")
  return h.startsWith("/shorts/") || h.includes("youtube.com/shorts/")
}

export function extractVideoIdFromHref(href: string): string {
  const h = String(href || "")
  if (!h) return ""

  if (isShortsHref(h)) {
    try {
      const u = new URL(h, location.origin)
      const parts = u.pathname.split("/").filter(Boolean)
      const idx = parts.indexOf("shorts")
      return idx >= 0 ? String(parts[idx + 1] || "") : ""
    } catch {
      const m = h.match(/\/shorts\/([^?&#/]+)/)
      return m ? (m[1] ?? "") : ""
    }
  }

  try {
    const u = new URL(h, location.origin)
    return u.searchParams.get("v") || ""
  } catch {
    const m = h.match(/[?&]v=([^&]+)/)
    return m ? (m[1] ?? "") : ""
  }
}

export function pickPrimaryVideoAnchor(lockup: Element): HTMLAnchorElement | null {
  for (const sel of SEL_VIDEO_ANCHORS) {
    const el = lockup.querySelector(sel) as HTMLAnchorElement | null
    if (el) return el
  }
  return null
}
