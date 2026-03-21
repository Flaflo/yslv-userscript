import type { StorageProvider } from "../types/storage"

class SyncStorageProvider implements StorageProvider {
  private readonly api: chrome.storage.StorageArea

  constructor(api: chrome.storage.StorageArea) {
    this.api = api
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.api.get(key)
    return (result[key] as T) ?? null
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.api.set({ [key]: value })
  }

  async remove(key: string): Promise<void> {
    await this.api.remove(key)
  }
}

class LocalStorageProvider implements StorageProvider {
  get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(key)
    if (raw === null) return Promise.resolve(null)
    try {
      return Promise.resolve(JSON.parse(raw) as T)
    } catch {
      return Promise.resolve(null)
    }
  }

  set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
    return Promise.resolve()
  }

  remove(key: string): Promise<void> {
    localStorage.removeItem(key)
    return Promise.resolve()
  }
}

const chromeSyncApi = (globalThis as any).chrome?.storage?.sync ?? (globalThis as any).browser?.storage?.sync ?? null

export const syncProvider: StorageProvider = chromeSyncApi
  ? new SyncStorageProvider(chromeSyncApi)
  : new LocalStorageProvider()
