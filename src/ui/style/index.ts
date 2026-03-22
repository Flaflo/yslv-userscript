import type { Cfg } from "../../types/config"
import type { State } from "../../types/state"
import { skNorm, invalidateSkNormCache } from "../../desc/skeleton"
import allCss from "./style.bundle.css?inline"

export { invalidateSkNormCache }

const STYLE_ID = "yslv-subs-style"

const YT_NATIVE_AVATAR_PX = 36

function setCssVars(cfg: Cfg): void {
  const s = document.documentElement.style
  const L = cfg.list

  s.setProperty("--yslv-max-w", typeof L.maxWidth === "number" ? `${L.maxWidth}px` : String(L.maxWidth))
  s.setProperty("--yslv-thumb-w", `${L.thumbW}px`)
  s.setProperty("--yslv-thumb-r", `${L.thumbRadius}px`)
  s.setProperty("--yslv-row-pad-y", `${L.rowPadY}px`)
  s.setProperty("--yslv-separator", L.separator ? "1" : "0")
  s.setProperty("--yslv-title-clamp", String(L.titleClamp))
  s.setProperty("--yslv-desc-clamp", String(L.descClamp))
  s.setProperty("--yslv-head-gap", `${L.rowHead.gap}px`)
  s.setProperty("--yslv-head-mb", `${L.rowHead.marginBottom}px`)
  s.setProperty("--yslv-head-av-scale", String(L.rowHead.avatarSize / YT_NATIVE_AVATAR_PX))
  s.setProperty("--yslv-meta-gap", `${L.metaRow.gap}px`)
  s.setProperty("--yslv-short-w", `${L.shorts.cardW}px`)
  s.setProperty("--yslv-desc-mt", `${L.desc.marginTop}px`)
  s.setProperty("--yslv-hide-most-relevant", L.hideMostRelevant ? "none" : "block")
  s.setProperty("--yslv-hide-shorts", L.hideShorts ? "none" : "")
  s.setProperty("--yslv-hide-mini-guide", L.hideMiniGuide ? "none" : "")
  s.setProperty("--yslv-mini-guide-margin", L.hideMiniGuide ? "0" : "")

  const sk = skNorm(cfg)
  s.setProperty("--yslv-skl-enabled", sk.enabled ? "block" : "none")
  s.setProperty("--yslv-skl-gap", `${sk.gap}px`)
  s.setProperty("--yslv-skl-r", `${sk.r}px`)
  s.setProperty("--yslv-skl-maxw", `${sk.maxW}px`)
  s.setProperty("--yslv-skl-ms", `${sk.ms}ms`)
  for (let i = 0; i < 3; i++) {
    s.setProperty(`--yslv-skl-h${i + 1}`, `${sk.h(i)}px`)
    s.setProperty(`--yslv-skl-w${i + 1}`, `${sk.w(i)}%`)
  }
}

export function ensureStyle(cfg: Cfg, state: State): void {
  if (state.styleEl) return
  const el = document.createElement("style")
  el.id = STYLE_ID
  el.textContent = allCss
  document.head.appendChild(el)
  state.styleEl = el
  setCssVars(cfg)
}

export function rebuildStyle(cfg: Cfg, state: State): void {
  if (!state.styleEl) {
    ensureStyle(cfg, state)
    return
  }
  setCssVars(cfg)
}
