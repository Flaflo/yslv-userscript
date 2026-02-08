import type { Cfg, SkeletonNorm } from "./types"

export function skNorm(cfg: Cfg): SkeletonNorm {
  const s = cfg.list.desc.skeleton || ({} as Cfg["list"]["desc"]["skeleton"])

  const lines = Math.max(1, Math.min(3, Number(s.lines) || 1))
  const gap = Math.max(0, Number(s.lineGap) || 6)
  const heights = Array.isArray(s.lineHeights) ? s.lineHeights : [12, 12, 12]
  const widths = Array.isArray(s.lineWidthsPct) ? s.lineWidthsPct : [82, 74, 58]
  const h = (i: number) => Math.max(10, Number(heights[i] ?? heights[0] ?? 12))
  const w = (i: number) => Math.max(35, Math.min(100, Number(widths[i] ?? widths[0] ?? 82)))
  const r = Math.max(6, Number(s.radius) || 9)
  const maxW = Math.max(160, Number(s.maxW) || 520)
  const ms = Math.max(650, Number(s.animMs) || 5000)

  return { enabled: s.enabled, lines, gap, h, w, r, maxW, ms }
}
