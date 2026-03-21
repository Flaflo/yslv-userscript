import grid from "./grid.svg?icondef"
import list from "./list.svg?icondef"
import settings from "./settings.svg?icondef"
import close from "./close.svg?icondef"

const SVG_NS = "http://www.w3.org/2000/svg"

type IconDef = { viewBox: string; paths: string[] }

function createIcon(def: IconDef): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg")
  svg.setAttribute("viewBox", def.viewBox)
  const parts = def.viewBox.split(" ")
  const w = parts[2] ?? "24"
  const h = parts[3] ?? "24"
  svg.setAttribute("width", w)
  svg.setAttribute("height", h)
  svg.style.fill = "currentColor"
  for (const d of def.paths) {
    const path = document.createElementNS(SVG_NS, "path")
    path.setAttribute("d", d)
    svg.appendChild(path)
  }
  return svg
}

export const icons = {
  grid: () => createIcon(grid),
  list: () => createIcon(list),
  settings: () => createIcon(settings),
  close: () => createIcon(close),
} as const
