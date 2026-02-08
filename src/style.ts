import type { Cfg, SkeletonNorm, State } from "./types"
import { skNorm } from "./skeleton"
// @ts-ignore
import patchesCss from "./styles/patches.css?raw"

function px(n: number): string {
  return `${n}px`
}

function cssMaxWidth(v: number | string): string {
  if (typeof v === "number") return `${Math.max(0, v)}px`
  const s = String(v).trim()
  return s || "1120px"
}

type Tokens = Record<string, string>

function applyTokens(template: string, tokens: Tokens): string {
  let out = template
  for (const [k, v] of Object.entries(tokens)) out = out.split(k).join(v)
  return out
}

function skeletonTokens(S: SkeletonNorm): Tokens {
  const enabled = S.enabled ? "block" : "none"
  return {
    "__SKL_ENABLED__": enabled,
    "__SKL_LINES__": String(S.lines),
    "__SKL_GAP__": px(S.gap),
    "__SKL_R__": px(S.r),
    "__SKL_MAXW__": px(S.maxW),
    "__SKL_MS__": String(S.ms),
    "__SKL_H1__": px(S.h(0)),
    "__SKL_H2__": px(S.h(1)),
    "__SKL_H3__": px(S.h(2)),
    "__SKL_W1__": `${S.w(0)}%`,
    "__SKL_W2__": `${S.w(1)}%`,
    "__SKL_W3__": `${S.w(2)}%`,
  }
}

export function buildStyleText(cfg: Cfg): string {
  const L = cfg.list
  const S = skNorm(cfg)

  const tokens: Tokens = {
    "__ATTR__": cfg.attr.view,
    "__TOGGLE_ID__": cfg.ids.toggle,
    "__BTN__": cfg.cls.btn,
    "__BTN_ICON__": cfg.cls.btnIcon,
    "__ROWHEAD__": cfg.cls.rowHead,
    "__ROWHEAD_NAME__": cfg.cls.rowHeadName,
    "__METAROW__": cfg.cls.metaRow,
    "__METACH__": cfg.cls.metaCh,
    "__METART__": cfg.cls.metaRt,
    "__DESC__": cfg.cls.desc,
    "__DESCSKEL__": cfg.cls.descSkel,
    "__ISSHORT__": cfg.cls.isShort,

    "__MAX_W__": cssMaxWidth(L.maxWidth),
    "__ROW_PAD_Y__": px(Math.max(8, Number(L.rowPadY) || 22)),
    "__THUMB_W__": px(Math.max(240, Number(L.thumbW) || 240)),
    "__RADIUS__": px(Math.max(0, Number(L.thumbRadius) || 14)),
    "__TITLE_CLAMP__": String(Math.max(1, Number(L.titleClamp) || 2)),
    "__DESC_CLAMP__": String(Math.max(1, Number(L.descClamp) || 2)),
    "__DESC_MT__": px(Math.max(4, Number(L.desc.marginTop) || 10)),

    "__HEAD_GAP__": px(Math.max(6, Number(L.rowHead.gap) || 12)),
    "__HEAD_MB__": px(Math.max(6, Number(L.rowHead.marginBottom) || 20)),
    "__HEAD_AV__": px(Math.max(20, Number(L.rowHead.avatarSize) || 32)),

    "__META_GAP__": px(Math.max(6, Number(L.metaRow.gap) || 8)),
    "__SHORT_W__": px(Math.max(110, Number(L.shorts.cardW) || 170)),

    "__SHIMMER_VAR__": cfg.cssVars.shimmerX,
    "__SHORTW_VAR__": cfg.cssVars.shortW,
    ...skeletonTokens(S),
  }

  return applyTokens(String(patchesCss || ""), tokens).trim()
}

export function ensureStyle(cfg: Cfg, state: State): void {
  if (state.styleEl) return

  const el = document.createElement("style")
  el.id = cfg.ids.style
  el.textContent = buildStyleText(cfg)

  document.documentElement.appendChild(el)
  state.styleEl = el
}
