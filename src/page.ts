export function isSubsPage(): boolean {
  return location.pathname === "/feed/subscriptions"
}

export function getActiveSubsBrowse(): Element | null {
  return (
    document.querySelector('ytd-page-manager ytd-browse[page-subtype="subscriptions"]:not([hidden])') ||
    document.querySelector('ytd-browse[page-subtype="subscriptions"]:not([hidden])') ||
    null
  )
}

export function getActiveSubsRoot(): Element | null {
  const b = getActiveSubsBrowse()
  if (!b) return null
  return b.querySelector("ytd-rich-grid-renderer #contents") || b.querySelector("ytd-rich-grid-renderer") || b
}

export function getActiveSubsDoc(): Document | Element {
  return getActiveSubsBrowse() || document
}

export function pageSig(): string {
  return `${location.pathname}|${location.search}|${document.querySelector("ytd-page-manager") ? "pm" : "nopm"}`
}
