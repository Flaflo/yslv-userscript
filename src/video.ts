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
      const id = idx >= 0 ? String(parts[idx + 1] || "") : ""
      return id
    } catch {
      const m = h.match(/\/shorts\/([^?&#/]+)/)
      return m ? m[1] ?? "" : ""
    }
  }

  try {
    const u = new URL(h, location.origin)
    return u.searchParams.get("v") || ""
  } catch {
    const m = h.match(/[?&]v=([^&]+)/)
    return m ? m[1] ?? "" : ""
  }
}

export function pickPrimaryVideoAnchor(lockup: Element): HTMLAnchorElement | null {
  return (
    (lockup.querySelector('a.yt-lockup-view-model__content-image[href^="/watch"]') as HTMLAnchorElement | null) ||
    (lockup.querySelector('a.yt-lockup-view-model__content-image[href^="/shorts/"]') as HTMLAnchorElement | null) ||
    (lockup.querySelector('a[href^="/watch"][id="thumbnail"]') as HTMLAnchorElement | null) ||
    (lockup.querySelector('a[href^="/shorts/"][id="thumbnail"]') as HTMLAnchorElement | null) ||
    (lockup.querySelector('a[href^="/shorts/"].reel-item-endpoint') as HTMLAnchorElement | null) ||
    (lockup.querySelector('a[href^="/watch"]') as HTMLAnchorElement | null) ||
    (lockup.querySelector('a[href^="/shorts/"]') as HTMLAnchorElement | null) ||
    null
  )
}
