import {
  SEL_PAGE_MANAGER,
  SEL_RICH_GRID,
  SEL_RICH_GRID_CONTENTS,
  SEL_SUBS_BROWSE,
  SEL_SUBS_BROWSE_PM,
} from "../../core/selectors"

export function isSubsPage(): boolean {
  return location.pathname === "/feed/subscriptions"
}

export function getActiveSubsBrowse(): Element | null {
  return document.querySelector(SEL_SUBS_BROWSE_PM) || document.querySelector(SEL_SUBS_BROWSE) || null
}

export function getActiveSubsRoot(): Element | null {
  const b = getActiveSubsBrowse()
  if (!b) return null
  return b.querySelector(SEL_RICH_GRID_CONTENTS) || b.querySelector(SEL_RICH_GRID) || b
}

export function getActiveSubsDoc(): Document | Element {
  return getActiveSubsBrowse() || document
}

export function pageSig(): string {
  return `${location.pathname}|${location.search}|${document.querySelector(SEL_PAGE_MANAGER) ? "pm" : "nopm"}`
}
