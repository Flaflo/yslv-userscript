import type { Cfg, ShimmerState, State } from "./types"
import { skNorm } from "./skeleton"

function hasSkeletons(cfg: Cfg): boolean {
  return !!document.querySelector(`.${cfg.cls.desc}.${cfg.cls.descSkel}`)
}

export function stopShimmer(cfg: Cfg, shimmer: ShimmerState): void {
  shimmer.running = false
  if (shimmer.raf) cancelAnimationFrame(shimmer.raf)
  shimmer.raf = 0
  document.documentElement.style.removeProperty(cfg.cssVars.shimmerX)
}

export function startShimmer(cfg: Cfg, state: State, shimmer: ShimmerState): void {
  if (shimmer.running) return
  shimmer.running = true
  shimmer.t0 = performance.now()

  const tick = (t: number) => {
    if (!shimmer.running) return

    const S = skNorm(cfg)
    if (!state.active || state.view !== "list" || !S.enabled || !hasSkeletons(cfg)) {
      stopShimmer(cfg, shimmer)
      return
    }

    const phase = ((t - shimmer.t0) % S.ms) / S.ms
    const x = 200 - phase * 400
    document.documentElement.style.setProperty(cfg.cssVars.shimmerX, `${x}%`)
    shimmer.raf = requestAnimationFrame(tick)
  }

  shimmer.raf = requestAnimationFrame(tick)
}
