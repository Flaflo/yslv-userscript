import type { Cfg } from "../types/config"
import type { UserSettings } from "../types/settings"
import type { ViewMode } from "../types/state"
import { syncProvider } from "./provider"

export type { UserSettings }

const SETTINGS_KEY = "yslv_settings"

export function defaultSettings(): UserSettings {
  return {
    defaultView: "grid" as ViewMode,
    maxWidth: 1320,
    thumbW: 240,
    thumbRadius: 14,
    separator: true,
    titleClamp: 2,
    descClamp: 2,
    hideMostRelevant: true,
    hideShorts: false,
    fetchDesc: true,
    sentenceCount: 2,
    maxDescChars: 260,
    showSkeleton: true,
  }
}

function isValidSettings(v: unknown): v is Partial<UserSettings> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

export async function loadSettings(): Promise<UserSettings> {
  const defaults = defaultSettings()
  const raw = await syncProvider.get<Record<string, unknown>>(SETTINGS_KEY)
  if (!raw || !isValidSettings(raw)) return defaults

  const s = { ...defaults }
  if (raw.defaultView === "grid" || raw.defaultView === "list") s.defaultView = raw.defaultView
  if (typeof raw.maxWidth === "number" && raw.maxWidth >= 600) s.maxWidth = raw.maxWidth
  if (typeof raw.thumbW === "number") s.thumbW = raw.thumbW
  if (typeof raw.thumbRadius === "number") s.thumbRadius = raw.thumbRadius
  if (typeof raw.separator === "boolean") s.separator = raw.separator
  if (typeof raw.titleClamp === "number") s.titleClamp = raw.titleClamp
  if (typeof raw.descClamp === "number") s.descClamp = raw.descClamp
  if (typeof raw.hideMostRelevant === "boolean") s.hideMostRelevant = raw.hideMostRelevant
  if (typeof raw.hideShorts === "boolean") s.hideShorts = raw.hideShorts
  if (typeof raw.fetchDesc === "boolean") s.fetchDesc = raw.fetchDesc
  if (typeof raw.sentenceCount === "number") s.sentenceCount = raw.sentenceCount
  if (typeof raw.maxDescChars === "number") s.maxDescChars = raw.maxDescChars
  if (typeof raw.showSkeleton === "boolean") s.showSkeleton = raw.showSkeleton
  return s
}

export async function saveSettings(s: UserSettings): Promise<void> {
  await syncProvider.set(SETTINGS_KEY, s)
}

export function applySettingsToCfg(cfg: Cfg, s: UserSettings): void {
  cfg.defaultView = s.defaultView
  cfg.list.maxWidth = s.maxWidth
  cfg.list.thumbW = s.thumbW
  cfg.list.thumbRadius = s.thumbRadius
  cfg.list.separator = s.separator
  cfg.list.titleClamp = s.titleClamp
  cfg.list.descClamp = s.descClamp
  cfg.list.hideMostRelevant = s.hideMostRelevant
  cfg.list.hideShorts = s.hideShorts
  cfg.list.descFetch.enabled = s.fetchDesc
  cfg.list.descFetch.sentenceCount = s.sentenceCount
  cfg.list.descFetch.maxChars = s.maxDescChars
  cfg.list.desc.skeleton.enabled = s.showSkeleton
}
