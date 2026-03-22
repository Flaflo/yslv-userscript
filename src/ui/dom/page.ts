import { SEL_PAGE } from "../../core/selectors"

export function isSubsPage(): boolean {
  return location.pathname === "/feed/subscriptions"
}

export function getActiveSubsBrowse(): Element | null {
  return document.querySelector(SEL_PAGE.subsBrowsePm) || document.querySelector(SEL_PAGE.subsBrowse) || null
}

export function getActiveSubsRoot(): Element | null {
  const b = getActiveSubsBrowse()
  if (!b) return null
  return b.querySelector(SEL_PAGE.richGridContents) || b.querySelector(SEL_PAGE.richGrid) || b
}

export function getActiveSubsDoc(): Document | Element {
  return getActiveSubsBrowse() || document
}

export function pageSig(): string {
  return `${location.pathname}|${location.search}|${document.querySelector(SEL_PAGE.pageManager) ? "pm" : "nopm"}`
}
