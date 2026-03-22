import { CFG } from "./core/config"
import { createApp } from "./core/app"
import { createState } from "./core/state"
import { createDescCache, DESC_CACHE_KEY } from "./storage/desc-cache"
import { loadSettings, applySettingsToCfg } from "./storage/settings"
import { openSettingsModal } from "./ui/settings/modal"
import { rebuildStyle, invalidateSkNormCache } from "./ui/style"

export async function initYSLV() {
  const settings = await loadSettings()
  applySettingsToCfg(CFG, settings)

  const state = createState()
  const cache = createDescCache({
    key: DESC_CACHE_KEY,
    ttlMs: CFG.descStore.ttlMs,
    maxEntries: CFG.descStore.maxEntries,
    saveDebounceMs: CFG.descStore.saveDebounceMs,
  })

  const onChanged = async () => {
    const updated = await loadSettings()
    applySettingsToCfg(CFG, updated)
    invalidateSkNormCache()
    rebuildStyle(CFG, state)
  }

  const app = createApp(CFG, state, cache, () => void openSettingsModal(onChanged))
  app.init()
}
